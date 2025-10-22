import { Router } from 'express';
import { getDb, adminUsers } from 'db';
import { eq } from 'drizzle-orm';
import { verifyPassword, createSession, cookieOptions, deleteSession, requireAuth } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Email and password required' });
    }

    const db = getDb();
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

    if (!user) {
      return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
    }

    // Create session
    const sessionId = createSession({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Update last login
    await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));

    // Set session cookie
    res.cookie('sessionId', sessionId, cookieOptions);

    return res.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    return next(err);
  }
});

authRouter.post('/logout', requireAuth, (req, res) => {
  const sessionId = req.signedCookies?.sessionId;
  if (sessionId) {
    deleteSession(sessionId);
  }
  res.clearCookie('sessionId', cookieOptions);
  return res.json({ ok: true });
});

authRouter.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.session?.user });
});
