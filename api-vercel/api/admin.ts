type VercelRequest = any;
type VercelResponse = any;
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
  const routePath = sp.get('path') || path;

  function getPagination() {
    const page = Number(sp.get('page') || '1') || 1;
    const psRaw = sp.get('pageSize') || sp.get('limit') || '50';
    const pageSize = Math.min(Math.max(Number(psRaw) || 50, 1), 200);
    const offset = (page - 1) * pageSize;
    return { page, pageSize, offset };
  }

  try {
    // Forms list -> map to submissions list
    if (req.method === 'GET' && routePath.startsWith('/api/admin/forms')) {
      const parts = routePath.split('/').filter(Boolean);
      if (parts.length === 3) {
        // /api/admin/forms?...
        const { page, pageSize, offset } = getPagination();
        const client = await pool.connect();
        try {
          const q = (sp.get('q') || '').trim();
          const type = (sp.get('type') || '').trim();
          const reqStr = (sp.get('requirements') || '').trim();
          const from = (sp.get('from') || '').trim();
          const to = (sp.get('to') || '').trim();
          let where = 'WHERE 1=1';
          const params: any[] = [];
          let idx = 1;
          if (q) {
            params.push(`%${q}%`);
            where += ` AND (c.name ILIKE $${idx} OR s.company_code ILIKE $${idx})`;
            idx++;
          }
          if (type) {
            params.push(type);
            where += ` AND COALESCE(c.company_type, s.company_type) = $${idx}`;
            idx++;
          }
          if (reqStr === 'true' || reqStr === 'false') {
            params.push(reqStr === 'true');
            where += ` AND s.requirements_applied = $${idx}`;
            idx++;
          }
          if (from) {
            params.push(from);
            where += ` AND s.reporting_from >= $${idx}::date`;
            idx++;
          }
          if (to) {
            params.push(to);
            where += ` AND s.reporting_to <= $${idx}::date`;
            idx++;
          }

          const list = await client.query(
            `SELECT
               s.id,
               c.name AS "companyName",
               s.company_code AS "companyCode",
               COALESCE(c.company_type, s.company_type) AS "companyType",
               s.reporting_from AS "reportPeriodFrom",
               s.reporting_to AS "reportPeriodTo",
               ROUND(COALESCE(NULLIF((SELECT SUM(women) FROM gender_balance_rows WHERE submission_id = s.id),0)::numeric * 100
                 / NULLIF((SELECT SUM(total) FROM gender_balance_rows WHERE submission_id = s.id),0)::numeric, 0)) AS "womenPercent",
               ROUND(COALESCE(100 - (COALESCE(NULLIF((SELECT SUM(women) FROM gender_balance_rows WHERE submission_id = s.id),0)::numeric * 100
                 / NULLIF((SELECT SUM(total) FROM gender_balance_rows WHERE submission_id = s.id),0)::numeric, 0)), 0)) AS "menPercent",
               s.requirements_applied AS "requirementsApplied",
               s.contact_email AS "submitterEmail",
               s.created_at AS "submissionDate"
             FROM submissions s
             LEFT JOIN companies c ON c.code = s.company_code
             ${where}
             ORDER BY s.created_at DESC
             LIMIT $${idx} OFFSET $${idx + 1}`,
            [...params, pageSize, offset]
          );
          const countRs = await client.query(`SELECT COUNT(*)::int AS c FROM submissions s LEFT JOIN companies c ON c.code = s.company_code ${where}`, params);
          const total = countRs.rows[0].c as number;
          return ok(res, { items: list.rows, page, pageSize, total });
        } finally { client.release(); }
      } else if (parts.length === 4) {
        const id = parts[3];
        const client = await pool.connect();
        try {
          const sub = await client.query(
            `SELECT s.*, c.name AS company_current_name, COALESCE(c.company_type, s.company_type) AS company_type_effective
             FROM submissions s
             LEFT JOIN companies c ON c.code = s.company_code
             WHERE s.id = $1`,
            [id]
          );
          if (sub.rowCount === 0) return res.status(404).end('Not found');

          const s = sub.rows[0];
          const [attachments, gb, organs, measures, meta] = await Promise.all([
            client.query('SELECT id, type, url, file_name, file_size, content_type FROM attachments WHERE submission_id = $1', [id]),
            client.query('SELECT role, women, men, total FROM gender_balance_rows WHERE submission_id = $1', [id]),
            client.query('SELECT organ_type, last_election_date, planned_election_date FROM submission_organs WHERE submission_id = $1', [id]),
            client.query('SELECT name, planned_result, indicator, indicator_value, indicator_unit, year FROM submission_measures WHERE submission_id = $1', [id]),
            client.query('SELECT submitter_name, submitter_title, submitter_phone, submitter_email, reasons_for_underrepresentation FROM submission_meta WHERE submission_id = $1', [id]),
          ]);

          const women = (await client.query('SELECT COALESCE(SUM(women),0)::int AS w FROM gender_balance_rows WHERE submission_id = $1', [id])).rows[0].w as number;
          const total = (await client.query('SELECT COALESCE(SUM(total),0)::int AS t FROM gender_balance_rows WHERE submission_id = $1', [id])).rows[0].t as number;
          const wp = total > 0 ? Math.round((women * 100) / total) : 0;
          const mp = total > 0 ? 100 - wp : 0;

          const out = {
            id: s.id,
            companyType: s.company_type_effective as string | null,
            reportPeriodFrom: s.reporting_from,
            reportPeriodTo: s.reporting_to,
            womenPercent: wp,
            menPercent: mp,
            submitterEmail: s.contact_email as string,
            fields: {
              company: {
                code: s.company_code,
                name: s.name_at_submission,
                country: s.country,
                legalForm: s.legal_form,
                address: s.address,
                registry: s.registry,
                eDeliveryAddress: s.e_delivery_address,
              },
              reportingPeriod: { from: s.reporting_from, to: s.reporting_to },
              consent: { consent: !!s.consent, consentText: s.consent_text },
              requirements: { applied: !!s.requirements_applied, link: s.requirements_link },
              notes: s.notes,
              totals: { women, men: total - women },
              genderBalance: gb.rows.map((r) => ({ role: r.role, women: Number(r.women)||0, men: Number(r.men)||0, total: Number(r.total)||0 })),
              organs: organs.rows.map((r) => ({
                organType: r.organ_type,
                lastElectionDate: r.last_election_date,
                plannedElectionDate: r.planned_election_date,
              })),
              measures: measures.rows.map((m) => ({
                name: m.name,
                plannedResult: m.planned_result,
                indicator: m.indicator,
                indicatorValue: m.indicator_value,
                indicatorUnit: m.indicator_unit,
                year: m.year,
              })),
              attachments: attachments.rows.map((a) => ({
                id: a.id,
                type: a.type,
                url: a.url,
                fileName: a.file_name,
                fileSize: a.file_size,
              })),
              meta: meta.rows[0] ? {
                reasonsForUnderrepresentation: meta.rows[0].reasons_for_underrepresentation,
                submitterName: meta.rows[0].submitter_name,
                submitterTitle: meta.rows[0].submitter_title,
                submitterPhone: meta.rows[0].submitter_phone,
                submitterEmail: meta.rows[0].submitter_email,
              } : null,
            },
          };
          return ok(res, out);
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
    if (req.method === 'GET' && routePath.startsWith('/api/admin/companies')) {
      const parts = routePath.split('/').filter(Boolean);
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
    if (req.method === 'GET' && routePath.startsWith('/api/admin/submissions')) {
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
