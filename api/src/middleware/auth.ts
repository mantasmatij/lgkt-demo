import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

export type SessionUser = {
  id: string;
  email: string;
  role: string;
};

export type AuthSession = {
  user: SessionUser;
  issuedAt: number;
};

// Extend Express Request to include session
declare module 'express-serve-static-core' {
  interface Request {
    session?: AuthSession;
  }
}

// Session storage (in-memory for dev; use Redis/DB in production)
const sessions = new Map<string, AuthSession>();

export function createSession(user: SessionUser): string {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, {
    user,
    issuedAt: Date.now(),
  });
  return sessionId;
}

export function getSession(sessionId: string): AuthSession | undefined {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

// Middleware to parse session from cookie and attach to req.session
export function parseSession(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.signedCookies?.sessionId;
  if (sessionId) {
    const session = getSession(sessionId);
    if (session) {
      req.session = session;
    }
  }
  next();
}

// Middleware to require authentication
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Authentication required' });
  }
  return next();
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // Cross-site cookie for web<->api on different domains
  sameSite: 'none' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  signed: true,
};
