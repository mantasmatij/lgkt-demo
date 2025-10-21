# Research – Anonymous Company Form & Admin Scaffold

Created: 2025-10-21  
Branch: 001-users-mantas-matijosaitis

## Decisions and Rationale

### Nx monorepo for Next.js + Express
- Decision: Use Nx to manage a monorepo with `apps/web` (Next.js) and `apps/api` (Express), plus shared `packages/`.
- Rationale: Clear separation of concerns, shared types, and generators; easy orchestration for Docker.
- Alternatives: Turborepo (similar benefits, fewer built-ins); plain workspaces (less tooling). Nx chosen for generators/executors and familiarity.

### PostgreSQL with Drizzle ORM
- Decision: Use PostgreSQL 14+ with Drizzle ORM and migrations.
- Rationale: Strong ecosystem, fits structured data needs; Drizzle provides typed schemas and migrations.
- Alternatives: MySQL (constitution default but unnecessary here), SQLite (too limited for multi-user prod).

### Shared Zod Schemas
- Decision: Define Zod schemas in `packages/validation` and share across web/api.
- Rationale: Single source of truth for validation; reduces duplication and drift.
- Alternatives: Class-validator (server-only), custom validators (more maintenance).

### Simple CAPTCHA for public form
- Decision: Use a lightweight checkbox or simple task challenge.
- Rationale: Meets anti-spam requirement with minimal friction.
- Alternatives: Invisible challenge (lower friction but opaque), none (too risky), server-only heuristics (insufficient alone).

### CSV Export Strategy
- Decision: Generate CSV on demand with streaming/pagination; enforce date range filter.
- Rationale: Handles up to thousands of rows with low memory; aligns with spec success criteria.
- Alternatives: Pre-generated reports (adds storage/complexity), PDF (deferred to next phase).

## Best Practices Notes

- Docker: multi-stage builds; separate services for web, api, and postgres; `.env` with example template; healthchecks.
- Nx: tag-based dependency constraints; enforce lint/test on affected projects; shared tsconfig paths.
- Security: Store secrets in env files (never in repo); rate-limit CSV export endpoint; validate all inputs via Zod.
- Accessibility: Form labels, error summaries, keyboard navigation; mobile tap targets.

## Open Items Resolved

No unresolved clarifications remain from the spec.
