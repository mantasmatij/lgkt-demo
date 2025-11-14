# Quickstart: Company List & Detail (Admin)

## Prerequisites
- Repo bootstrapped (Nx workspace), Node 20+
- Database running (PostgreSQL) with latest migrations applied
- Admin user available for login

## Run locally
1. Start API and Web (from repo root):
   - Use existing Nx targets or package scripts to run `api` and `web` apps.
2. Open admin UI at http://localhost:3000/admin/companies

## What to test
- Companies list
  - Default sort by Company name descending
  - Search by name and code (case-insensitive substring)
  - Filters: Company type and Registry (apply, clear, chips visible)
  - Pagination default 25, navigation preserves criteria
  - Empty states for no results
- Company detail
  - Fields: name, code, type, legal form, address, registry, eDelivery address
  - Submissions table with specified columns ordered by submission date desc
  - Empty state when no submissions

## Notes
- UI components reuse form list table and filter patterns to maintain consistent styling and behavior.
- API contracts defined in `contracts/openapi.yaml`.
