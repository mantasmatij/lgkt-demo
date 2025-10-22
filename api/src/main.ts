/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { uploadsRouter } from './routes/uploads';
import { submissionsRouter } from './routes/submissions';

const app = express();

// Security & basics
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/health', (_req, res) => {
  res.send({ status: 'ok' });
});

// Routes
app.use('/api/uploads', uploadsRouter);
app.use('/api/submissions', submissionsRouter);

// Central error handler to map known errors to spec responses
type HttpError = Error & { statusCode?: number; code?: string };
// Keep 4-arg signature to ensure Express treats this as an error handler.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ code: 'BAD_JSON', message: 'Malformed JSON body' });
  }
  // Multer file too large
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

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
