# API Security Notes

This document summarizes the initial auth/session and CSRF strategy planned for the admin-facing APIs. Public submission endpoints remain open (no auth) but still follow secure defaults.

## Sessions & Cookies

- Admin endpoints will use cookie-based sessions with the following defaults:
  - httpOnly: true (not accessible to JS)
  - secure: true in production
  - sameSite: Lax (blocks most cross-site POSTs, ok for top-level navigation)
  - path: /
  - Session storage: to be implemented (signed cookie or server-side store)
- Password hashing: bcryptjs with 10 rounds (see `hashPassword` and `verifyPassword`).

## CSRF Protection (Admin)

- Strategy: Double-submit cookie with per-session token.
  - Server issues a `csrf-token` cookie (non-httpOnly) via `GET /api/csrf`.
  - Client must echo the value in the `X-CSRF-Token` request header for mutating requests (POST/PUT/PATCH/DELETE) to admin endpoints.
  - Middleware validates header vs cookie; mismatch/missing => 403.
- Implementation:
  - `api/src/middleware/csrf.ts` exports `csrfCheck`, `setCsrfCookie`, and `issueCsrfToken`.
  - `cookie-parser` is enabled in the API (`api/src/main.ts`).
  - The CSRF check is not globally applied yet; wire it to admin routes when they are introduced.

## CORS

- `cors({ origin: true, credentials: true })` to echo the `Origin` and allow cookies.
- Keep allowed origins constrained in production via env config (follow-up).

## Helmet

- `helmet()` is enabled with defaults. Tune per feature (e.g., CSP) as admin UI solidifies.

## Next Steps

- Implement actual admin auth endpoints and session persistence.
- Apply `csrfCheck` to all admin mutating routes.
- Lock down CORS origins via env.
- Add rate-limit and brute-force protection to auth routes.
