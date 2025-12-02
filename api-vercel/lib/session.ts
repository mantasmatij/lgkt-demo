import type { VercelResponse, VercelRequest } from '@vercel/node';
import cookie from 'cookie';
import crypto from 'crypto';

export type SessionPayload = { uid: string | number; email: string; at: number };

export function sign(payload: SessionPayload, secret: string): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verify(token: string, secret: string): SessionPayload | null {
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;
  const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as SessionPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(res: VercelResponse, token: string) {
  const cookieStr = cookie.serialize('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  res.setHeader('Set-Cookie', cookieStr);
}

export function clearSessionCookie(res: VercelResponse) {
  const cookieStr = cookie.serialize('session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 0,
  });
  res.setHeader('Set-Cookie', cookieStr);
}

export function getSessionToken(req: VercelRequest): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const parsed = cookie.parse(raw);
  return parsed.session || null;
}
