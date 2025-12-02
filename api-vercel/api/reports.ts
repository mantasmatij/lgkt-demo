import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enableCors, badRequest, ok, readJson } from '../lib/http';
import { getPool } from '../lib/db';
import { getSessionToken, verify } from '../lib/session';
import { stringify } from 'csv-stringify/sync';

function requireAuth(req: VercelRequest, res: VercelResponse) {
  const token = getSessionToken(req);
  if (!token || !process.env.SESSION_SECRET) { res.status(401).end('Unauthorized'); return null; }
  const payload = verify(token, process.env.SESSION_SECRET);
  if (!payload) { res.status(401).end('Unauthorized'); return null; }
  return payload;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (enableCors(req, res)) return;
  const url = new URL(req.url || '/', `https://${req.headers.host}`);
  const path = url.pathname; // /api/reports/...
  const pool = getPool();

  // Types
  if (req.method === 'GET' && path === '/api/reports/types') {
    return ok(res, { types: [
      { id: 'forms-list', name: 'Form Submissions' },
      { id: 'companies-list', name: 'Companies' }
    ]});
  }

  // Company options for selector
  if (req.method === 'GET' && path === '/api/reports/company-options') {
    const client = await pool.connect();
    try {
      const rows = await client.query('SELECT code AS value, name AS label FROM companies ORDER BY name ASC LIMIT 2000');
      return ok(res, { options: rows.rows });
    } finally { client.release(); }
  }

  // Auth-only reports below
  const who = requireAuth(req, res);
  if (!who) return;

  if (req.method === 'POST' && path === '/api/reports/preview') {
    const body = await readJson<{ type: string; filters?: { dateRange?: { from?: string; to?: string }, company?: { companyCode?: string } } }>(req);
    if (!body?.type) return badRequest(res, 'type required');
    const client = await pool.connect();
    try {
      if (body.type === 'forms-list') {
        const from = body.filters?.dateRange?.from;
        const to = body.filters?.dateRange?.to;
        const q =
          `SELECT id, company_code AS code, name_at_submission AS name, created_at
           FROM submissions
           WHERE ($1::date IS NULL OR created_at >= $1::date)
             AND ($2::date IS NULL OR created_at <= $2::date + INTERVAL '1 day')
           ORDER BY created_at DESC
           LIMIT 500`;
        const rows = await client.query(q, [from || null, to || null]);
        return ok(res, { columns: ['id','code','name','created_at'], rows: rows.rows.map(r => [r.id, r.code, r.name, r.created_at?.toISOString?.() || r.created_at]), total: rows.rowCount });
      }
      if (body.type === 'companies-list') {
        const code = body.filters?.company?.companyCode;
        const q =
          `SELECT code, name, company_type AS type, registry
           FROM companies
           WHERE ($1::text IS NULL OR code = $1)
           ORDER BY name ASC
           LIMIT 500`;
        const rows = await client.query(q, [code || null]);
        return ok(res, { columns: ['code','name','type','registry'], rows: rows.rows.map(r => [r.code, r.name, r.type, r.registry]), total: rows.rowCount });
      }
      return badRequest(res, 'Unknown report type');
    } finally { client.release(); }
  }

  if (req.method === 'POST' && path === '/api/reports/export') {
    const body = await readJson<{ type: string; filters?: { dateRange?: { from?: string; to?: string }, company?: { companyCode?: string } } }>(req);
    if (!body?.type) return badRequest(res, 'type required');
    const client = await pool.connect();
    try {
      let columns: string[] = [];
      let rows: any[][] = [];
      if (body.type === 'forms-list') {
        const from = body.filters?.dateRange?.from;
        const to = body.filters?.dateRange?.to;
        const q =
          `SELECT id, company_code AS code, name_at_submission AS name, created_at
           FROM submissions
           WHERE ($1::date IS NULL OR created_at >= $1::date)
             AND ($2::date IS NULL OR created_at <= $2::date + INTERVAL '1 day')
           ORDER BY created_at DESC
           LIMIT 5000`;
        const rs = await client.query(q, [from || null, to || null]);
        columns = ['id','code','name','created_at'];
        rows = rs.rows.map(r => [r.id, r.code, r.name, r.created_at?.toISOString?.() || r.created_at]);
      } else if (body.type === 'companies-list') {
        const code = body.filters?.company?.companyCode;
        const q =
          `SELECT code, name, company_type AS type, registry
           FROM companies
           WHERE ($1::text IS NULL OR code = $1)
           ORDER BY name ASC
           LIMIT 5000`;
        const rs = await client.query(q, [code || null]);
        columns = ['code','name','type','registry'];
        rows = rs.rows.map(r => [r.code, r.name, r.type, r.registry]);
      } else {
        return badRequest(res, 'Unknown report type');
      }
      const csv = stringify([columns, ...rows]);
      const filename = `${body.type}-${Date.now()}.csv`;
      res.status(200);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.end(csv);
      return;
    } finally { client.release(); }
  }

  return badRequest(res, 'Unknown reports route');
}
