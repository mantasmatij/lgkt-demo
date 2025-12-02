# api-vercel

Vercel-native serverless API for lgkt-forma.

## Endpoints
- `GET /api/health` – simple OK check.
- `POST /api/auth/login` – authenticate admin user via Postgres and set `session` cookie.
- `POST /api/auth/logout` – clear the `session` cookie.
- `GET /api/auth/me` – return current user based on `session` cookie.

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

## Quick smoke tests
```sh
curl -i https://<api-domain>/api/health
curl -i -X OPTIONS https://<api-domain>/api/auth/login
curl -i -X POST https://<api-domain>/api/auth/login -H 'content-type: application/json' --data '{"email":"admin@example.com","password":"..."}'
curl -i https://<api-domain>/api/auth/me --cookie-jar jar.txt --cookie jar.txt
curl -i -X POST https://<api-domain>/api/auth/logout --cookie jar.txt
```
