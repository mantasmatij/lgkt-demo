---
description: "Task list for 009-form-fields-fixes feature implementation"
---

# Tasks: Page-wide Form Field & UI Fixes

Feature Dir: `specs/009-form-fields-fixes`  | Branch: `009-form-fields-fixes`

Design Docs Used: `spec.md`, `research.md`, `data-model.md`, `contracts/README.md`, `quickstart.md`

## Format
`- [ ] T### [P?] [USn] Description with file path`

`[P]` = parallelizable (different files, no ordering dependency). `[USn]` only for user story phases.

## Phase 1: Setup (Context Alignment)
Purpose: Ensure working branch, baseline dependencies, and initial audit of affected files. Minimal because repo is established.

 - [X] T001 Confirm on feature branch `009-form-fields-fixes` (git status) — no code change
 - [X] T002 Install dependencies & start dev stack (`npm install`, `npm run dev:up`) — no code change
 - [X] T003 [P] Capture baseline form markup snapshot `web/src/app/form/page.tsx` for diff-based review (noted in comments)
 - [X] T004 Inventory multiline fields & record target 10-line height requirement in inline TODO for each (measure name, planned result, reasons) in `web/src/app/form/page.tsx`

## Phase 2: Foundational (Blocking Prerequisites)
Purpose: Shared utilities required by all stories (error summary component, validation issue shaping, i18n enforcement test harness).

- [ ] T005 Create reusable error summary component `web/src/components/form/ErrorSummary.tsx` (initial stub rendering list of issues)
- [ ] T006 Implement ValidationIssue shaping helper `web/src/lib/validation/validationIssues.ts` (map Zod result → {fieldKey,message}[])
- [ ] T007 [P] Introduce central error phrasing utility `web/src/lib/validation/errorMessageFormat.ts` enforcing "Label: message" pattern
- [ ] T008 [P] Add i18n key placeholders for any new static strings in `web/src/i18n/dictionaries/en.ts` & `lt.ts`
- [ ] T009 Add unit test skeleton for error summary logic `web/tests/unit/errorSummary.spec.ts`
- [ ] T010 Add jest-axe setup file `web/tests/setup/axeSetup.ts` (configure axe for accessibility tests)
- [ ] T011 Implement localization missing-key scan script `web/scripts/check-missing-i18n.ts`
- [ ] T012 Add npm script `"i18n:check": "tsx web/scripts/check-missing-i18n.ts"` in root `package.json`
- [ ] T013 [P] Add initial accessibility test spec `web/tests/accessibility/formA11y.spec.ts` (loads form, runs axe) — failing placeholder

Checkpoint: Foundational utilities ready. User story tasks can proceed.

## Phase 3: User Story 1 – Correct & Accessible Form Fields (Priority: P1) 🎯 MVP
Goal: Accurate required indicators, clear inline + summary errors, keyboard focus order, accessible large text areas, duplicate submission prevention.
Independent Test: Submit empty form → summary (≤5 + overflow line) focuses; fix one field → its error clears; tab navigation reaches all controls; screen reader labels & required announced.

### Tests (Write First)
- [ ] T014 [P] [US1] Implement error summary unit tests (limit + overflow line) in `web/tests/unit/errorSummary.spec.ts`
- [ ] T015 [P] [US1] Add blur validation test for field error clearing `web/tests/unit/fieldBlurValidation.spec.ts`
- [ ] T016 [P] [US1] Add duplicate submit prevention test `web/tests/unit/duplicateSubmit.spec.ts`
- [ ] T017 [US1] Extend accessibility test for focus on summary after invalid submit `web/tests/accessibility/formA11y.spec.ts`

### Implementation
 - [X] T018 [US1] Refactor large multiline fields to textarea components (10 line height) in `web/src/app/form/page.tsx` and `ui/src/lib/components/MeasuresSection.tsx`
- [ ] T019 [P] [US1] Create shared `ResizableTextarea` component with Tailwind classes `min-h-[10lh]` in `web/src/components/form/ResizableTextarea.tsx`
- [ ] T020 [P] [US1] Add required indicator rendering utility `web/src/components/form/RequiredLabel.tsx`
- [ ] T021 [US1] Apply `RequiredLabel` to all required fields in `web/src/app/form/page.tsx`
- [ ] T022 [US1] Add `aria-required="true"` and `id/for` associations for fields in `web/src/app/form/page.tsx`
- [ ] T023 [US1] Implement error summary limit + overflow line logic in `ErrorSummary.tsx`
- [ ] T024 [US1] Add focus management on submit failure (`ref` + `tabIndex=-1` + `.focus()`) in `ErrorSummary.tsx`
- [ ] T025 [US1] Implement inline blur validation (remove error when valid) in `web/src/app/form/page.tsx`
- [ ] T026 [US1] Introduce central form state for validation issues using React state hook in `web/src/app/form/page.tsx`
- [ ] T027 [US1] Implement duplicate submission guard (disable button & ignore while pending) in `web/src/app/form/page.tsx`
- [ ] T028 [P] [US1] Ensure keyboard order matches visual order (reorder tabIndex if needed) in `web/src/app/form/page.tsx`
- [ ] T029 [P] [US1] Localize any newly added error summary static strings `en.ts` & `lt.ts`
- [ ] T030 [US1] Update accessibility test expectations (axe no violations for required indicators) in `formA11y.spec.ts`

Checkpoint: User Story 1 independently testable (MVP). Stop & validate before moving on.

## Phase 4: User Story 2 – Consistent Field Presentation & Layout (Priority: P2)
Goal: Consistent spacing, alignment, min-width standards, responsive layout without horizontal scroll.
Independent Test: At breakpoints (320, 768, 1024) layout shows no overflow, consistent spacing & alignment.

### Tests
- [ ] T031 [P] [US2] Add responsive layout visual regression test placeholder `web/tests/visual/layoutConsistency.spec.ts`

### Implementation
- [ ] T032 [US2] Introduce shared spacing tokens (utility classes or config) applied in `web/src/app/form/page.tsx`
- [ ] T033 [P] [US2] Apply consistent min width to select components (update shared select) in `web/src/components/ui/AppSelect.tsx`
- [ ] T034 [P] [US2] Standardize button alignment (primary action) in `web/src/app/form/page.tsx`
- [ ] T035 [US2] Fix vertical rhythm (consistent margin between sections) in `web/src/app/form/page.tsx`
- [ ] T036 [US2] Ensure no horizontal scroll at 320px (adjust containers) in `web/src/app/form/page.tsx`
- [ ] T037 [P] [US2] Add Tailwind responsive classes for text areas & selects in `ResizableTextarea.tsx` / `AppSelect.tsx`

Checkpoint: Layout improvements validated; independent of US1 logic.

## Phase 5: User Story 3 – Unified Validation & Feedback Patterns (Priority: P3)
Goal: Consistent phrasing, styling, placement; clearing only affected field.
Independent Test: Trigger multi-section errors; messages share pattern; fixing one removes only that message; summary updates.

### Tests
- [ ] T038 [P] [US3] Add phrasing format tests for errorMessageFormat utility `web/tests/unit/errorMessageFormat.spec.ts`
- [ ] T039 [P] [US3] Add dynamic list row error association test `web/tests/unit/dynamicRowValidation.spec.ts`

### Implementation
- [ ] T040 [US3] Apply errorMessageFormat utility across all inline error renderers in `web/src/app/form/page.tsx`
- [ ] T041 [P] [US3] Refactor dynamic list sections (organs/measures) to include fieldKey stable ids in `web/src/app/form/page.tsx`
- [ ] T042 [P] [US3] Ensure summary deduplicates by fieldKey (update `ErrorSummary.tsx`)
- [ ] T043 [US3] Style inline errors consistently (Tailwind classes) in `web/src/app/form/page.tsx`
- [ ] T044 [US3] Update summary rendering to use unified phrasing pattern in `ErrorSummary.tsx`

Checkpoint: Validation consistency achieved; independent tests pass.

## Phase 6: User Story 4 – Internationalization Completion & Alignment (Priority: P4)
Goal: 100% localization coverage for new/changed strings; enforce via script/test.
Independent Test: Switch locale; no untranslated or raw keys appear; i18n scan returns zero misses.

### Tests
- [ ] T045 [P] [US4] Implement localization scan test `web/tests/unit/i18nScan.spec.ts` invoking `i18n:check`

### Implementation
- [ ] T046 [US4] Finalize new i18n keys & translations in `en.ts` & `lt.ts`
- [ ] T047 [P] [US4] Replace any hardcoded strings introduced earlier with `t()` calls in `web/src/app/form/page.tsx`
- [ ] T048 [US4] Adjust error messages to ensure localization (pull from dictionaries) in `errorMessageFormat.ts`
- [ ] T049 [US4] Verify locale toggle maintains focus states & error summary translation in `ErrorSummary.tsx`

Checkpoint: Localization completeness validated.

## Phase 7: Polish & Cross-Cutting Concerns
Purpose: Final refinements, performance, documentation, accessibility audits, cleanup.

- [ ] T050 [P] Update feature README or add summary section to `spec.md` referencing success criteria progress
- [ ] T051 [P] Run full accessibility audit & address minor warnings (focus outline tweaks) in related components
- [ ] T052 Refactor duplicated form logic into helper functions `web/src/lib/form/helpers.ts`
- [ ] T053 [P] Add additional Jest coverage thresholds configuration in `web/jest.config.ts`
- [ ] T054 Remove temporary TODO comments & obsolete snapshots across modified files
- [ ] T055 Final manual QA against quickstart checklist (no code change)
- [ ] T056 Prepare PR description summarizing completed user stories and success metrics

## Dependencies & Execution Order

Phase Dependencies:
- Setup → Foundational → User Stories (1..4 in priority) → Polish.
- User Stories after Foundational can proceed sequentially or partially parallel (avoid editing same file concurrently).

User Story Independence:
- US1 provides base functional accessibility; US2 layout changes mostly additive; US3 rewrites messaging; US4 localization ensures coverage — each testable independently once foundational utilities exist.

Within Story Ordering:
- Tests first (fail), then implementation tasks.
- Parallel tasks `[P]` can run together (different files).

## Parallel Opportunities
- Foundational: T007, T008, T010, T013 can run together.
- US1: T014–T016 tests, T019–T020 components, T028–T029 attribute/localization adjustments.
- US2: T033, T037 width & responsive tasks parallel.
- US3: T041–T042 dedupe + dynamic ids.
- US4: T047–T048 replacements & error message localization.
- Polish: T050, T051, T053 parallel.

## Implementation Strategy
MVP = Complete US1 (accessibility & correctness). Validate with automated + manual tests before proceeding.
Incremental delivery: Merge after each story if stakeholder prefers shorter review cycles.

## Task Counts & Summary
- Total Tasks: 56
- US1 Tasks: 17 (Tests 4 + Impl 13)
- US2 Tasks: 7
- US3 Tasks: 9
- US4 Tasks: 5
- Polish Tasks: 7
- Foundational Tasks: 9
- Setup Tasks: 4
Parallelizable Tasks (marked [P]): 23
MVP Scope: Phase 3 (US1) only.
Independent Test Criteria Provided per User Story: Yes.
Checklist Format Validation: All tasks follow `- [ ] T### [P?] [USn?] Description with file path`.

## Notes
Do not begin User Story phases until Foundational checkpoint reached. Keep commits small (1–3 tasks). Update tasks.md marking tasks `[X]` as completed when done.
