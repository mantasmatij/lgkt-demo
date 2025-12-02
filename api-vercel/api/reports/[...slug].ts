import type { VercelRequest, VercelResponse } from '@vercel/node';
import core from '../reports';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return core(req, res);
}
