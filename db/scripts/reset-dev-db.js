#!/usr/bin/env node
/*
 Dev-only database reset script: truncates all user tables and resets identities.

 Safety:
 - Refuses to run when NODE_ENV=production
 - Refuses to run unless host is localhost/127.0.0.1

 Usage:
   DATABASE_URL=postgres://user:pass@localhost:5432/db node db/scripts/reset-dev-db.js
*/

const { Client } = require('pg');

async function main() {
  const url = process.env.DATABASE_URL || 'postgres://forma:forma@localhost:5432/forma';
  const u = new URL(url);

  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to reset database: NODE_ENV=production');
    process.exit(1);
  }

  const allowedHosts = new Set(['localhost', '127.0.0.1']);
  if (!allowedHosts.has(u.hostname)) {
    console.error(`Refusing to reset non-dev database host: ${u.hostname}`);
    console.error('Override not supported. Point DATABASE_URL to localhost for dev resets.');
    process.exit(1);
  }

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    // Fetch public tables excluding drizzle migration tables
    const { rows } = await client.query(
      `SELECT tablename
       FROM pg_tables
       WHERE schemaname = 'public'
         AND tablename NOT IN ('drizzle_migrations', 'drizzle_migrations_lock')
       ORDER BY tablename;`
    );

    const tables = rows.map(r => r.tablename);
    if (tables.length === 0) {
      console.log('No user tables found to truncate.');
      return;
    }

    const fqTables = tables.map(t => `"public"."${t}"`).join(', ');
    const sql = `TRUNCATE TABLE ${fqTables} RESTART IDENTITY CASCADE;`;

    console.log('Truncating tables:', tables.join(', '));
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✅ Dev database reset complete.');
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.warn('Rollback failed (continuing):', rollbackErr.message);
    }
    console.error('❌ Reset failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
