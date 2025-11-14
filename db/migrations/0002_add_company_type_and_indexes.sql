-- Add company_type column to companies
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "company_type" text;

-- Indexes to support list queries
CREATE INDEX IF NOT EXISTS "companies_name_idx" ON "companies" ("name");
CREATE INDEX IF NOT EXISTS "companies_company_type_idx" ON "companies" ("company_type");
CREATE INDEX IF NOT EXISTS "companies_registry_idx" ON "companies" ("registry");
