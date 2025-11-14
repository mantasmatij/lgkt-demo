-- Backfill companies.type from the most recent submission's company_type when NULL
UPDATE companies c
SET company_type = s.company_type
FROM LATERAL (
  SELECT company_type
  FROM submissions
  WHERE company_code = c.code AND company_type IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1
) s
WHERE c.company_type IS NULL
  AND s.company_type IS NOT NULL;

-- Optionally add NOT NULL constraint later if business rules require every company to have a type.