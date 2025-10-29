import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Environment flags
const env = process.env.NODE_ENV;
const isTest = env === 'test';
const isDevelopment = env !== 'production';

/**
 * Rate limiter for CSV export endpoint
 * Production: 10 requests per 15 minutes per IP
 * Development: 1000 requests per 15 minutes per IP
 */
export const csvExportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // Lower the limit in test to keep suites fast and avoid HTTP parser churn
  max: isTest ? 50 : isDevelopment ? 1000 : 10,
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
  max: isTest ? 20 : isDevelopment ? 100 : 5,
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
  max: isTest ? 20 : isDevelopment ? 100 : 3,
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
