# Quickstart: Company Form Updates

Created: 2025-10-31

## Prerequisites
- Node 20+
- Docker (for local Postgres + API + Web services)

## Run the stack
1. Start services (Postgres, API, Web):
   - npm run dev:up
2. Open the app at http://localhost:3000

## Reset local database (optional for clean test data)
- npm run db:reset:dev
  - Safety: refuses to run on non-local hosts or NODE_ENV=production

## What to verify (manual QA)
- Company Type field appears with 3 options and switches labels with language
- Section 12 reasons field is present and required
- Country and Contact & Other not visible in UI; payload keeps keys as null/empty
- All date inputs prevent < 1990 and validate From <= To
- Governance section continues to work as before
- Gender balance totals must equal women + men
- Confirmation checkbox required
- Layout:
  - Desktop: single-line groups (1.1–1.3 etc.)
  - Mobile: vertical stacking, no clipping

## Dev notes
- Add Company Type enum + labels in a shared constants module
- Use Zod schemas to enforce new validations and constraints
- Ensure i18n keys exist for LT/EN
- Keep payload mapping stable and language-independent
