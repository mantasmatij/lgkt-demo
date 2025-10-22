import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

export type SessionUser = {
  id: string;
  email: string;
};

export type AuthSession = {
  user: SessionUser;
  issuedAt: number;
};

// Placeholder session checker. Will be replaced with proper session storage.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // TODO: Read from signed cookie / header and validate session
  // For now, pass-through; protected routes should replace this during US2.
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
  sameSite: 'lax' as const,
  path: '/',
  // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
