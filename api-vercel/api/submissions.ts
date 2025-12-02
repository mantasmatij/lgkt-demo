import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enableCors, badRequest, ok, readJson } from '../lib/http';
import { getPool } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (enableCors(req, res)) return;
  if (req.method !== 'POST') return badRequest(res, 'POST required');
  const payload = await readJson<any>(req);
  if (!payload) return badRequest(res, 'Invalid JSON');

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ensure company exists
    const companyCode: string = payload.code || payload.companyCode || payload?.submitter?.companyCode || payload?.company?.code || payload?.code;
    const name: string = payload.name;
    if (!companyCode || !name) return badRequest(res, 'Missing company code or name');

    const existing = await client.query('SELECT id FROM companies WHERE code=$1', [companyCode]);
    let companyId: string;
    if (existing.rowCount === 0) {
      const ins = await client.query(
        `INSERT INTO companies (code, name, country, legal_form, address, registry, e_delivery_address)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [companyCode, name, payload.country || 'LT', payload.legalForm || null, payload.address || null, payload.registry || null, payload.eDeliveryAddress || null]
      );
      companyId = ins.rows[0].id;
    } else {
      companyId = existing.rows[0].id;
    }

    const sub = await client.query(
      `INSERT INTO submissions (
        company_code, name_at_submission, country, legal_form, address, registry, e_delivery_address,
        reporting_from, reporting_to, contact_name, contact_email, contact_phone,
        consent, consent_text, requirements_applied, requirements_link, created_at, company_type
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, now(), $17
      ) RETURNING id`,
      [
        companyCode,
        name,
        payload.country || 'LT',
        payload.legalForm || null,
        payload.address || null,
        payload.registry || null,
        payload.eDeliveryAddress || null,
        payload.reportingFrom || null,
        payload.reportingTo || null,
        payload.contactName || payload?.submitter?.name || '',
        payload.contactEmail || payload?.submitter?.email || '',
        payload.contactPhone || payload?.submitter?.phone || '',
        !!payload.consent,
        payload.consentText || '',
        !!payload.requirementsApplied,
        payload.requirementsLink || null,
        payload.companyType || null,
      ]
    );
    const submissionId = sub.rows[0].id as string;

    if (Array.isArray(payload.genderBalance)) {
      for (const r of payload.genderBalance) {
        await client.query(
          `INSERT INTO gender_balance_rows (submission_id, role, women, men, total) VALUES ($1,$2,$3,$4,$5)`,
          [submissionId, r.role || 'UNKNOWN', Number(r.women)||0, Number(r.men)||0, Number(r.total)||((Number(r.women)||0)+(Number(r.men)||0))]
        );
      }
    }

    if (Array.isArray(payload.organs)) {
      for (const r of payload.organs) {
        await client.query(
          `INSERT INTO submission_organs (submission_id, organ_type, last_election_date, planned_election_date) VALUES ($1,$2,$3,$4)`,
          [submissionId, r.role || r.organ_type || 'UNKNOWN', r.lastElectionDate || null, r.plannedElectionDate || null]
        );
      }
    }

    if (Array.isArray(payload.measures)) {
      for (const m of payload.measures) {
        await client.query(
          `INSERT INTO submission_measures (submission_id, name, planned_result, indicator, indicator_value, indicator_unit, year)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [submissionId, m.name || '', m.planned_result || m.plannedResult || null, m.planned_indicator || m.plannedIndicator || null, m.indicator_value || m.indicatorValue || null, m.indicator_unit || m.indicatorUnit || null, m.year || null]
        );
      }
    }

    if (payload.reasonsForUnderrepresentation || payload.submitter) {
      await client.query(
        `INSERT INTO submission_meta (submission_id, reasons_for_underrepresentation, submitter_name, submitter_title, submitter_phone, submitter_email)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [submissionId, payload.reasonsForUnderrepresentation || null, payload.submitter?.name || null, payload.submitter?.title || null, payload.submitter?.phone || null, payload.submitter?.email || null]
      );
    }

    if (Array.isArray(payload.attachments)) {
      for (const a of payload.attachments) {
        if (a && (a.url || a.file_name)) {
          await client.query(
            `INSERT INTO attachments (submission_id, type, url, file_name, file_size, content_type)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [submissionId, a.type || (a.url ? 'LINK' : 'FILE'), a.url || null, a.file_name || a.fileName || null, a.file_size || a.fileSize || null, a.content_type || a.contentType || null]
          );
        }
      }
    }

    await client.query('COMMIT');
    return ok(res, { ok: true, id: submissionId });
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('submission error', e);
    res.status(500).end('Internal error');
  } finally {
    client.release();
  }
}
