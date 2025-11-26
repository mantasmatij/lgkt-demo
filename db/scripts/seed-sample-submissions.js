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

    // Lithuanian names, addresses, and diverse data
    const ltNames = [
      'UAB Saulės Energetika', 'AB Vilniaus Vandenys', 'UAB Žalias Miestas', 'UAB Baltijos Kelias',
      'UAB Technologijų Era', 'AB Lietuvos Geležinkeliai', 'UAB Šviesos Tiltas', 'UAB Eko Statyba',
      'UAB Verslo Konsultantai', 'UAB Rytų Investicijos', 'UAB Gintaro Grupė', 'UAB Medžio Pramonė',
      'UAB Agro Partneriai', 'UAB IT Sprendimai', 'UAB Transporto Linija', 'UAB Maisto Prekės',
      'UAB Statybos Projektai', 'UAB Finansų Ekspertai', 'UAB Sveikatos Centras', 'UAB Mokymo Institutas',
      'UAB Kultūros Namai'
    ];
    const companyTypes = ['LISTED', 'STATE_OWNED', 'LARGE',];
    const cities = ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Telšiai', 'Utena', 'Tauragė'];
    const legalForms = ['UAB', 'AB', 'VšĮ', 'MB', 'TŪB'];
    const registryCodes = ['REG-100', 'REG-200', 'REG-300', 'REG-400', 'REG-500'];
    const submitterNames = ['Jonas Petraitis', 'Agnė Jankauskaitė', 'Darius Kazlauskas', 'Rūta Žilinskienė', 'Mantas Matijošaitis', 'Eglė Petrauskienė', 'Tomas Stankevičius', 'Ieva Vaitkutė', 'Paulius Žemaitis', 'Simona Grigaitė'];
    const titles = ['Direktorius', 'Finansininkė', 'Projektų Vadovas', 'Administratorė', 'Teisininkas', 'Vadybininkė', 'Inžinierius', 'Specialistė', 'Koordinatorius', 'Analitikė'];
    const companyCodes = ['LT10001', 'LT10002', 'LT10003', 'LT10004', 'LT10005', 'LT10006', 'LT10007', 'LT10008', 'LT10009', 'LT10010'];
    const streetNumbers = Array.from({ length: 100 }, (_, i) => i + 1);

    // Generate 100 companies and submissions
    for (let i = 0; i < 100; i++) {
      const code = companyCodes[i % companyCodes.length];
      const name = ltNames[i % ltNames.length];
      const country = 'LT';
      const companyType = companyTypes[i % companyTypes.length];
      const legalForm = legalForms[i % legalForms.length];
      const city = cities[i % cities.length];
      const address = `Gatvė ${streetNumbers[i % streetNumbers.length]}, ${city}`;
      const registry = registryCodes[i % registryCodes.length];
      const eDelivery = `info${i}@${name.replace(/\s+/g, '').toLowerCase()}.lt`;
      const reportingFrom = toIsoDate(daysAgo(365 - i * 3));
      const reportingTo = toIsoDate(daysAgo(180 - i * 2));
      const contactName = submitterNames[i % submitterNames.length];
      const contactEmail = `kontaktas${i}@${name.replace(/\s+/g, '').toLowerCase()}.lt`;
      const contactPhone = `+3706${(100000 + i).toString().slice(0,6)}`;
      const requirementsApplied = i % 2 === 0;
      const requirementsLink = requirementsApplied ? `https://forma.lt/reikalavimai/${code}` : null;
      const consentText = 'Sutinku su sąlygomis';
      const createdAt = daysAgo(i);
      const women = (i * 3) % 30;
      const men = (i * 2) % 30;
      const reasons = i % 5 === 0 ? 'Trūksta motyvacijos' : i % 5 === 1 ? 'Ribotos galimybės' : i % 5 === 2 ? 'Nėra kandidatų' : i % 5 === 3 ? 'Kultūriniai skirtumai' : 'Kita priežastis';

      // Upsert company
      await client.query(
        `INSERT INTO companies (code, name, country, company_type, legal_form, address, registry, e_delivery_address, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, country = EXCLUDED.country, company_type = EXCLUDED.company_type, legal_form = EXCLUDED.legal_form, address = EXCLUDED.address, registry = EXCLUDED.registry, e_delivery_address = EXCLUDED.e_delivery_address, updated_at = NOW()`,
        [code, name, country, companyType, legalForm, address, registry, eDelivery]
      );

      // Insert submission
      const insertSubmission = await client.query(
        `INSERT INTO submissions (
            company_code, name_at_submission, country, company_type, legal_form, address, registry,
            e_delivery_address, reporting_from, reporting_to,
            contact_name, contact_email, contact_phone,
            notes, consent, consent_text, requirements_applied, requirements_link, created_at
         ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10,
            $11, $12, $13,
            $14, $15, $16, $17, $18, $19
         ) RETURNING id` ,
        [
          code, name, country, companyType, legalForm, address, registry,
          eDelivery, reportingFrom, reportingTo,
          contactName, contactEmail, contactPhone,
          null, true, consentText, requirementsApplied, requirementsLink, createdAt,
        ]
      );
      const submissionId = insertSubmission.rows[0].id;

      // Gender balance rows (BOARD, CEO, SUPERVISORY_BOARD)
      await client.query(
        `INSERT INTO gender_balance_rows (submission_id, role, women, men, total)
         VALUES ($1, $2, $3, $4, $5), ($1, $6, $7, $8, $9), ($1, $10, $11, $12, $13)` ,
        [
          submissionId, 'BOARD', women, men, women + men,
          'CEO', women % 10, men % 10, (women % 10) + (men % 10),
          'SUPERVISORY_BOARD', (women + 2) % 15, (men + 3) % 15, ((women + 2) % 15) + ((men + 3) % 15)
        ]
      );

      // Meta row
      await client.query(
        `INSERT INTO submission_meta (submission_id, reasons_for_underrepresentation, submitter_name, submitter_title, submitter_phone, submitter_email)
         VALUES ($1, $2, $3, $4, $5, $6)` ,
        [submissionId, reasons, contactName, titles[i % titles.length], contactPhone, contactEmail]
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
