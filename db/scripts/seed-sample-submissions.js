#!/usr/bin/env node
/*
 Seed a few sample companies and submissions for local/dev use.
 - Refuses to run if NODE_ENV=production
 - Refuses to run unless DATABASE_URL host is localhost/127.0.0.1

 Usage:
   # Local default
   node db/scripts/seed-sample-submissions.js

   # Or set connection string explicitly
   DATABASE_URL=postgres://forma:forma@localhost:5432/forma node db/scripts/seed-sample-submissions.js
*/

const { Client } = require('pg');

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function toIsoDate(d) {
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10);
}

async function main() {
  const url = process.env.DATABASE_URL || 'postgres://forma:forma@localhost:5432/forma';
  const u = new URL(url);

  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to seed database: NODE_ENV=production');
    process.exit(1);
  }

  const allowedHosts = new Set(['localhost', '127.0.0.1']);
  if (!allowedHosts.has(u.hostname)) {
    console.error(`Refusing to seed non-dev database host: ${u.hostname}`);
    console.error('Point DATABASE_URL to localhost for dev seeding.');
    process.exit(1);
  }

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query('BEGIN');

    // Ensure companies exist (upsert on code)
    const companies = [
      { code: 'TC123456', name: 'Test Company Ltd', country: 'LT' },
      { code: 'TC654321', name: 'Another Test UAB', country: 'LT' },
      { code: 'TC000111', name: 'Sample Group AS', country: 'EE' },
    ];
    for (const c of companies) {
      await client.query(
        `INSERT INTO companies (code, name, country, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, country = EXCLUDED.country, updated_at = NOW()`,
        [c.code, c.name, c.country]
      );
    }

    // Insert a handful of submissions with varying dates and genders
    const samples = [
      { code: 'TC123456', name: 'Test Company Ltd', days: 1, rpFrom: 60, rpTo: 30, women: 8, men: 12 },
      { code: 'TC654321', name: 'Another Test UAB', days: 3, rpFrom: 90, rpTo: 10, women: 15, men: 15 },
      { code: 'TC000111', name: 'Sample Group AS', days: 7, rpFrom: 180, rpTo: 0, women: 22, men: 8 },
      { code: 'TC123456', name: 'Test Company Ltd', days: 14, rpFrom: 365, rpTo: 180, women: 5, men: 25 },
    ];

    for (const s of samples) {
      const createdAt = daysAgo(s.days);
      const reportingFrom = toIsoDate(daysAgo(s.rpFrom));
      const reportingTo = toIsoDate(daysAgo(s.rpTo));

      const insertSubmission = await client.query(
        `INSERT INTO submissions (
            company_code, name_at_submission, country, legal_form, address, registry,
            e_delivery_address, reporting_from, reporting_to,
            contact_name, contact_email, contact_phone,
            notes, consent, consent_text, requirements_applied, requirements_link, created_at
         ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9,
            $10, $11, $12,
            $13, $14, $15, $16, $17, $18
         ) RETURNING id` ,
        [
          s.code, s.name, 'LT', 'UAB', 'Address 1, Vilnius', 'REG-123',
          'e-delivery@company.lt', reportingFrom, reportingTo,
          'John Admin', 'john@company.lt', '+37060000000',
          null, true, 'Consent text', true, null, createdAt,
        ]
      );
      const submissionId = insertSubmission.rows[0].id;

      // Gender balance rows (aggregate across roles)
      await client.query(
        `INSERT INTO gender_balance_rows (submission_id, role, women, men, total)
         VALUES ($1, $2, $3, $4, $5)` ,
        [submissionId, 'BOARD', s.women, s.men, s.women + s.men]
      );

      // Minimal meta row
      await client.query(
        `INSERT INTO submission_meta (submission_id, reasons_for_underrepresentation, submitter_name, submitter_title, submitter_phone, submitter_email)
         VALUES ($1, $2, $3, $4, $5, $6)` ,
        [submissionId, null, 'Jane Doe', 'Admin', '+37061111111', 'jane@example.com']
      );
    }

    await client.query('COMMIT');
    console.log('✅ Seeded sample submissions.');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (e) { /* no-op */ void e; }
    console.error('❌ Seed failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
