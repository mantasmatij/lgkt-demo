-- Ensure companies table has company_type column to align with current schema and code
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "company_type" text;

-- Optional sanity: backfill from submissions if missing (no-op if already present)
-- This is intentionally lightweight and can be superseded by dedicated backfill scripts.
WITH latest_types AS (
  SELECT DISTINCT ON (s.company_code)
    s.company_code,
    s.company_type
  FROM submissions s
  WHERE s.company_type IS NOT NULL AND s.company_type <> ''
  ORDER BY s.company_code, s.created_at DESC
)
UPDATE companies c
SET company_type = COALESCE(c.company_type, lt.company_type)
FROM latest_types lt
WHERE lt.company_code = c.code;
