-- Add company_type column to submissions for capturing public 'Company Type' selection
ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "company_type" text;