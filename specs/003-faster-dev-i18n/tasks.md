# Tasks: Faster Dev Feedback and LT/EN i18n

**Input**: Design documents from `/specs/003-faster-dev-i18n/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare local dev paths and common scaffolding for i18n

- [ ] T001 Add feature docs to README pointers (root README.md → link to specs/003-faster-dev-i18n/quickstart.md)
- [ ] T002 [P] Ensure Node 20+ and Nx available (document in specs/003-faster-dev-i18n/quickstart.md)
- [ ] T003 [P] Verify Postgres container healthcheck works for local DB in docker/docker-compose.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 [P] Create i18n translation sources for UI at web/src/lib/i18n/{lt.ts,en.ts}
- [x] T005 [P] Wire locale-aware formatting helpers at web/src/lib/i18n/format.ts
- [x] T006 [P] Add i18n provider to Next app tree at web/src/app/providers/i18n-provider.tsx
- [x] T007 [P] Create API i18n session middleware at api/src/middleware/i18n.ts
- [x] T008 [P] Expose session-based i18n endpoints (OpenAPI) at api/src/routes/i18n.ts (map to specs/003-faster-dev-i18n/contracts/openapi.yaml)
- [x] T009 Ensure fontAndColour.css is applied in both locales without visual regressions (web/src/styles/globals.css references fontAndColour.css)
- [x] T010 Create missing-translation logging (non-production) at web/src/lib/i18n/missing.ts and api/src/utils/i18nMissing.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Use the site in Lithuanian or English (Priority: P1) 🎯 MVP

**Goal**: Bilingual UI with default Lithuanian and a language switcher on every page; no URL locale prefixes

**Independent Test**: On a fresh session, confirm default language is Lithuanian; toggle language; verify full page text switches without errors.

### Tests for User Story 1 (Required by Constitution VI)

- [ ] T029 [P] [US1] Cucumber feature for language toggle at web/tests/features/language_toggle.feature
- [ ] T030 [P] [US1] Step definitions for toggle at web/tests/step_definitions/language_toggle.steps.ts
- [x] T038 [P] [US1] Playwright i18n consistency on key routes (LT/EN) at web/tests/e2e/i18n_consistency.spec.ts

### Implementation for User Story 1

- [x] T011 [P] [US1] Build language switcher component at web/src/app/components/LanguageSwitcher.tsx
- [x] T012 [P] [US1] Integrate provider and switcher in shared layout at web/src/app/layout.tsx
- [x] T013 [P] [US1] Replace hardcoded strings with i18n keys in top-level navigation at web/src/app/(site)/_nav.tsx
- [x] T014 [P] [US1] Migrate provided field labels to i18n keys at web/src/lib/i18n/{lt.ts,en.ts} using specs/003-faster-dev-i18n/contracts/translations/fields.md
- [x] T015 [US1] Ensure deep-linked pages preserve chosen language without URL prefix at web/src/app/(site)/**/page.tsx
- [x] T037 [P] [US1] Inventory top 10 journeys and migrate remaining UI strings to i18n (enable missing-key logging) across web/src/app/** and web/src/components/**

**Checkpoint**: US1 independently demonstrable (switcher present; default LT; pages toggle LT/EN)

---

## Phase 4: User Story 2 - Remember my language (Priority: P2)

**Goal**: Persist selected language in session; returning users on the same device see their last chosen language without re-selecting.

**Independent Test**: Set language, close and reopen the browser; verify the site opens in the previously chosen language on that same device.

### Tests for User Story 2 (Required by Constitution VI)

- [x] T031 [P] [US2] Jest unit tests for /i18n/locale handlers at api/src/routes/__tests__/i18n.locale.spec.ts
- [ ] T032 [P] [US2] Cucumber scenario for session persistence at web/tests/features/session_locale.feature
- [ ] T033 [P] [US2] Step definitions for session persistence at web/tests/step_definitions/session_locale.steps.ts

### Implementation for User Story 2

- [x] T016 [P] [US2] Implement GET /i18n/locale handler at api/src/routes/i18n.ts (reads session.language)
- [x] T017 [P] [US2] Implement POST /i18n/locale handler at api/src/routes/i18n.ts (sets session.language)
- [x] T018 [P] [US2] Update Next app client to fetch initial language from API on app bootstrap at web/src/app/providers/i18n-provider.tsx
- [x] T019 [US2] Persist on toggle: call POST /i18n/locale from LanguageSwitcher at web/src/app/components/LanguageSwitcher.tsx

**Checkpoint**: US2 independently demonstrable (preference retained within same session model; re-opens with previous choice when session persists)

---

## Phase 5: User Story 3 - Quick preview of changes (Priority: P3)

**Goal**: Enable a dev path where text/style changes are visible within 30 seconds without waiting for full Docker builds.

**Independent Test**: Start local services; edit a visible string; confirm changes appear in the browser within 30 seconds (p90).

### Tests for User Story 3 (Documentation Validation)

- [ ] T034 [P] [US3] Playwright smoke: start local dev (documented), assert homepage responds and basic text visible at web/tests/e2e/dev_quickstart.spec.ts

### Implementation for User Story 3

- [ ] T020 [P] [US3] Document local dev flow (no Docker) in specs/003-faster-dev-i18n/quickstart.md
- [ ] T021 [P] [US3] Add optional docker-compose.override.yml example with bind mounts at docker/docker-compose.override.yml (commented template)
- [ ] T022 [P] [US3] Add convenience npm scripts: root package.json → "dev:api-local" (nx serve api), "dev:web-local" (next dev)
- [ ] T023 [US3] Validate feedback loop p90 < 30s with a manual stopwatch note in specs/003-faster-dev-i18n/quickstart.md

**Checkpoint**: US3 independently demonstrable (fast feedback via local dev; optional Docker override available)

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T024 [P] Localize one transactional email template at api/src/templates/email/accountNotice.html and accountNotice.lt.html
- [ ] T025 [P] Localize one standard PDF/export at api/src/services/pdf/templates/standard.hbs and standard.lt.hbs; generator at api/src/services/pdf/generator.ts
- [ ] T026 [P] Ensure locale-aware date/number formatting used consistently across UI forms at web/src/lib/i18n/format.ts
- [ ] T027 Update specs/003-faster-dev-i18n/quickstart.md with final run instructions and troubleshooting
- [ ] T028 Perform visual checks on mobile and desktop for long Lithuanian strings (no overflow) across top pages
- [ ] T035 Add a11y checks for LanguageSwitcher (aria-labels, focus order, roles) at web/tests/a11y/switcher.a11y.spec.ts
- [ ] T036 Harden POST /i18n/locale with CSRF check and document secrets handling guidelines in specs/003-faster-dev-i18n/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies
- Setup (Phase 1): No dependencies
- Foundational (Phase 2): Blocks all user stories
- User Stories (Phase 3+): Each can proceed after Phase 2; deliver in priority order if solo
- Polish: After user stories as needed

### User Story Dependencies
- US1 → none (after Phase 2)
- US2 → depends on Phase 2; independent of US1 but integrates with its switcher
- US3 → depends on Phase 2; independent of US1/US2

### Parallel Opportunities
- T004–T010 can run in parallel (different files)
- US1 tasks T011–T015 mostly parallel (separate files)
- US2 tasks T016–T018 parallel; T019 depends on T016–T018
- US3 tasks T020–T022 parallel; T023 last
- Polish T024–T028 largely parallel (different assets)

---

## Implementation Strategy

### MVP First (US1)
1) Complete Phase 1 & 2
2) Implement US1 (T011–T015)
3) Demo bilingual UI with switcher

### Incremental Delivery
1) Add US2 (session persistence)
2) Add US3 (fast dev loop docs + scripts)
3) Localize one email and one PDF in Polish phase

