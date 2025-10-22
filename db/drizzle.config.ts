import type { Config } from 'drizzle-kit';

export default {
  schema: './db/src/lib/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://forma:forma@localhost:5432/forma',
  },
  strict: true,
  verbose: true,
} satisfies Config;
