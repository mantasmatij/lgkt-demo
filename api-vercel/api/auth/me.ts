type VercelRequest = any;
type VercelResponse = any;
import { enableCors, ok, unauthorized } from '../../lib/http';
import { getSessionToken, verify } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (enableCors(req, res)) return;
  if (!process.env.SESSION_SECRET) {
    res.status(500).end('Missing SESSION_SECRET');
    return;
  }
  const token = getSessionToken(req);
  if (!token) return unauthorized(res, 'No session');
  const payload = verify(token, process.env.SESSION_SECRET);
  if (!payload) return unauthorized(res, 'Invalid session');
  ok(res, { user: { id: payload.uid, email: payload.email }, at: payload.at });
}
