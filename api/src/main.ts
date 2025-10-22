/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

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

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
