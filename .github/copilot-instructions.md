# lgkt-forma Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-21

## Active Technologies
- TypeScript (Node 20+ / ES2022) + Nx (monorepo), Next.js (frontend), Express (backend), Drizzle ORM, Zod, Tailwind CSS + Tailwind UI (components), CSV generation lib (001-users-mantas-matijosaitis)
- TypeScript (ES2022 target), Node 20+ (002-ui-redesign-responsive)
- N/A (UI-only feature, no database schema changes) (002-ui-redesign-responsive)
- TypeScript (Node 20+ / ES2022) + Nx (workspace), Express (API), Next (web), Drizzle ORM, Zod, HeroUI, Tailwind CSS (003-faster-dev-i18n)
- PostgreSQL (via Docker compose for local dev) (003-faster-dev-i18n)
- TypeScript (ES2022), Node 20+ + Express (API), Next.js (web), Drizzle ORM, Zod, HeroUI (components) (005-improve-form-list)
- PostgreSQL (migrations via Drizzle) (005-improve-form-list)
- TypeScript (ES2022), Node 20+ + Next.js (web), Express (API), HeroUI (components), Zod (validation), Drizzle ORM (data access) (006-company-list-detail)
- PostgreSQL via existing db package and migrations (006-company-list-detail)
- TypeScript (ES2022) / Node 20+ + Next.js (App Router), HeroUI (components), Tailwind CSS, Express (API), Drizzle ORM, Zod (validation), i18n context (existing) (007-admin-nav-sidebar)
- PostgreSQL (existing), plus sessionStorage/cookie for sidebar state (no new tables) (007-admin-nav-sidebar)
- TypeScript (ES2022), Node 20+ + Next.js (web), Express (API), Drizzle ORM, Zod, HeroUI, Tailwind CSS (008-expand-reporting-mvp)
- PostgreSQL (existing db package, migrations via Drizzle) (008-expand-reporting-mvp)

## Project Structure
```
src/
tests/
```

## Commands
npm test && npm run lint

## Code Style
TypeScript (Node 20+ / ES2022): Follow standard conventions

## Recent Changes
- 008-expand-reporting-mvp: Added TypeScript (ES2022), Node 20+ + Next.js (web), Express (API), Drizzle ORM, Zod, HeroUI, Tailwind CSS
- 007-admin-nav-sidebar: Added TypeScript (ES2022) / Node 20+ + Next.js (App Router), HeroUI (components), Tailwind CSS, Express (API), Drizzle ORM, Zod (validation), i18n context (existing)
- 006-company-list-detail: Added TypeScript (ES2022), Node 20+ + Next.js (web), Express (API), HeroUI (components), Zod (validation), Drizzle ORM (data access)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
