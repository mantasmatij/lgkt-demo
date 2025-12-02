# api-vercel

Vercel-native serverless API for lgkt-forma.

## Endpoints
- `GET /api/health` – simple OK check.
- `POST /api/auth/login` – authenticate admin user via Postgres and set `session` cookie.

## Configuration
Set env vars in the Vercel project:
- `DATABASE_URL` – Postgres connection string.
- `SESSION_SECRET` – random secret for session signing.

## CORS
All endpoints handle CORS + preflight (`OPTIONS`) with `Access-Control-Allow-Credentials: true` and `SameSite=None; Secure` cookies.

## Deploy
Project root: `api-vercel/`
- Install Command: `npm ci` (runs in `api-vercel/`)
- Build Command: none (Vercel compiles TS automatically)
- Output: functions-only

For local dev:
```sh
cd api-vercel
vercel dev
```
