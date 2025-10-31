# Implementation Plan: Faster Dev Feedback and LT/EN i18n

**Branch**: `003-faster-dev-i18n` | **Date**: 2025-10-29 | **Spec**: specs/003-faster-dev-i18n/spec.md
**Input**: Feature specification from `/specs/003-faster-dev-i18n/spec.md`

## Summary

Improve developer feedback loops by enabling local development without Docker (primary) and optionally via a Docker dev override with file sync and hot-reload (secondary). Deliver bilingual Lithuanian/English UX without URL locale prefixes, defaulting to Lithuanian, with user-preferred language stored in session. Localize transactional emails and standard PDFs/exports.

## Technical Context

**Language/Version**: TypeScript (Node 20+ / ES2022)  
**Primary Dependencies**: Nx (workspace), Express (API), Next (web), Drizzle ORM, Zod, HeroUI, Tailwind CSS  
**Storage**: PostgreSQL (via Docker compose for local dev)  
**Testing**: Jest (backend), Cucumber (frontend), Playwright (e2e)  
**Target Platform**: Web + API services, macOS developer hosts, Linux containers in CI  
**Project Type**: Monorepo (Nx) with `api/` and `web/` apps  
**Performance Goals**: Dev change-to-visual feedback under 30 seconds (p90)  
**Constraints**: No URL locale path segments; default language is Lithuanian; preference stored in session; minimal new dependencies  
**Scale/Scope**: Two locales (lt, en) across top journeys; transactional emails and a standard PDF/export localized

Open questions carried into research: None (spec clarifications resolved). Implementation tradeoffs assessed in Phase 0 research.

## Constitution Check

Verify compliance with LGKT Forma Constitution v1.0.0:

- [x] **I. Clean Code Excellence**: Plan favors clear, maintainable patterns (session preference, simple toggle, minimal config)
- [x] **II. Simple & Intuitive UX**: Bilingual UI; language toggle discoverable; no URL noise
- [x] **III. Responsive Design First**: No changes that harm responsiveness; ensure LT text expansion tests
- [x] **IV. DRY**: Centralize i18n keys and formatting; shared helpers for locale
- [x] **V. Minimal Dependencies**: Reuse existing stack; avoid new libs unless justified
- [x] **VI. Comprehensive Testing**: Define unit + e2e tests for language toggle and dev workflow docs checks
- [x] **VII. Technology Stack Compliance**: 
  - [x] Uses Nx monorepo structure
  - [x] TypeScript for all code
  - [x] Express for backend
  - [x] Drizzle ORM + PostgreSQL with migrations for database
  - [x] Zod for validation (frontend + backend)
  - [x] HeroUI for UI components
  - [x] fontAndColour.css for styling

Note: The constitution mandates HeroUI (NextUI deprecated). The plan aligns with HeroUI.

## Project Structure

### Documentation (this feature)

```
specs/003-faster-dev-i18n/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (OpenAPI)
└── tasks.md             # Phase 2 (later)
```

### Source Code (repository root)

```
api/
├── src/
│   ├── app.ts
│   ├── routes/
│   └── middleware/
└── project.json (Nx)

web/
├── src/
│   └── app/
└── project.json (Nx)

db/ (Drizzle)
contracts/ (shared types)
```

**Structure Decision**: Keep existing Nx apps `api` and `web`. No new projects required. Add i18n helpers and session handling in respective apps. Contracts for the i18n preference endpoints live under feature `specs/003-faster-dev-i18n/contracts/`.

References:
- Seed translations captured at `specs/003-faster-dev-i18n/contracts/translations/fields.md` (LT ↔ EN mappings for form labels)

## Complexity Tracking

No constitutional violations expected. Optional Docker dev override considered a convenience, not a stack change.

