import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enableCors, ok } from '../../lib/http';
import { clearSessionCookie } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (enableCors(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }
  clearSessionCookie(res);
  ok(res, { ok: true });
}
