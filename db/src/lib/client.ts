import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    const connectionString = process.env['DATABASE_URL'] || 'postgres://forma:forma@localhost:5432/forma';
    pool = new Pool({ connectionString });
  }
  return pool;
}

export function getDb() {
  const p = getPool();
  return drizzle(p);
}
