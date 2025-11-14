-- Performance indexes for companies and submissions flows (T042)
-- Safe to run multiple times via IF NOT EXISTS

-- Enable pg_trgm for efficient ILIKE %...% searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Companies: support substring search on name/code and filtering by type
CREATE INDEX IF NOT EXISTS idx_companies_name_trgm ON companies USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_companies_code_trgm ON companies USING GIN (code gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_companies_type ON companies (company_type);

-- Companies: support ORDER BY name (used with pagination)
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies (name);

-- Submissions: common access patterns by company and recent first
CREATE INDEX IF NOT EXISTS idx_submissions_company_code ON submissions (company_code);
CREATE INDEX IF NOT EXISTS idx_submissions_company_code_created_at_desc ON submissions (company_code, created_at DESC);

-- Joins for aggregates and metadata
CREATE INDEX IF NOT EXISTS idx_gender_balance_rows_submission_id ON gender_balance_rows (submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_meta_submission_id ON submission_meta (submission_id);
