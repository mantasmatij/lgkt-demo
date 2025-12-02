import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enableCors, badRequest, ok } from '../lib/http';
import { getPool } from '../lib/db';
import { getSessionToken, verify } from '../lib/session';

function requireAuth(req: VercelRequest, res: VercelResponse): { uid: string | number; email: string } | null {
  const token = getSessionToken(req);
  if (!token || !process.env.SESSION_SECRET) {
    res.status(401).end('Unauthorized');
    return null;
  }
  const payload = verify(token, process.env.SESSION_SECRET);
  if (!payload) {
    res.status(401).end('Unauthorized');
    return null;
  }
  return { uid: payload.uid, email: payload.email };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (enableCors(req, res)) return;
  const who = requireAuth(req, res);
  if (!who) return;
  const url = new URL(req.url || '/', `https://${req.headers.host}`);
  const path = url.pathname; // /api/admin/...
  const pool = getPool();
  const sp = url.searchParams;

  function getPagination() {
    const page = Number(sp.get('page') || '1') || 1;
    const psRaw = sp.get('pageSize') || sp.get('limit') || '50';
    const pageSize = Math.min(Math.max(Number(psRaw) || 50, 1), 200);
    const offset = (page - 1) * pageSize;
    return { page, pageSize, offset };
  }

  try {
    // Forms list -> map to submissions list
    if (req.method === 'GET' && path.startsWith('/api/admin/forms')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length === 3) {
        // /api/admin/forms?...
        const { page, pageSize, offset } = getPagination();
        const client = await pool.connect();
        try {
          const list = await client.query(
            `SELECT id, company_code AS code, name_at_submission AS name, created_at
             FROM submissions
             ORDER BY created_at DESC
             LIMIT $1 OFFSET $2`,
            [pageSize, offset]
          );
          const total = (await client.query('SELECT COUNT(*)::int AS c FROM submissions')).rows[0].c as number;
          return ok(res, { items: list.rows, page, pageSize, total });
        } finally { client.release(); }
      } else if (parts.length === 4) {
        const id = parts[3];
        const client = await pool.connect();
        try {
          const sub = await client.query('SELECT * FROM submissions WHERE id = $1', [id]);
          if (sub.rowCount === 0) return res.status(404).end('Not found');
          const attachments = await client.query('SELECT id, type, url, file_name, file_size, content_type FROM attachments WHERE submission_id = $1', [id]);
          const gb = await client.query('SELECT role, women, men, total FROM gender_balance_rows WHERE submission_id = $1', [id]);
          const organs = await client.query('SELECT organ_type, last_election_date, planned_election_date FROM submission_organs WHERE submission_id = $1', [id]);
          const measures = await client.query('SELECT name, planned_result, indicator, indicator_value, indicator_unit, year FROM submission_measures WHERE submission_id = $1', [id]);
          const meta = await client.query('SELECT submitter_name, submitter_title, submitter_phone, submitter_email, reasons_for_underrepresentation FROM submission_meta WHERE submission_id = $1', [id]);
          return ok(res, { submission: sub.rows[0], attachments: attachments.rows, genderBalance: gb.rows, organs: organs.rows, measures: measures.rows, meta: meta.rows[0] });
        } finally { client.release(); }
      } else if (parts.length === 6 && parts[4] === 'attachments') {
        const subId = parts[3];
        const attId = parts[5];
        const client = await pool.connect();
        try {
          const att = await client.query('SELECT url, file_name, content_type FROM attachments WHERE id=$1 AND submission_id=$2', [attId, subId]);
          if (att.rowCount === 0) return res.status(404).end('Not found');
          const a = att.rows[0];
          if (a.url) {
            res.status(302).setHeader('Location', a.url);
            return res.end();
          }
          return badRequest(res, 'Attachment has no URL');
        } finally { client.release(); }
      }
    }

    // Companies endpoints
    if (req.method === 'GET' && path.startsWith('/api/admin/companies')) {
      const parts = path.split('/').filter(Boolean);
      const client = await pool.connect();
      try {
        if (parts.length === 3) {
          // list
          const { page, pageSize, offset } = getPagination();
          const search = sp.get('search')?.trim();
          const type = sp.get('type')?.trim();
          let where = 'WHERE 1=1';
          const params: any[] = [];
          let idx = 1;
          if (search) {
            params.push(`%${search}%`);
            where += ` AND (name ILIKE $${idx} OR code ILIKE $${idx})`;
            idx++;
          }
          if (type) {
            params.push(type);
            where += ` AND company_type = $${idx}`;
            idx++;
          }
          const list = await client.query(
            `SELECT id, name, code, company_type AS type, address, e_delivery_address AS "eDeliveryAddress"
             FROM companies
             ${where}
             ORDER BY name ASC
             LIMIT $${idx} OFFSET $${idx + 1}`,
            [...params, pageSize, offset]
          );
          const countRs = await client.query(
            `SELECT COUNT(*)::int AS c FROM companies ${where}`,
            params
          );
          const total = countRs.rows[0].c as number;
          return ok(res, { items: list.rows, page, pageSize, total });
        } else if (parts.length === 4 && parts[3] === 'allowed-values') {
          return ok(res, { types: ['LISTED','STATE_OWNED','MUNICIPALLY_OWNED','LARGE_PRIVATE'], registries: ['JAR','OTHER'] });
        } else if (parts.length === 4) {
          const id = parts[3];
          const one = await client.query(
            `SELECT id, name, code, company_type AS type, legal_form, address, registry, e_delivery_address AS "eDeliveryAddress" FROM companies WHERE id=$1`,
            [id]
          );
          if (one.rowCount === 0) return res.status(404).end('Not found');
          return ok(res, one.rows[0]);
        } else if (parts.length === 5 && parts[4] === 'submissions') {
          const id = parts[3];
          const { page, pageSize, offset } = getPagination();
          const codeRow = await client.query('SELECT code FROM companies WHERE id=$1', [id]);
          if (codeRow.rowCount === 0) return res.status(404).end('Not found');
          const companyCode = codeRow.rows[0].code as string;
          const list = await client.query(
            `SELECT id, reporting_from AS "dateFrom", reporting_to AS "dateTo", requirements_applied AS "requirementsApplied",
                    contact_email AS "submitterEmail", created_at AS "submittedAt",
                    ROUND(COALESCE(NULLIF((SELECT SUM(women) FROM gender_balance_rows WHERE submission_id = s.id),0)::numeric * 100
                      / NULLIF((SELECT SUM(total) FROM gender_balance_rows WHERE submission_id = s.id),0)::numeric, 0)) AS "womenPercent",
                    ROUND(COALESCE(100 - (COALESCE(NULLIF((SELECT SUM(women) FROM gender_balance_rows WHERE submission_id = s.id),0)::numeric * 100
                      / NULLIF((SELECT SUM(total) FROM gender_balance_rows WHERE submission_id = s.id),0)::numeric, 0)), 0)) AS "menPercent"
             FROM submissions s
             WHERE s.company_code = $1
             ORDER BY created_at DESC
             LIMIT $2 OFFSET $3`,
            [companyCode, pageSize, offset]
          );
          const total = (await client.query('SELECT COUNT(*)::int AS c FROM submissions WHERE company_code=$1', [companyCode])).rows[0].c as number;
          return ok(res, { items: list.rows, page, pageSize, total });
        }
      } finally { client.release(); }
    }

    // Admin submissions list (alias)
    if (req.method === 'GET' && path.startsWith('/api/admin/submissions')) {
      const { page, pageSize, offset } = getPagination();
      const client = await pool.connect();
      try {
        const list = await client.query(
          `SELECT id, company_code AS code, name_at_submission AS name, created_at
           FROM submissions
           ORDER BY created_at DESC
           LIMIT $1 OFFSET $2`,
          [pageSize, offset]
        );
        const total = (await client.query('SELECT COUNT(*)::int AS c FROM submissions')).rows[0].c as number;
        return ok(res, { items: list.rows, page, pageSize, total });
      } finally { client.release(); }
    }

    return badRequest(res, 'Unknown admin route');
  } catch (e) {
    console.error('admin handler error', e);
    res.status(500).end('Internal error');
  }
}
