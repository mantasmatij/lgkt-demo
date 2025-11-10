# Tasks: Form List Improvements

Created: 2025-11-04
Feature Dir: /Users/mantas.matijosaitis/repos/lgkt-forma/specs/005-improve-form-list
Plan: /Users/mantas.matijosaitis/repos/lgkt-forma/specs/005-improve-form-list/plan.md
Spec: /Users/mantas.matijosaitis/repos/lgkt-forma/specs/005-improve-form-list/spec.md

## Phase 1: Setup

- [X] T001 Ensure admin route base exists in web at web/src/app/admin (create index page if missing)
- [X] T002 Create Admin Forms list page at web/src/app/admin/forms/page.tsx
- [X] T003 Create Admin Form details page route at web/src/app/admin/forms/[id]/page.tsx
- [X] T004 Create API route file for forms list at api/src/routes/admin/forms.ts
- [X] T005 Create API route file for form details at api/src/routes/admin/formDetails.ts
- [X] T006 Create service module for forms queries at api/src/services/formsService.ts
- [X] T007 Create Zod schemas for List query params and response at validation/src/forms/list.schemas.ts
- [X] T008 Create Zod schemas for Details response at validation/src/forms/details.schemas.ts
- [X] T009 Wire auth guard (admin-only) middleware if not present at api/src/middleware/authAdmin.ts

## Phase 2: Foundational

- [X] T010 Implement shared pagination and sorting helpers at api/src/utils/pagination.ts
- [X] T011 Implement URL state helpers (encode/decode list filters) at web/src/services/forms/urlState.ts
- [X] T012 Implement client API client functions at web/src/services/forms/api.ts
- [X] T013 Add table, filters, and pagination UI components (HeroUI) at web/src/components/forms/
- [X] T014 Evaluate DB indexes per research (submission_date, company_name/code, report_period_*) and capture in planning notes (no migration in this feature)

## Phase 3: User Story 1 (P1) — View forms list

Goal: Render a list of forms with specified columns and default sorting by Submission Date (newest first). Show empty state when no data. Restrict access to Admins.
Independent test: Navigate to Admin Forms page; see table with columns and default sort; empty state rendered when no data.

- [X] T015 [US1] Implement GET /admin/forms endpoint with default sort in api/src/routes/admin/forms.ts
- [X] T016 [US1] Implement formsService.getForms with default sort and projection in api/src/services/formsService.ts
- [X] T015 [US1] Implement GET /admin/forms endpoint with default sort in api/src/routes/admin/forms.ts
- [X] T016 [US1] Implement formsService.getForms with default sort and projection in api/src/services/formsService.ts
- [X] T017 [US1] Validate/normalize query params (page, pageSize, sortBy, sortDir) with Zod at validation/src/forms/list.schemas.ts
- [X] T018 [US1] Render list table with columns (Company Name, Code, Type, Report Period From/To, Women %, Men %, Requirements Applied, Submitter Email, Submission Date) in web/src/app/admin/forms/page.tsx
- [X] T019 [US1] Apply default sorting by submissionDate desc in web/src/app/admin/forms/page.tsx
- [X] T020 [US1] Add empty-state message when items.length === 0 in web/src/app/admin/forms/page.tsx
- [X] T021 [US1] Enforce admin-only access on API and Web route (middleware/guard) at api/src/middleware/authAdmin.ts and web/src/app/admin/layout.tsx

## Phase 4: User Story 2 (P1) — Filter forms

Goal: Support filters for Company (name or code), Submission Date (inclusive local), Reporting Period overlap, and gender imbalance outside 33–67%. Combine as OR within type; AND across types. Reset to page 1 on filter changes. Deep-link SHOULD.
Independent test: Apply each filter individually and in combination; results, counts, and URL state update; invalid params fall back to defaults.

- [X] T022 [US2] Add company filter to API (name OR code substring) in api/src/services/formsService.ts
- [X] T023 [US2] Add submission date range (inclusive local) filter to API in api/src/services/formsService.ts
- [X] T024 [US2] Add reporting period overlap filter (from/to inclusive) to API in api/src/services/formsService.ts
- [X] T025 [US2] Add genderImbalance=outside_33_67 filter to API in api/src/services/formsService.ts
- [X] T026 [US2] Extend list query Zod schema with filters at validation/src/forms/list.schemas.ts
- [X] T027 [US2] Implement filters UI (company input; date range pickers for submission date and reporting period; imbalance toggle) in web/src/components/forms/Filters.tsx
- [X] T028 [US2] Wire filters to list fetch and reset page index to 1 on change in web/src/app/admin/forms/page.tsx
- [X] T029 [US2] Implement deep-link SHOULD: encode filters/page/pageSize in URL; graceful fallback for invalid params in web/src/services/forms/urlState.ts
- [X] T030 [US2] Render clear-all filters control and no-results state in web/src/app/admin/forms/page.tsx

## Phase 5: User Story 3 (P2) — Select page size

Goal: Allow page size selection (10, 25, 50, 100) default 25; remember for session; update list and pagination immediately.
Independent test: Change page size, rows update; return in session retains last selection.

- [X] T031 [US3] Add pageSize selector UI and wire to fetch in web/src/components/forms/Pagination.tsx
- [X] T032 [US3] Persist pageSize for session in memory/storage and apply on mount in web/src/app/admin/forms/page.tsx

## Phase 6: User Story 4 (P2) — View form details

Goal: Read-only details matching the form filling page; open from list; preserve list state on return.
Independent test: Open details; see all fields and metadata; navigate back preserves filters/page/pageSize.

- [X] T033 [US4] Implement GET /admin/forms/:id endpoint in api/src/routes/admin/formDetails.ts
- [X] T034 [US4] Implement formsService.getFormById in api/src/services/formsService.ts
- [X] T035 [US4] Add details response Zod schema at validation/src/forms/details.schemas.ts
- [X] T036 [US4] Render details page read-only with full field set in web/src/app/admin/forms/[id]/page.tsx
- [X] T037 [US4] Link from list rows to details and preserve list state on back in web/src/app/admin/forms/page.tsx

## Final Phase: Polish & Cross-Cutting

- [ ] T038 Review accessibility: table headers, focus order, keyboard nav in web/src/components/forms/
- [ ] T039 Add non-technical error messages and retry on API failure in web/src/app/admin/forms/page.tsx
- [ ] T040 Update quickstart with any endpoint/param adjustments at specs/005-improve-form-list/quickstart.md
- [ ] T041 Re-check Constitution compliance and update plan notes at specs/005-improve-form-list/plan.md

## Tests

- [ ] T042 [US1] Backend Jest tests for GET /admin/forms default sort and pagination in api/src/routes/admin/forms.spec.ts
- [ ] T043 [US1] Frontend Cucumber scenario for default columns/sort/empty state in web/tests/features/admin_forms_list.feature
- [ ] T044 [US2] Backend Jest tests for filters: company, submissionDate (inclusive local), report period overlap, genderImbalance, and OR-within/AND-across in api/src/services/formsService.spec.ts
- [ ] T045 [US2] Backend Jest test: reset page to 1 on filter change (query param handling) in api/src/routes/admin/forms.spec.ts
- [ ] T046 [US2] Frontend Cucumber scenario: apply each filter, URL deep-link roundtrip, invalid URL fallback in web/tests/features/admin_forms_filters.feature
- [ ] T047 [US3] Frontend Cucumber scenario: page size selection and session persistence in web/tests/features/admin_forms_pagination.feature
- [ ] T048 [US4] Backend Jest tests: GET /admin/forms/:id returns 200 with full fields and 404 when missing in api/src/routes/admin/formDetails.spec.ts
- [ ] T049 [US4] Frontend Cucumber scenario: read-only details view and back navigation preserves list state in web/tests/features/admin_form_details.feature
- [ ] T050 [P] Configure Cucumber test harness if missing in web/tests/setup/cucumber.config.ts
- [ ] T051 [P] Configure Jest test utilities for API routes in api/src/tests/jest.setup.ts
- [ ] T052 Add simple performance check (timing log/assert) for list endpoint in api/src/tests/perf/admin_forms_perf.spec.ts
- [ ] T053 Add a11y smoke test for table semantics (headers/focus) in web/tests/features/admin_forms_a11y.feature
- [ ] T054 Add DST boundary/date inclusion case to list filter tests in api/src/services/formsService.spec.ts
- [ ] T055 Ensure URL state encode/decode unit tests in web/src/services/forms/urlState.spec.ts

## Dependencies & Order

1. Setup → Foundational → US1 → (US2 in parallel with US3 after US1) → US4 → Polish
2. US1 is MVP; US2 depends on list existing; US3 depends on pagination in US1; US4 depends on list to navigate from.

## Parallel Execution Examples

- [ ] T-PEX1 [P] Implement API list endpoint (T015) while another dev builds list UI (T018)
- [ ] T-PEX2 [P] Build filters UI (T027) in parallel with API filter wiring (T022–T025)
- [ ] T-PEX3 [P] Implement details endpoint (T033) while another builds details page (T036)

## Implementation Strategy

Start with MVP (US1): implement list endpoint and page with default sort and pagination. Then deliver US2 filters and US3 page-size in parallel. Finally add US4 details and polish. Keep validation centralized with Zod; prefer server-side filtering/sorting; implement graceful fallback for deep-linking.
