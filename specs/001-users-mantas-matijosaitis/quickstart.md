# Quickstart – Anonymous Company Form & Admin Scaffold

Created: 2025-10-21  
Branch: 001-users-mantas-matijosaitis

## Prereqs
- Node.js 20+
- Docker + Docker Compose

## Workspace bootstrap (Nx)
- Create Nx monorepo with apps `web` (Next.js) and `api` (Express)
- Create packages `db`, `validation`, `ui`, `contracts`
- Configure tsconfig base paths and lint/test targets

## Environment
- Create `.env` files for `api` and `web`, plus `docker/.env` for shared vars
- Variables: POSTGRES_*, SESSION_SECRET, CSV_EXPORT_LIMITS, CAPTCHA_*

## Run locally
- Use Docker Compose to start Postgres
- Start API and Web apps with Nx (`nx serve api`, `nx serve web`)

## Database
- Generate Drizzle migrations in `packages/db/migrations`
- Run migrations on startup for dev

## Testing
- Backend: Jest unit + integration
- Frontend: Cucumber BDD scenarios (Playwright or Cypress runner)

## Build & Docker
- Multi-stage Dockerfiles for `apps/api` and `apps/web`
- docker-compose.yml orchestrates `web`, `api`, and `postgres`

## Notes
- Keep validation in `packages/validation` and import on both sides
- Use company code as aggregation key; latest name per code in Companies view
- CSV export enforces date range and streams results
- Form fields include legal form, address, registry, eDelivery address, reporting period dates, multiple governance organs, gender balance rows, optional link/files, measures list, and reasons text; model repeating groups as arrays.
