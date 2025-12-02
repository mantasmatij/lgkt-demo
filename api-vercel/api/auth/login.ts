import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enableCors, badRequest, unauthorized, ok, readJson } from '../../lib/http';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { sign, setSessionCookie } from '../../lib/session';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function signSession(payload: object, secret: string) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = Buffer.from(require('crypto').createHmac('sha256', secret).update(data).digest('base64url')).toString();
  return `${data}.${sig}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (enableCors(req, res)) return;
  if (req.method !== 'POST') return badRequest(res, 'POST required');
  if (!process.env.DATABASE_URL) return badRequest(res, 'Missing DATABASE_URL');
  if (!process.env.SESSION_SECRET) return badRequest(res, 'Missing SESSION_SECRET');

  const body = await readJson<{ email?: string; password?: string }>(req);
  const email = body?.email?.toLowerCase();
  const password = body?.password || '';
  if (!email || !password) return badRequest(res, 'email and password required');

  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT id, email, password_hash FROM admin_users WHERE LOWER(email) = $1 LIMIT 1', [email]);
    const user = rows[0];
    if (!user) return unauthorized(res, 'Invalid credentials');
    const okPw = await bcrypt.compare(password, user.password_hash);
    if (!okPw) return unauthorized(res, 'Invalid credentials');

    const token = sign({ uid: user.id, email: user.email, at: Date.now() }, process.env.SESSION_SECRET!);
    setSessionCookie(res, token);
    ok(res, { ok: true });
  } finally {
    client.release();
  }
}
