#!/usr/bin/env node
/*
 Seed a default admin user into admin_users.

 Usage:
   # Uses defaults
   node db/scripts/seed-admin.js

   # Or override
   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=admin123 ADMIN_ROLE=admin \
   DATABASE_URL=postgres://forma:forma@localhost:5432/forma \
   node db/scripts/seed-admin.js
*/
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const url = process.env.DATABASE_URL || 'postgres://forma:forma@localhost:5432/forma';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const role = process.env.ADMIN_ROLE || 'admin';

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await client.query(
      `INSERT INTO admin_users (email, password_hash, role, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (email) DO NOTHING`,
      [email, passwordHash, role]
    );

    console.log('✅ Admin user ready');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
  } catch (err) {
    console.error('❌ Failed to seed admin:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
