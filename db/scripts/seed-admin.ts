#!/usr/bin/env node
/**
 * Seed script to create a default admin user
 * Usage: npx tsx db/scripts/seed-admin.ts
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { adminUsers } from '../src/lib/schema';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://lgkt:lgkt@localhost:5432/lgkt_forma';

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const role = process.env.ADMIN_ROLE || 'admin';

  console.log(`Creating admin user: ${email}`);

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Insert admin user (ignore if already exists)
  try {
    await db.insert(adminUsers).values({
      email,
      passwordHash,
      role,
    });
    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      console.log('ℹ️  Admin user already exists');
    } else {
      throw error;
    }
  }

  await pool.end();
}

main().catch((err) => {
  console.error('Error seeding admin:', err);
  process.exit(1);
});
