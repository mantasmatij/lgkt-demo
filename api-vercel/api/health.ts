import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enableCors, ok } from '../lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (enableCors(req, res)) return;
  ok(res, { ok: true, name: 'api-vercel', time: new Date().toISOString() });
}
