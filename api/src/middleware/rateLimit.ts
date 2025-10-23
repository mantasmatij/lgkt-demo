import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate limiter for CSV export endpoint
 * Limits: 10 requests per 15 minutes per IP
 */
export const csvExportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
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
 * Limits: 5 login attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
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
 * Limits: 3 submissions per hour per IP
 */
export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 submissions per hour
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
