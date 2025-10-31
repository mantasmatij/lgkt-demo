# Implementation Plan: Company Form Updates

**Branch**: `004-update-company-form` | **Date**: 2025-10-31 | **Spec**: /specs/004-update-company-form/spec.md
**Input**: Feature specification from `/specs/004-update-company-form/spec.md`

## Summary

Update the company form: remove Country and Contact & Other sections from UI; add a new Company Type enum (Listed company, State-owned company, Large company) with bilingual labels and stable payload value; add a new Section 12 reasons text (always required); enforce min date 1990 on all date inputs; reorganize layout so most inputs are single-line (desktop) and stack on mobile. No new backend endpoints or database tables; update validation and i18n.

## Technical Context

**Language/Version**: TypeScript 5.9, Node 20, React 19, Next.js 15.3  
**Primary Dependencies**: HeroUI (UI components), React Hook Form, Zod (validation), i18n strings; Drizzle ORM and Express exist but not modified by this feature  
**Storage**: PostgreSQL (no schema changes for this feature)  
**Testing**: Jest (backend), Cucumber (frontend BDD), Playwright (e2e)  
**Target Platform**: Web (Next.js frontend, Express API)  
**Project Type**: Nx monorepo with web (Next) + api (Express) + shared libs (ui, db, contracts)  
**Performance Goals**: Form loads < 2s on desktop broadband; interactive validation feedback < 100ms p95; form submission completes < 3s p95  
**Constraints**: Responsive mobile-first layout; bilingual labels; date pickers constrained to >= 1990; payload preserves removed fields as null/empty keys  
**Scale/Scope**: Single form surface; low concurrency impact; affects one main user flow

## Constitution Check

Verify compliance with LGKT Forma Constitution v1.0.0:

- [x] **I. Clean Code Excellence**: Readable, maintainable component structure and validation helpers
- [x] **II. Simple & Intuitive UX**: Uses HeroUI components and clear inline validation
- [x] **III. Responsive Design First**: Desktop single-line grouping; mobile vertical stacking; tested across viewports
- [x] **IV. DRY**: Shared constants for enums and labels; reuse validation schemas
- [x] **V. Minimal Dependencies**: No new deps introduced
- [x] **VI. Comprehensive Testing**: Jest (backend unaffected), Cucumber (frontend flows), Playwright e2e happy path
- [x] **VII. Technology Stack Compliance**:
  - [x] Nx monorepo structure
  - [x] TypeScript for all code
  - [x] Express for backend (unchanged)
  - [x] Drizzle ORM with migrations for schema changes (not needed here)
  - [x] Zod for validation (frontend + backend)
  - [x] HeroUI for UI components (per constitution)
  - [x] fontAndColour.css for styling tokens

## Project Structure

### Documentation (this feature)

```
specs/004-update-company-form/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output (decisions & rationale)
├── data-model.md        # Phase 1 output (entities & rules)
├── quickstart.md        # Phase 1 output (how to run & verify)
└── contracts/           # Phase 1 output (OpenAPI schema for payload shape)
```

### Source Code (repository root)

```
api/                     # Express API (unchanged for this feature)
web/                     # Next.js app (form UI changes here)
  src/
    components/
      forms/company/     # New/updated components for company form
    pages/
      ...
ui/                      # Shared UI lib (tokens/components as needed)
db/                      # Drizzle config & migrations (no new schema)
contracts/               # Repo-wide generated types (unchanged)
```

**Structure Decision**: Web application with existing api (Express) and web (Next) apps under Nx; implement UI updates in `web/src/components/forms/company/` and related pages; keep backend unchanged.

## Complexity Tracking

No constitutional violations expected.

