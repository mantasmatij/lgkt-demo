ios/ or android/
# Implementation Plan: Anonymous Company Form & Admin Scaffold

**Branch**: `001-users-mantas-matijosaitis` | **Date**: 2025-10-21 | **Spec**: /Users/mantas.matijosaitis/repos/lgkt-forma/specs/001-users-mantas-matijosaitis/spec.md
**Input**: Feature specification for anonymous company form + admin scaffold

## Summary

Build a small Nx monorepo with a Next.js frontend (public form + admin UI) and an Express backend API, containerized with Docker, persisting to PostgreSQL via Drizzle ORM. Share Zod schemas across frontend/backend. Provide CSV export, admin auth (username/password), simple CAPTCHA on public form, and companies aggregation by company code. Testing: Jest (backend) and Cucumber (frontend). Deliver a clean and comprehensible project structure with clear routing and contracts.

## Technical Context

**Language/Version**: TypeScript (Node 20+ / ES2022)
**Primary Dependencies**: Nx (monorepo), Next.js (frontend), Express (backend), Drizzle ORM, Zod, Tailwind CSS + Tailwind UI (components), CSV generation lib
**Storage**: PostgreSQL 14+
**Testing**: Jest (backend unit/integration), Cucumber + Playwright (frontend BDD E2E)
**Target Platform**: Docker (containerized services)
**Project Type**: Web app (frontend + backend in monorepo)
**Performance Goals**: CSV export for 1,000 submissions < 10s; page loads < 2s on typical network; admin list pagination responsive < 1s for paging 50 rows
**Constraints**: Keep dependencies minimal; share types/schemas; stick to simple auth; avoid tight coupling to WordPress; accessibility for form
**Scale/Scope**: Initial dataset up to ~10k submissions in first phase; single admin role

NEEDS CLARIFICATION (technical): None critical outstanding after spec clarification

## Constitution Check

Gate check against LGKT Forma Constitution v1.0.0 (pre-design):

- [x] I. Clean Code Excellence — Plan adopts Nx libs for shared code, clear layering, typed contracts
- [x] II. Simple & Intuitive UX — Simple form and admin lists; consistent patterns; validation feedback
- [x] III. Responsive Design First — Mobile-first design, accessibility notes captured in spec
- [x] IV. DRY — Shared Zod schemas, shared DB lib, shared UI primitives
- [x] V. Minimal Dependencies — Justified selections (Nx, Next.js, Express, Drizzle, Zod, CSV lib)
- [x] VI. Comprehensive Testing — Jest (backend) and Cucumber (frontend) established
- [~] VII. Technology Stack Compliance:
  - [x] Nx monorepo
  - [x] TypeScript
  - [x] Express backend
  - [x] Drizzle ORM + migrations
  - [x] Zod validation
  - [~] UI library: Tailwind UI instead of NextUI (justified)
  - [~] Database: PostgreSQL instead of MySQL (justified)
  - [x] fontAndColour.css will be integrated as Tailwind tokens

Justifications recorded in Complexity Tracking; re-check after Phase 1.

## Project Structure

### Documentation (this feature)

```
/Users/mantas.matijosaitis/repos/lgkt-forma/specs/001-users-mantas-matijosaitis/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── openapi.yaml
```

### Source Code (monorepo root)

```
/Users/mantas.matijosaitis/repos/lgkt-forma/
├── apps/
│   ├── web/                 # Next.js app (public form + admin UI)
│   └── api/                 # Express API (admin/auth, submissions, export)
├── packages/
│   ├── db/                  # Drizzle ORM setup, schema, migrations
│   ├── validation/          # Shared Zod schemas (submission, auth)
│   ├── ui/                  # Shared UI primitives (Tailwind CSS + tokens)
│   └── contracts/           # Generated API types (OpenAPI), client SDK (optional)
├── docker/                  # Dockerfiles, docker-compose, env templates
└── tools/                   # Nx generators/executors (as needed)
```

**Structure Decision**: Nx monorepo with two apps (`apps/web`, `apps/api`) and shared packages (`packages/db`, `packages/validation`, `packages/ui`, `packages/contracts`).

## Complexity Tracking (Constitution deviations)

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| VII Stack: Use PostgreSQL vs MySQL | App is independent of WordPress DB; Postgres better fits team preference and ecosystem; Drizzle supports it | Using MySQL solely for WordPress compatibility is unnecessary; we do not integrate or share WP schema |
| VII Stack: Tailwind UI vs NextUI | Team prefers Tailwind utility approach and Tailwind UI components; faster to scaffold responsive form/admin | NextUI adds another component lib; mixing both increases deps; Tailwind UI meets UX and responsiveness goals |

We will still consume `fontAndColour.css` via Tailwind CSS tokens to maintain design consistency.

---

## Phase 0: Outline & Research

All critical clarifications are resolved. Research tasks focus on best practices and integration patterns:

Research tasks dispatched (documented in research.md):
- Research Nx setup for Next.js + Express with shared packages
- Research Dockerization for Nx workspaces (multi-service + Postgres)
- Research Drizzle ORM with PostgreSQL: schema, migrations, local workflows
- Research sharing Zod schemas between frontend and backend
- Research implementing simple CAPTCHA in a public form without degrading UX
- Research CSV export streaming and pagination strategies

Output: research.md with decisions, rationale, alternatives.

## Phase 1: Design & Contracts

Prerequisite: research.md complete.

Artifacts to produce:
- data-model.md: Entities (Company, Submission, AdminUser), fields, relationships, validation rules
- contracts/openapi.yaml: REST endpoints for form submission, admin auth, submissions list, companies list, CSV export
- quickstart.md: Nx workspace init, app/package generation, dev/prod Docker, env setup, basic commands
- Update agent context via `.specify/scripts/bash/update-agent-context.sh copilot`

Constitution re-check will be performed post-design.

## Phase 2: Planning Outputs (Stop here)

This command stops after generating the above design artifacts. Task breakdown will be created later via `/speckit.tasks`.

