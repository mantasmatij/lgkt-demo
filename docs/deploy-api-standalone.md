# Deploying API as a Separate Vercel Project

This repo can deploy the Express API separately on Vercel to avoid Next.js function limits.

## Prerequisites
- Vercel account and a new project for the API.
- Database URL (e.g. Neon Postgres) available as `DATABASE_URL`.

## Build artifacts

Build the workspace and prepare the standalone package:

```sh
npm ci
npm run build:api-standalone
```

This produces `api-standalone/` which contains:
- `dist/api/src/vercel-handler.js` – serverless entry point
- `workspace_modules/` – compiled workspace libraries used by the API
- `vercel.json` – function routing + output directory

## Create Vercel Project (API)
- Root Directory: `api-standalone`
- Install Command: `npm install`
- Build Command: leave empty/disabled
- Output Directory: leave empty (controlled by `vercel.json`)
- Environment Variables:
  - `DATABASE_URL`: <your connection string>
  - `SESSION_SECRET`: a long random string
  - Any other API vars your setup requires

Deploy. Your API base URL will look like `https://<project>.vercel.app`.

## Connect Web → API
In the Web project (`web` on Vercel), set:
- `NEXT_PUBLIC_API_BASE_URL`: `https://<api-project>.vercel.app`

## CORS & Cookies
- CORS is enabled with credentials and preflight handled globally.
- Session cookies are issued with `SameSite=None; Secure` for cross-site usage between web and api domains.
