# Implementation Plan: Form List Improvements

**Branch**: `[005-improve-form-list]` | **Date**: 2025-11-04 | **Spec**: /Users/mantas.matijosaitis/repos/lgkt-forma/specs/005-improve-form-list/spec.md
**Input**: Feature specification from `/specs/005-improve-form-list/spec.md`

## Summary

Deliver an improved Admin Forms list and read-only Details view. The list shows columns: Company Name, Company Code, Company Type, Report Period From, Report Period To, Women %, Men %, Requirements Applied, Submitter Email, Submission Date. It defaults to sorting by Submission date (newest first), supports sorting by other fields, and provides filters for Company, Submission date, Reporting period overlap, and a gender-imbalance threshold (outside 33–67%). Pagination with selectable page size is included; filters combine as OR within type and AND across types; date ranges are inclusive in the Admin’s local timezone; deep-linking is SHOULD with graceful fallback. Details view renders the submitted form exactly as on the filling page, without edit controls.

Technical approach (high level): extend API list endpoint to support the additional filters and sorting, ensure efficient query plans with indexes, validate and normalize query parameters, and update the frontend list and details views to reflect the new fields and behaviors. Persist page-size selection in-session and preserve list state on return from Details.

## Technical Context

**Language/Version**: TypeScript (ES2022), Node 20+  
**Primary Dependencies**: Express (API), Next.js (web), Drizzle ORM, Zod, HeroUI (components)  
**Storage**: PostgreSQL (migrations via Drizzle)  
**Testing**: Jest (backend), Cucumber (frontend BDD)  
**Target Platform**: Web (desktop/tablet/mobile)  
**Project Type**: Nx monorepo with API + Web apps  
**Performance Goals**: 95% of list views visibly render within 2s; responsive interactions during paging/filtering  
**Constraints**: Mobile-first responsive UI; inclusive local-time date range semantics; deep-linking SHOULD with graceful degradation  
**Scale/Scope**: Assume up to tens of thousands of forms; pagination default 25 (options 10/25/50/100); server-side filtering and sorting

## Constitution Check

Verify compliance with LGKT Forma Constitution v1.0.0:

- [x] **I. Clean Code Excellence**: Design promotes readable, maintainable code structure
- [x] **II. Simple & Intuitive UX**: User interface patterns are simple and use HeroUI components (NextUI deprecated in constitution)
- [x] **III. Responsive Design First**: Design considers mobile, tablet, and desktop viewports
- [x] **IV. DRY**: Architecture avoids duplication; shared logic identified for extraction
- [x] **V. Minimal Dependencies**: No new dependencies required; reuse existing stack
- [x] **VI. Comprehensive Testing**: Testing strategy defined (Jest for backend, Cucumber for frontend)
- [x] **VII. Technology Stack Compliance**: 
  - [x] Uses Nx monorepo structure
  - [x] TypeScript for all code
  - [x] Express for backend
  - [x] Drizzle ORM with migrations for database (PostgreSQL)
  - [x] Zod for validation (frontend + backend)
  - [x] HeroUI for UI components (per constitution)
  - [x] fontAndColour.css for styling

Notes:
- Template references to NextUI and MySQL are superseded by the Constitution (HeroUI and PostgreSQL). No violations remain.

## Project Structure

### Documentation (this feature)

```
/Users/mantas.matijosaitis/repos/lgkt-forma/specs/005-improve-form-list/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output (OpenAPI)
```

### Source Code (repository root)

```
api/
└── src/
    ├── routes/            # Add/extend admin forms routes
    ├── services/          # Query builders using Drizzle
    └── middleware/        # Validation (Zod), auth

web/
└── src/
    ├── app/               # Admin routes/pages
    ├── components/        # List table, filters, pagination controls
    └── services/          # Client data fetching & URL state (deep-linking)

tests/
└── contract/              # Contract tests for API (optional)
```

**Structure Decision**: Extend existing `api` and `web` apps. Centralize list/filter schemas (Zod) in a shared module if reused across layers to maintain DRY.

### Indexing (Notes)

Recommended PostgreSQL indexes to support filters/sort (no migration in this feature):
- submission_date DESC (default sort)
- company_name, company_code (search)
- report_period_from, report_period_to (overlap)
- optional composite: (submission_date, company_code)

## Complexity Tracking

No constitutional violations. No additional complexity beyond normal feature scope.

