import type { Request, Response, NextFunction } from 'express';
import { requireAuth } from './auth';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return requireAuth(req, res, next);
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next();
}
