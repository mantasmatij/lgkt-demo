# Tasks – Anonymous Company Form & Admin Scaffold

Branch: 001-users-mantas-matijosaitis  
Spec: /Users/mantas.matijosaitis/repos/lgkt-forma/specs/001-users-mantas-matijosaitis/spec.md  
Plan: /Users/mantas.matijosaitis/repos/lgkt-forma/specs/001-users-mantas-matijosaitis/plan.md

## Phase 1 – Setup (project initialization)

- [x] T001 Initialize Nx workspace (apps/web, apps/api) at repo root
- [x] T002 Create packages/db with Drizzle setup and PostgreSQL client
- [x] T003 Create packages/validation with Zod schemas (shared)
- [x] T004 Create packages/ui with NextUI theme and primitives; ingest fontAndColour.css as the exclusive source of fonts/colors
- [x] T005 Create packages/contracts to host OpenAPI types and API client generator
- [x] T006 Add Dockerfiles for apps/web and apps/api under docker/
- [x] T007 Add docker-compose.yml orchestrating web, api, postgres under docker/
- [x] T008 Configure root tsconfig base paths and Nx project.json for apps/packages
- [x] T009 Configure ESLint/Prettier at root and per app/package
- [x] T010 Wire Jest configs for apps/api and packages; add basic test
- [x] T011 Configure Cucumber test runner for apps/web (Playwright/Cypress)
- [x] T012 Create .env.example files for web, api, and docker with required vars

## Phase 2 – Foundational (blocking prerequisites)

- [x] T013 Implement initial Drizzle schema files in packages/db/src/schema.ts
- [x] T014 Add database migration scripts and migration runner in packages/db
- [x] T015 [P] Implement shared Zod schemas in packages/validation/src/submission.ts
- [x] T016 [P] Implement shared Zod schemas in packages/validation/src/auth.ts
- [x] T017 Implement API contracts sync in packages/contracts (generate types from contracts/openapi.yaml)
- [x] T018 Add auth session strategy and middleware skeleton in apps/api/src/middleware/auth.ts
- [x] T019 Add CAPTCHA verification service interface in apps/api/src/services/captcha.ts
- [x] T020 Add CSV export utility in apps/api/src/utils/csv.ts
- [ ] T021 Configure NextUI provider, theme, and base layout components in packages/ui; Tailwind CSS allowed for utility classes only (no component lib)
- [x] T021a Add security hardening scaffolding in apps/api: helmet, CORS, error handler, request logging
- [ ] T021b Define authentication security details: password hashing (Argon2/bcrypt), session cookie flags (Secure, HttpOnly, SameSite), CSRF strategy for admin UI
 - [x] T021c Implement file storage adapter (local dev: ./uploads, prod: object storage) and validation config (allowed types, max size)

## Phase 3 – User Story 1 (P1): Submit public company form

Story goal: Company user submits the public form without login.
Independent test criteria: Able to submit valid data and see confirmation; invalid fields block submit with clear errors.

- [ ] T022 [US1] Create public form page in apps/web/src/app/form/page.tsx (fields per spec; include repeating sections Organs/GenderBalance/Measures/Attachments)
- [ ] T023 [P] [US1] Build form field components for repeating sections in packages/ui (Organs, GenderBalance, Measures, Attachments)
- [ ] T024 [US1] Wire Zod schema validation in apps/web for client-side validation (packages/validation)
- [ ] T025 [US1] Implement POST /submissions endpoint in apps/api/src/routes/submissions.ts
 - [ ] T025a Implement POST /uploads endpoint in apps/api/src/routes/uploads.ts (multipart form-data, limits, type validation)
 - [x] T025a Implement POST /uploads endpoint in apps/api/src/routes/uploads.ts (multipart form-data, limits, type validation)
- [ ] T026 [US1] Implement CAPTCHA verification in apps/api/src/services/captcha.ts and integrate in submissions route
- [ ] T026a [US1] Handle CAPTCHA service unavailability gracefully: block submission with retriable message; add unit/integration test
- [ ] T027 [US1] Persist submission + child records (including repeating sections and attachments metadata) via packages/db repository functions
 - [ ] T027a [US1] On submission, resolve `uploadId` file references into Attachment rows; cleanup temp state if applicable
- [ ] T028 [US1] Update Company record by company code on submission (upsert) in packages/db
- [ ] T029 [US1] Show success confirmation page/state in apps/web/src/app/form/success/page.tsx
- [ ] T030 [US1] Add basic E2E scenario (Cucumber) for happy path submit (apps/web/tests/e2e/us1-submit.feature)
- [ ] T030a [US1] Add E2E scenario for client-side validation errors and consent requirement
- [ ] T022a [US1] Implement inline client-side uploader: drag-and-drop + file picker, per-file progress, remove option; client-side type/size validation; call /uploads; include `uploadId` refs in submission payload; display clear inline errors (no extra steps/pages)

## Phase 4 – User Story 2 (P2): Admin sign-in and dashboard

Story goal: Admin can sign in and view dashboard with submissions list or empty state.
Independent test criteria: Unauthed redirects to sign-in; authed sees dashboard; empty state handled.

- [ ] T031 [US2] Create admin sign-in page apps/web/src/app/admin/sign-in/page.tsx
- [ ] T032 [US2] Implement POST /auth/login in apps/api/src/routes/auth.ts (username/password)
- [ ] T033 [US2] Implement session storage and auth middleware in apps/api/src/middleware/auth.ts
- [ ] T034 [US2] Protect admin routes and add /admin redirect behaviors in apps/web
- [ ] T035 [US2] Implement GET /admin/submissions endpoint with pagination in apps/api/src/routes/admin/submissions.ts
- [ ] T036 [US2] Build admin dashboard page apps/web/src/app/admin/dashboard/page.tsx (list or empty state)
- [ ] T037 [US2] Add E2E scenario: redirect unauthenticated to sign-in; sign-in to dashboard (apps/web/tests/e2e/us2-auth.feature)
 - [ ] T037a [US2] Add CSRF verification test for protected admin actions (form-based or token-based per strategy)

## Phase 5 – User Story 3 (P3): Companies view and CSV export

Story goal: Admin can view companies aggregated by company code, and export CSV for date range.
Independent test criteria: Companies aggregated by code; CSV download contains required columns and respects date range.

- [ ] T038 [US3] Implement GET /admin/companies endpoint in apps/api/src/routes/admin/companies.ts (aggregate by company code)
- [ ] T039 [US3] Create Companies page apps/web/src/app/admin/companies/page.tsx (shows count per company code, name is latest)
- [ ] T040 [US3] Implement GET /admin/reports/export.csv in apps/api/src/routes/admin/reports.ts (streamed CSV)
- [ ] T041 [US3] Add date range picker and export link in apps/web/src/app/admin/reports/page.tsx
- [ ] T042 [US3] Add E2E scenario: export CSV for date range (apps/web/tests/e2e/us3-export.feature)
 - [ ] T042a [US3] Seed dataset with duplicates and naming variations; add tests asserting aggregation accuracy (latest name, counts)
 - [ ] T042b [US3] Add performance test for CSV export: seed 1,000 submissions and assert generation ≤ 10s for 30-day range

## Phase 6 – Polish & Cross-Cutting

- [ ] T043 Improve accessibility: labels, error summary, keyboard nav (apps/web)
- [ ] T043a Add responsive viewport E2E checks: mobile, tablet, desktop; assert no horizontal scroll on mobile and tappable targets
- [ ] T044 Add rate limiting on export endpoint (apps/api/src/middleware/rateLimit.ts)
- [ ] T045 Add basic observability: request logging and error handling middleware (apps/api/src/middleware)
- [ ] T046 Add health checks for web/api and Docker healthcheck configs (docker/)
- [ ] T047 README updates and environment docs at repo root
 - [ ] T048 Add SC-001 usability measurement plan and run a small usability test (n>=10) to validate "95% in <5m"; report findings
 - [ ] T049 Add SC-005 CAPTCHA effectiveness measurement: collect telemetry (bot blocks vs submits, abandonment deltas), analyze for 80% drop without >5pp legit abandonment

## Constitution Compliance Notes

- NextUI is used as the primary component library; fontAndColour.css is the exclusive source for fonts/colors via the NextUI theme.
- Responsive testing will include multiple viewports as per constitution.

## Dependencies (story order)

1. Phase 1 → Phase 2 → US1 → US2 → US3 → Polish
2. US1 provides data for US2/US3 but US2 UI can be built with empty state first

## Parallel execution examples

- T015 and T016 can run in parallel (separate schema files)
- T023 can proceed while T025 is being implemented
- T031 and T036 can be built in parallel with T035 once auth middleware T033 is ready

## MVP Scope

- Deliver Phase 1 + Phase 2 + US1
  - Public form submission end-to-end without admin features

## Format validation

All tasks use strict checklist format with Task IDs, [P] markers for parallelizable tasks, [USx] labels for story tasks, and concrete file paths.
