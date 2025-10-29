# Quickstart: Faster Dev Feedback & LT/EN i18n

This guide shows two options. Primary: run API and Web locally (no Docker) for fastest feedback. Secondary: optional Docker dev override with file sync.

## Prerequisites
- Node.js 20+
- pnpm or npm (choose your preferred)
- Docker (only needed for Postgres or secondary option)

## Option A (Recommended): Local dev without Docker

1) Start Postgres (Docker only for DB):

```sh
# From repo root
docker compose -f docker/docker-compose.yml up -d postgres
```

2) Start API locally (watch mode via Nx):

```sh
npx nx serve api -c development
```

3) Start Web locally (Next.js dev):

```sh
cd web
npx next dev -p 3000
```

4) Verify:
- API: http://localhost:3001/api/health
- Web: http://localhost:3000

## Option B: Docker dev override with live reload (optional)

Create `docker/docker-compose.override.yml` with bind mounts and dev commands to enable hot reload inside containers.

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
npm run dev:up
```

Note: Ensure `dev:api` and `dev:web` scripts run watch/dev modes (e.g., next dev, node with watch). If missing, add them in respective package configs.

## i18n Behavior (per plan)
- Default language: Lithuanian (LT)
- No URL locale prefixes
- Preference stored in session
- Emails and one standard PDF/export localized for LT/EN

## Troubleshooting
- If API rebuilds too often under Nx, check caching and watch settings in `api/project.json`.
- If web dev server conflicts on port 3000, choose another port with `-p`.
- Ensure Postgres is healthy: `docker ps` and logs for `postgres` service.
