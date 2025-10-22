import express from 'express';
import * as path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { uploadsRouter } from './routes/uploads';
import { submissionsRouter } from './routes/submissions';
import { authRouter } from './routes/auth';
import { adminSubmissionsRouter } from './routes/admin/submissions';
import { issueCsrfToken } from './middleware/csrf';
import { parseSession } from './middleware/auth';

export function createApp() {
  const app = express();

  // Security & basics
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Parse cookies (required for signed cookies)
  const secret = process.env.SESSION_SECRET || 'dev-secret-change-in-production';
  app.use(cookieParser(secret));
  
  // Parse session from cookie
  app.use(parseSession);

  app.use('/assets', express.static(path.join(__dirname, 'assets')));

  app.get('/api/health', (_req, res) => {
    res.send({ status: 'ok' });
  });

  // CSRF token issuance endpoint
  app.get('/api/csrf', issueCsrfToken);

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/uploads', uploadsRouter);
  app.use('/api/submissions', submissionsRouter);
  app.use('/api/admin/submissions', adminSubmissionsRouter);

  // Central error handler
  type HttpError = Error & { statusCode?: number; code?: string };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: HttpError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof SyntaxError) {
      return res.status(400).json({ code: 'BAD_JSON', message: 'Malformed JSON body' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ code: 'FILE_TOO_LARGE', message: 'File too large' });
    }
    const status = err.statusCode || 500;
    const message = err?.message || 'Internal Server Error';
    if (status >= 500) {
      console.error('Unhandled error:', err);
    }
    return res.status(status).json({ code: 'ERROR', message });
  });

  return app;
}

export const app = createApp();
