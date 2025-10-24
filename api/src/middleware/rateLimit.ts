import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// In development/test, use much higher limits to avoid blocking E2E tests
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Rate limiter for CSV export endpoint
 * Production: 10 requests per 15 minutes per IP
 * Development: 1000 requests per 15 minutes per IP
 */
export const csvExportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 10, // Much higher limit in dev/test
  message: {
    error: 'Too many export requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many export requests from this IP, please try again later.',
      retryAfter: '15 minutes',
    });
  },
});

/**
 * Rate limiter for authentication endpoints
 * Production: 5 login attempts per 15 minutes per IP
 * Development: 100 login attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 100 : 5, // Much higher limit in dev/test
  message: {
    error: 'Too many login attempts from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins against the limit
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many login attempts from this IP, please try again later.',
      retryAfter: '15 minutes',
    });
  },
});

/**
 * Rate limiter for public form submission
 * Production: 3 submissions per hour per IP
 * Development: 100 submissions per hour per IP
 */
export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 100 : 3, // Much higher limit in dev/test
  message: {
    error: 'Too many submissions from this IP, please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many submissions from this IP, please try again later.',
      retryAfter: '1 hour',
    });
  },
});
