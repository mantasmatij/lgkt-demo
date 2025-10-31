# Quickstart: Faster Dev Feedback & LT/EN i18n

This guide shows two options. Primary: run API and Web locally (no Docker) for fastest feedback. Secondary: optional Docker dev override with file sync.

## Prerequisites
- Node.js 20+
- pnpm or npm (choose your preferred)
- Docker (only needed for Postgres or secondary option)
- Nx is used in this repo. You don't need a global install—use it via `npx nx ...` from the repo root.

## Option A (Recommended): Local dev without Docker

1) Start Postgres (Docker only for DB):

```sh
# From repo root
docker compose -f docker/docker-compose.yml up -d postgres
```

2) Start API locally (watch mode via Nx):

```sh
# Option 1: Use Nx directly
npx nx serve api -c development
# Option 2: Use npm script shortcut
npm run dev:api-local
```

3) Start Web locally (Next.js dev):

```sh
# Option 1: Use npm script shortcut (recommended)
npm run dev:web-local
# Option 2: Direct Next.js CLI from repo root, pointing to the web dir
npx next dev web
```

5) Security notes (CSRF & sessions)

- The client requests a CSRF token from `/api/csrf` and echoes it via the `X-CSRF-Token` header on mutating requests.
- The API uses the double-submit cookie strategy (see `api/src/middleware/csrf.ts`). Ensure cookies are allowed in your browser during local testing.
- Session secret for Docker dev is set via `SESSION_SECRET` in `docker/docker-compose.yml` (development only). Do not reuse in production.
```

4) Verify:
- API: http://localhost:3001/api/health

Examples (fill in):
- 2025-10-30: 12s (web change, dev mode)
- 2025-10-30: 24s (style tweak, dev mode)
- Web: http://localhost:3000

## Option B: Docker dev override with live reload (optional)

Create `docker/docker-compose.override.yml` with bind mounts and dev commands to enable hot reload inside containers. A ready-to-use commented template has been added to the repo. Enable it with:

```yaml
override: true
services:
  api:
    volumes:
      - ../api:/usr/src/app/api
      - ../contracts:/usr/src/app/contracts
    command: ["sh", "-lc", "npm run dev:api"]
  web:
    volumes:
      - ../web:/usr/src/app/web
      - ../contracts:/usr/src/app/contracts
    command: ["sh", "-lc", "npm run dev:web"]
```

Then run:

```sh
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up
```

Note: Production images exclude devDependencies. For containerized dev, ensure images include devDependencies or mount node_modules appropriately. Otherwise, prefer Option A (local dev without Docker) for fastest feedback.

## i18n Behavior (per plan)
- Default language: Lithuanian (LT)
- No URL locale prefixes
- Preference stored in session
- Emails and one standard PDF/export localized for LT/EN

## Troubleshooting
- If API rebuilds too often under Nx, check caching and watch settings in `api/project.json`.
- If web dev server conflicts on port 3000, choose another port with `-p`.
- Ensure Postgres is healthy: `docker ps` and logs for `postgres` service.

## Measure feedback loop (target p90 < 30s)
- Start API and Web locally using the steps above.
- Change a visible string in `web/src/app/page.tsx` or any component.
- Measure time from file save to browser reflecting the change.
- Record your result here (date, seconds). Target: p90 under 30 seconds.
- Result: (2025-10-30; 27.25 seconds)
