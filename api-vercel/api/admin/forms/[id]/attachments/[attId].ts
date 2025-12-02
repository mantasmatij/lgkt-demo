import type { VercelRequest, VercelResponse } from '@vercel/node';
import core from '../../../../admin';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return core(req, res);
}
