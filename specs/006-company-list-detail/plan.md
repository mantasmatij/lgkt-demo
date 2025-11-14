# Implementation Plan: Company List & Detail

**Branch**: `006-company-list-detail` | **Date**: 2025-11-11 | **Spec**: specs/006-company-list-detail/spec.md
**Input**: Feature specification from `/specs/006-company-list-detail/spec.md`

## Summary

Extend the admin side with a Companies list view and Company detail view. The list displays columns: Company name, Company code, Company type, Company address, Company eDelivery address; default sort by Company name descending; search by name and code; filters: Company type and Registry; pagination. The detail view shows full company attributes and a submissions list (Date from, Date to, Women %, Men %, Requirements applied, Submitter email, Submission date) ordered by submission date descending.

Technical approach: Reuse existing table, pagination, and filter UI patterns from the form list view to ensure consistent styling and usability. Add backend list/detail endpoints and query parameter handling for search, sort, filters, and pagination using existing conventions. Define contracts first, then implement API, UI pages/components, and tests.

## Technical Context

**Language/Version**: TypeScript (ES2022), Node 20+
**Primary Dependencies**: Next.js (web), Express (API), HeroUI (components), Zod (validation), Drizzle ORM (data access)
**Storage**: PostgreSQL via existing db package and migrations
**Testing**: Jest (backend), Cucumber/Playwright (frontend E2E/BDD)
**Target Platform**: Web (admin UI) + Node API
**Project Type**: Nx monorepo with separate apps: `api` and `web`
**Performance Goals**: Perceived updates within 2s for filter/search actions (from spec SC-003)
**Constraints**: Reuse existing table and filter UX from form list; maintain existing styles and usability; admin-only access
**Scale/Scope**: Thousands of companies; pagination default 25 per page

## Constitution Check

Verify compliance with LGKT Forma Constitution v1.0.0:

- [x] I. Clean Code Excellence: Plan favors reusable components and clear layering
- [x] II. Simple & Intuitive UX: Reuse established HeroUI patterns from existing list views
- [x] III. Responsive Design First: Existing responsive components reused; test across viewports
- [x] IV. DRY: Share list table, pagination, and filter primitives across lists
- [x] V. Minimal Dependencies: No new dependencies required
- [x] VI. Comprehensive Testing: Jest (API) + Cucumber/Playwright (UI) coverage planned
- [x] VII. Technology Stack Compliance:
  - [x] Nx monorepo structure
  - [x] TypeScript for all code
  - [x] Express for backend
  - [x] Drizzle ORM with migrations for database
  - [x] Zod for validation (frontend + backend)
  - [x] HeroUI for UI components
  - [x] fontAndColour.css for styling

## Project Structure

### Documentation (this feature)

```
specs/006-company-list-detail/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md            # created by /speckit.tasks (not in this step)
```

### Source Code (repository root)

```
api/
  src/
    routes/
      admin/
        companies.ts        # list + detail endpoints
    services/
      companies.service.ts  # query composition (search, filters, sort, pagination)
    utils/
      query.ts              # shared parsing for pagination/sort (reuse if exists)

web/
  src/
    app/
      admin/
        companies/
          page.tsx               # Companies list view (App Router)
        companies/[companyId]/
          page.tsx               # Company detail view (App Router)
    components/
      tables/
        CompanyTable.tsx    # wraps shared table for company-specific columns
      forms/
        Pagination.tsx      # reuse existing
      filters/
        CompanyFilters.tsx  # reuse form list primitives; add type/registry
    services/
      companies.ts          # fetchers bound to API contracts

contracts/
  src/
    lib/
      admin-companies.ts    # generated types from OpenAPI (if applicable)
```

**Structure Decision**: Use existing `api` and `web` apps. Implement admin company routes under `api/src/routes/admin/`. Implement list/detail pages using Next.js App Router under `web/src/app/admin/companies/`. Reuse existing table, pagination, and filter components/patterns from the form list view to maintain UX consistency.

## Complexity Tracking

No constitutional violations anticipated. Reuse strategy keeps scope low and compliant.

