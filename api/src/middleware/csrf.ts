import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const CSRF_COOKIE_NAME = 'csrf-token';

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function setCsrfCookie(res: Response) {
  const token = generateToken();
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // must be readable by client to echo via header
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  return token;
}

function isMutating(method: string) {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
}

// Double-submit cookie strategy: require X-CSRF-Token header to match cookie on mutating requests.
type CookieRequest = Request & { cookies?: Record<string, string> };

export function csrfCheck(req: Request, res: Response, next: NextFunction) {
  if (!isMutating(req.method)) return next();

  const headerToken = (req.headers['x-csrf-token'] as string | undefined) || '';
  const cookieToken = (req as CookieRequest).cookies?.[CSRF_COOKIE_NAME] as string | undefined;

  if (!cookieToken) {
    return res.status(403).json({ code: 'CSRF_MISSING', message: 'Missing CSRF cookie' });
  }
  if (!headerToken) {
    return res.status(403).json({ code: 'CSRF_HEADER_MISSING', message: 'Missing CSRF header' });
  }
  if (headerToken !== cookieToken) {
    return res.status(403).json({ code: 'CSRF_INVALID', message: 'Invalid CSRF token' });
  }
  return next();
}

// Helper route handler to ensure a CSRF token is set and return it.
export function issueCsrfToken(_req: Request, res: Response) {
  const token = setCsrfCookie(res);
  return res.json({ token });
}
