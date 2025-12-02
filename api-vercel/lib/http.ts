// Minimal request/response types to avoid external type deps
type Req = any;
type Res = any;

export const ok = (res: Res, data: unknown = { ok: true }) => {
  res.status(200).setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
};

export const badRequest = (res: Res, message = 'Bad Request') => {
  res.status(400).setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ error: message }));
};

export const unauthorized = (res: Res, message = 'Unauthorized') => {
  res.status(401).setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ error: message }));
};

export function enableCors(req: Req, res: Res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin as string);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '600');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export async function readJson<T = any>(req: Req): Promise<T | null> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : null); } catch { resolve(null); }
    });
  });
}
