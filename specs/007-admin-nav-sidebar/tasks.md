# Tasks: Admin Navigation Sidebar

**Branch**: `007-admin-nav-sidebar`  
**Spec**: ./spec.md  
**Plan**: ./plan.md  
**Generated**: 2025-11-14

## Dependency Graph (User Stories)
1. US1 (Navigation) – foundational for discoverability
2. US2 (Language Switch) – depends on sidebar container presence (US1 infra)
3. US3 (Collapse/Expand) – can start after basic navigation skeleton (US1) but independent of language; parallel to US2 after US1

Graph:
US1 → { US2, US3 }

## Parallel Execution Opportunities Summary
- Static config vs component styling (navItems.ts and initial CSS) can proceed in parallel.
- Language switch integration (US2) can proceed while collapse state logic (US3) implemented.
- Test writing (unit/e2e) parallelizable after skeleton present.

## Phase 1: Setup
Establish minimal skeleton & environment for feature.

- [X] T001 Create `web/src/app/admin/components/AdminSidebar.tsx` skeleton component (exports placeholder)
- [X] T002 Create `web/src/app/admin/components/AdminNavItem.tsx` basic item component
- [X] T003 Add admin layout injection point `web/src/app/admin/layout.tsx` (wrap existing content with sidebar slot)
- [X] T004 Add navigation config directory `web/src/lib/navigation/` (create empty index)
- [X] T005 [P] Prepare preference helper file `web/src/lib/navigation/preference.ts` with placeholder functions
- [X] T006 Add validation schema file stub `validation/src/sidebarState.schema.ts` (Zod stub)
- [X] T007 Add OpenAPI file reference note in README section (no code change) `README.md`
- [X] T008 Initialize Playwright e2e spec placeholder `web/tests/e2e/admin_sidebar.spec.ts`
- [X] T009 Initialize unit test placeholder `web/src/app/admin/components/__tests__/AdminSidebar.test.tsx`
- [X] T010 Ensure font/color stylesheet imported where needed `web/src/app/admin/layout.tsx`

## Phase 2: Foundational (Cross-cutting prerequisites)
Provide core logic & accessibility fundamentals supporting all stories.

- [X] T011 Implement static nav items array `web/src/lib/navigation/navItems.ts` (Companies, Forms & Reports, Submissions / Exports, Settings)
- [X] T012 [P] Implement active route matching logic `web/src/lib/navigation/activeMatch.ts`
- [X] T013 Wire nav items into sidebar component `web/src/app/admin/components/AdminSidebar.tsx`
- [X] T014 Add ARIA + semantic roles (`role="navigation"`, aria-label) `web/src/app/admin/components/AdminSidebar.tsx`
- [X] T015 Implement keyboard navigation (focus order, Enter/Space activation) `web/src/app/admin/components/AdminNavItem.tsx`
- [X] T016 Add visual active state styling (Tailwind classes) `web/src/app/admin/components/AdminNavItem.tsx`
 - [X] T017 Add unified analytics instrumentation (navigation clicks, language change timing, collapse toggles, performance mark helpers) `web/src/lib/navigation/analytics.ts`
- [ ] T018 [P] Implement axe accessibility test helper `web/tests/e2e/helpers/axe.ts`
- [ ] T019 Add unit tests for navItems config `web/src/lib/navigation/__tests__/navItems.test.ts`
- [ ] T020 Update quickstart with nav items setup confirmation `specs/007-admin-nav-sidebar/quickstart.md`

## Phase 3: User Story 1 (Navigation) – Navigate Admin Sections Quickly
Goal: One-click navigation to primary destinations.
Independent Test: Sidebar renders; each link navigates correctly; active highlighting updates.

- [ ] T021 [US1] Fill nav item labels with i18n keys `web/src/lib/navigation/navItems.ts`
- [ ] T022 [US1] Add icon mapping (or text fallback) `web/src/lib/navigation/navItems.ts`
- [ ] T023 [US1] Implement navigation click handlers (client transitions) `web/src/app/admin/components/AdminNavItem.tsx`
- [ ] T024 [US1] Add route-based active state update using Next.js hooks `web/src/app/admin/components/AdminSidebar.tsx`
- [ ] T025 [US1] E2E test: navigation flows `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T026 [US1] Unit test: active state logic `web/src/app/admin/components/__tests__/AdminSidebar.test.tsx`
- [ ] T027 [US1] DEPRECATED (covered by T017 unified instrumentation) `web/src/lib/navigation/analytics.ts`
- [ ] T028 [US1] Documentation update: README admin section `README.md`

## Phase 4: User Story 2 (Language Switch) – Change Interface Language
Goal: Switch language without leaving current page.
Independent Test: Selecting language updates visible labels in current page.

- [ ] T029 [US2] Integrate language switch control inside sidebar `web/src/app/admin/components/AdminSidebar.tsx`
- [ ] T030 [US2] Create language options config `web/src/lib/navigation/languageOptions.ts`
- [ ] T031 [US2] Implement language change handler (i18n provider integration) `web/src/app/admin/components/AdminSidebar.tsx`
- [ ] T032 [US2] Add graceful fallback (retain previous language on error) `web/src/app/admin/components/AdminSidebar.tsx`
- [ ] T033 [US2] E2E test: language switch scenario `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T034 [US2] Unit test: language switch handler `web/src/app/admin/components/__tests__/AdminSidebar.test.tsx`
- [ ] T035 [US2] DEPRECATED (covered by T017 unified instrumentation) `web/src/lib/navigation/analytics.ts`
- [ ] T036 [US2] Update quickstart language section `specs/007-admin-nav-sidebar/quickstart.md`

## Phase 5: User Story 3 (Collapse / Expand Sidebar)
Goal: Adjust layout width; remember session state.
Independent Test: Toggle changes width; persists across page navigations.

- [ ] T037 [US3] Implement collapse state hook (sessionStorage + cookie) `web/src/lib/navigation/preference.ts`
- [ ] T038 [US3] Add collapse/expand toggle UI `web/src/app/admin/components/AdminSidebar.tsx`
- [ ] T039 [US3] Auto-collapse logic for narrow viewport (<480px) `web/src/app/admin/components/AdminSidebar.tsx`
- [ ] T040 [US3] Persist cookie for SSR hydration `web/src/lib/navigation/preference.ts`
- [ ] T041 [US3] Accessible aria-expanded + focus management `web/src/app/admin/components/AdminSidebar.tsx`
- [ ] T042 [US3] E2E test: collapse/expand & persistence `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T043 [US3] Unit test: preference hook behavior `web/src/lib/navigation/__tests__/preference.test.ts`
- [ ] T044 [US3] DEPRECATED (covered by T017 unified instrumentation) `web/src/lib/navigation/analytics.ts`
- [ ] T045 [US3] Update README with collapse feature notes `README.md`

## Phase 6: Optional Preference API (Future Persistence)
(Not required for MVP metrics; adds server persistence extension.)

- [ ] T046 Implement sidebar state endpoint (POST) `api/src/routes/admin/preferences.ts`
- [ ] T047 Implement language preference endpoint (POST) `api/src/routes/admin/preferences.ts`
- [ ] T048 Service logic for preferences `api/src/services/preferences.service.ts`
- [ ] T049 Zod validation schemas for preference payloads `validation/src/sidebarState.schema.ts`
- [ ] T050 Contract alignment test (OpenAPI parsing) `contracts/navigation.openapi.yaml`

## Phase 7: Polish & Cross-Cutting
Quality, performance, accessibility, and documentation finalization.

- [ ] T051 Add axe accessibility assertions to e2e `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T052 DEPRECATED (performance mark helpers consolidated in T017) `web/src/lib/navigation/analytics.ts`
- [ ] T053 Bundle size review & icon optimization `web/src/app/admin/components/AdminSidebar.tsx`
- [ ] T054 Add feature flag guard (optional) `web/src/app/admin/components/AdminSidebar.tsx`
- [ ] T055 Final success criteria validation notes `specs/007-admin-nav-sidebar/quickstart.md`
- [ ] T056 Update CHANGELOG entry for feature `CHANGELOG.md`
- [ ] T057 PR checklist referencing constitution compliance `README.md`

## Parallel Execution Examples
- Example 1: T011 (nav items array) and T012 (active match logic) in parallel before wiring.
- Example 2: T029 (language UI) parallel with T037 (collapse hook) post-US1.
- Example 3: T025 (navigation e2e) parallel with T026 (active unit test) once skeleton ready.

## MVP Scope Recommendation
Deliver MVP after completing Phase 3 (US1). Provides immediate navigation value and baseline analytics without language or collapse features. Success metric SC-001 measurable.

## Task Counts
- Setup: 10
- Foundational: 10
- US1: 8
- US2: 8
- US3: 9
- Optional API: 5
- Polish: 7
## Phase 8: Remediation & Additional Coverage (Address analysis findings)

- [ ] T058 Add e2e test: sidebar absent for non-admin user `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T059 Setup Cucumber BDD layer (feature + step config) `web/tests/bdd/sidebar/navigation.feature`
- [ ] T060 [P] Add BDD feature file for navigation scenarios `web/tests/bdd/sidebar/navigation.feature`
- [ ] T061 Add e2e test: auto-collapse on narrow viewport (<480px) `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T062 Unit test: language load failure fallback retains previous language `web/src/app/admin/components/__tests__/AdminSidebar.test.tsx`
- [ ] T063 E2E test: collapse persistence across ≥3 distinct pages `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T064 Unit test: active item has correct CSS class set `web/src/app/admin/components/__tests__/AdminSidebar.test.tsx`
- [ ] T065 Unit test: adding mock nav item (config-only) renders without component changes `web/src/lib/navigation/__tests__/navItems.test.ts`
- [ ] T066 E2E test: SSR hydration collapse state from cookie first paint `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T067 Unit test: analytics event payload schema (navigation / language / collapse / performance) `web/src/lib/navigation/__tests__/analytics.test.ts`
- [ ] T068 E2E test: keyboard focus order & escape from sidebar `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T069 Performance baseline capture script `web/scripts/perf-baseline.ts`
- [ ] T070 Performance test: click-to-paint <150ms assertion `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T071 Unit test: role-based nav item filtering hides unauthorized items `web/src/lib/navigation/__tests__/navItems.test.ts`
- [ ] T072 Unit test: sessionStorage precedence over cookie for collapse state `web/src/lib/navigation/__tests__/preference.test.ts`
- [ ] T073 Unit test: icon fallback (two uppercase letters) `web/src/lib/navigation/__tests__/navItems.test.ts`
- [ ] T074 E2E/visual test: high contrast mode rendering `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T075 Stress test: long nav list scroll containment (>20 items) `web/tests/e2e/admin_sidebar.spec.ts`
- [ ] T076 DRY check: ensure single navItems source (lint/test) `web/src/lib/navigation/__tests__/navItems.test.ts`
- [ ] T077 Documentation update clarifying deprecated analytics tasks & unified approach `README.md`
- [ ] T078 Mark Phase 6 explicitly future-only in docs `specs/007-admin-nav-sidebar/plan.md`

Revised Task Count (including remediation): 57 original - 4 deprecated + 21 added = 74 tasks

Total: 74 tasks

## Independent Test Criteria Recap
- US1: One-click navigation to destinations; active state correct.
- US2: Language change updates labels without page reload; fallback on error.
- US3: Collapse state persists across navigation; responsive auto-collapse works.

## Format Validation
All tasks follow: `- [ ] T### [P?] [US#?] Description with file path`.

## Implementation Strategy
1. Finish Setup + Foundational quickly. 
2. Ship MVP with US1 tasks. 
3. Implement US2 & US3 in parallel sprints. 
4. Add optional API endpoints only if persistence demanded. 
5. Polish phase validates metrics, a11y, and documentation before merge.

