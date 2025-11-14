-- Backfill companies.company_type from latest non-null submissions.company_type (if missing)
-- This addresses historical submissions created before upsertCompany started persisting the type.
-- Safe to run multiple times (idempotent) because it only updates rows where company_type IS NULL.

WITH latest_types AS (
  SELECT DISTINCT ON (s.company_code)
    s.company_code,
    s.company_type
  FROM submissions s
  WHERE s.company_type IS NOT NULL AND s.company_type <> ''
  ORDER BY s.company_code, s.created_at DESC
)
UPDATE companies c
SET company_type = lt.company_type
FROM latest_types lt
WHERE c.company_type IS NULL AND lt.company_code = c.code;

-- Verification (optional):
-- SELECT c.code, c.company_type FROM companies c WHERE c.company_type IS NOT NULL ORDER BY c.code;