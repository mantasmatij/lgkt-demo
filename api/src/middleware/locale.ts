import type { Request, Response, NextFunction } from 'express';
import { cookieOptions } from './auth';

export type Locale = 'lt' | 'en';

const DEFAULT_LOCALE: Locale = 'lt';
export const LOCALE_SESSION_COOKIE = 'localeSessionId';

type LocaleSession = {
  locale: Locale;
  updatedAt: number;
};

// In-memory store for locale sessions (dev-friendly). Consider Redis for prod.
const localeSessions = new Map<string, LocaleSession>();

// Extend Express Request to include locale
declare module 'express-serve-static-core' {
  interface Request {
    locale?: Locale;
  }
}

function getSessionId(req: Request): string | undefined {
  return req.signedCookies?.[LOCALE_SESSION_COOKIE] as string | undefined;
}

function createSession(res: Response): string {
  const sessionId = globalThis.crypto?.randomUUID?.() ?? require('crypto').randomUUID();
  // Default to Lithuanian on creation
  localeSessions.set(sessionId, { locale: DEFAULT_LOCALE, updatedAt: Date.now() });
  res.cookie(LOCALE_SESSION_COOKIE, sessionId, { ...cookieOptions, path: '/' });
  return sessionId;
}

export function getLocale(req: Request): Locale {
  const id = getSessionId(req);
  if (!id) return DEFAULT_LOCALE;
  const sess = localeSessions.get(id);
  return sess?.locale ?? DEFAULT_LOCALE;
}

export function setLocale(req: Request, res: Response, locale: Locale): void {
  let id = getSessionId(req);
  if (!id) {
    id = createSession(res);
  }
  localeSessions.set(id, { locale, updatedAt: Date.now() });
}

// Middleware to attach req.locale for downstream handlers
export function attachLocale(req: Request, res: Response, next: NextFunction) {
  req.locale = getLocale(req);
  return next();
}
