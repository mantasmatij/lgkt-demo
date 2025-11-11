# Tasks: Company List & Detail

**Branch**: `006-company-list-detail`
**Spec**: specs/006-company-list-detail/spec.md
**Plan**: specs/006-company-list-detail/plan.md

## Dependency Graph (User Stories)
1. US1 (Browse & Search) → foundational for list presence
2. US2 (Filter) depends on list base from US1
3. US3 (Detail & Submissions) independent of filters; depends only on base company retrieval (can start after US1 service/data layer)

Parallel notes: US2 and US3 can proceed in parallel once core company list service + contract (US1) exists.

## Phase 1: Setup

- [x] T001 Ensure branch `006-company-list-detail` is checked out
- [x] T002 Confirm OpenAPI file at specs/006-company-list-detail/contracts/openapi.yaml is valid (lint/parse) (verified presence and schema header)
- [x] T003 Add placeholder company service file api/src/services/companies.service.ts (scaffolded with list/detail/submissions)
- [x] T004 Add companies UI directory web/src/app/admin/companies/ (already present)

## Phase 2: Foundational

- [ ] T007 Implement Drizzle queries for company list in api/src/services/companies.service.ts (search, sort name desc, pagination, filters type/registry)
- [ ] T008 Implement Drizzle query for single company detail + submissions in api/src/services/companies.service.ts
- [ ] T009 Add Zod schemas for company list query params api/src/services/companies.service.ts or shared validation path
- [ ] T010 Add Zod schemas for company detail and submissions response shapes in api/src/services/companies.service.ts
- [ ] T011 [P] Extract shared pagination utility if not present into api/src/utils/pagination.ts
- [ ] T012 [P] Extract shared query param parsing utility for search/filters into api/src/utils/query.ts
- [ ] T013 Add tests for company service queries api/src/services/__tests__/companies.service.test.ts
- [ ] T047 Create Drizzle migration to add/ensure Company fields: type, legalForm, address, registry, eDeliveryAddress; add indexes on name, code, type, registry db/migrations/*
- [ ] T048 Update Company schema definitions to include new fields and indexes db/src/lib/*
- [ ] T049 Wire new fields into service selects and mapping api/src/services/companies.service.ts
- [ ] T052 Add Jest auth tests for admin endpoints (401/403 when unauthenticated) api/src/routes/admin/__tests__/companies.auth.test.ts

## Phase 3: User Story 1 (Browse & Search Companies) [P1]

Story Goal: Admin can view companies list with default sort (name desc) and search by name/code.
Independent Test Criteria: Visiting /admin/companies shows descending name order; search returns expected subset; empty state displays when no matches.

- [ ] T014 [US1] Extend existing GET /admin/companies to support search (name/code), pagination, and default sort by name desc in api/src/routes/admin/companies.ts
- [ ] T015 [P] [US1] Map service results to response schema per contract in api/src/routes/admin/companies.ts
- [ ] T016 [US1] Implement client fetcher for list web/src/services/companies/list.ts
- [ ] T017 [P] [US1] Implement Companies list page web/src/app/admin/companies/page.tsx using existing components/forms/Table.tsx and components/forms/Filters.tsx
- [ ] T018 [P] [US1] Integrate search with URL state web/src/services/forms/urlState.ts (extend or reuse)
- [ ] T019 [P] [US1] Define list columns (name, code, type, address, eDelivery) within page component web/src/app/admin/companies/page.tsx
- [ ] T020 [US1] Add empty state UI for no results using existing Table empty pattern web/src/app/admin/companies/page.tsx
- [ ] T021 [US1] Add pagination controls integration (reuse existing) web/src/components/forms/Pagination.tsx and web/src/app/admin/companies/page.tsx
- [ ] T022 [US1] Add basic Jest test for endpoint list ordering api/src/routes/admin/__tests__/companies.list.test.ts
- [ ] T023 [US1] Add Playwright/Cucumber test scenario for search and empty state web/tests/companies-list.spec.ts
- [ ] T050 [US1] Replace existing aggregated list response with spec-conforming shape (name, code, type, address, eDelivery) or provide separate /admin/companies/summary; deprecate old shape api/src/routes/admin/companies.ts

## Phase 4: User Story 2 (Filter Companies) [P2]

Story Goal: Admin can apply Company type and Registry filters and combine with search.
Independent Test Criteria: Applying type or registry shows only matching rows; clearing filters resets list and sort.

- [ ] T024 [US2] Extend GET /admin/companies endpoint to process type & registry query params api/src/routes/admin/companies.ts
- [ ] T025 [P] [US2] Extend service query to apply filters api/src/services/companies.service.ts
- [ ] T026 [P] [US2] Implement filter controls using existing components/forms/Filters.tsx web/src/app/admin/companies/page.tsx
- [ ] T027 [US2] Integrate filters with URL state web/src/services/forms/urlState.ts (add type & registry)
- [ ] T028 [P] [US2] Display active filter chips and clear-all using existing pattern web/src/app/admin/companies/page.tsx
- [ ] T029 [US2] Add Jest test for filtered results api/src/routes/admin/__tests__/companies.filters.test.ts
- [ ] T030 [US2] Add Playwright scenario for filter application and clear web/tests/companies-filters.spec.ts
- [ ] T053 [US2] Implement endpoint or service to supply allowed values for Company type and Registry (from reference data or distinct) api/src/routes/admin/companies.ts
- [ ] T054 [P] [US2] Populate filter controls with allowed values web/src/app/admin/companies/page.tsx

## Phase 5: User Story 3 (Company Detail & Submissions) [P3]

Story Goal: Admin can view all company fields and submissions ordered by submission date desc.
Independent Test Criteria: Detail page shows each required field once; submissions table respects ordering; empty state shown when none.

- [ ] T031 [US3] Implement GET /admin/companies/:id endpoint in api/src/routes/admin/companies.ts (detail)
- [ ] T032 [US3] Implement GET /admin/companies/:id/submissions endpoint in api/src/routes/admin/companies.ts (submissions list)
- [ ] T033 [P] [US3] Implement service methods for detail and submissions api/src/services/companies.service.ts
- [ ] T034 [US3] Implement client fetchers web/src/services/companies/detail.ts and web/src/services/companies/submissions.ts
- [ ] T035 [P] [US3] Implement Company detail page web/src/app/admin/companies/[companyId]/page.tsx
- [ ] T036 [P] [US3] Implement submissions table using existing components/forms/Table.tsx web/src/app/admin/companies/[companyId]/page.tsx
- [ ] T037 [US3] Add empty state for no submissions web/src/app/admin/companies/[companyId]/page.tsx
- [ ] T038 [US3] Add Jest tests for detail and submissions endpoints api/src/routes/admin/__tests__/companies.detail.test.ts
- [ ] T039 [US3] Add Playwright scenario for company detail + submissions ordering web/tests/company-detail.spec.ts

## Phase 6: Polish & Cross-Cutting

- [ ] T040 Add loading states for list and detail views web/src/app/admin/companies/page.tsx & web/src/app/admin/companies/[companyId]/page.tsx
- [ ] T041 Add error boundary or retry logic using existing RetryButton web/src/components/forms/RetryButton.tsx
- [ ] T042 Performance review: confirm queries use indexes and efficient pagination api/src/services/companies.service.ts
- [ ] T043 Accessibility review: table headers and focus states web/src/components/tables/CompanyTable.tsx
- [ ] T044 Refactor duplicated code into shared utilities api/src/utils/query.ts & web/src/services/companies/
- [ ] T045 Update README or admin docs referencing new feature README.md
- [ ] T046 Add monitoring hooks/logging for list/detail access api/src/routes/admin/companies.ts

## Parallel Execution Examples
- US1 page implementation (T017) can proceed in parallel with service query extraction (T011, T012) once scaffold exists.
- US2 filter UI (T026, T028) can proceed after base list (T017) without waiting for detail endpoints.
- US3 detail page (T035) can proceed in parallel with submissions endpoint (T032) once company detail endpoint (T031) is stubbed.

## MVP Scope Suggestion
Implement Phase 3 (US1) only for initial deploy: list view with search, sort, pagination, and empty state.

## Task Counts
- Total Tasks: 50
- US1 Tasks: 11 (T014–T023, T050)
- US2 Tasks: 9 (T024–T030, T053–T054)
- US3 Tasks: 9 (T031–T039)
- Setup + Foundational + Polish: 21

## Format Validation
All tasks follow: - [ ] T### optional [P] optional [US#] Description with file path.

## Independent Test Criteria Summary
- US1: Verify ordering, search matches, empty state.
- US2: Verify filters narrow results, combination with search, clear-all resets.
- US3: Verify detail fields present, submissions ordering, empty submissions state.

## Implementation Strategy
Deliver in increments:
1. Setup + foundational service layer
2. MVP list (US1) -> deploy
3. Filters (US2)
4. Detail + submissions (US3)
5. Polish (performance, accessibility, resilience)

