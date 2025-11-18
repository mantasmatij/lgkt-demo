# Tasks: Expand Reporting MVP

**Input**: Design documents from `/specs/008-expand-reporting-mvp/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- All tasks include specific file paths

---
## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Confirm baseline environment and add reporting feature scaffolding without changing existing stable modules.

- [X] T001 Verify existing monorepo structure (Nx) aligns with plan (no code change)
- [X] T002 Add feature docs index entry in `README.md` (link to specs/008-expand-reporting-mvp/) if missing
- [X] T003 [P] Confirm PostgreSQL connection and seed suitability for report data in `db/` (no schema changes)
- [X] T004 [P] Establish placeholder report registry module in `api/src/utils/reportRegistry.ts`
- [X] T005 [P] Create web placeholder page for reports entry in `web/src/app/reports/page.tsx`

---
## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Shared utilities, validation, and permissions alignment required before implementing stories.
**⚠️ CRITICAL**: Must complete before any user story tasks.

 - [X] T006 Implement Zod filter schemas in `api/src/services/reportFilters.schemas.ts`
 - [X] T007 [P] Implement shared permission helper leveraging existing access logic in `api/src/utils/permissions/reportPermissions.ts`
 - [X] T008 [P] Add CSV utility (UTF-8 BOM, quoting) in `api/src/utils/csvExporter.ts`
 - [X] T009 [P] Add export metadata builder (timestamp, filters, timezone) in `api/src/utils/exportMetadata.ts`
 - [X] T010 Provide row limit constant (50k) and size threshold in `api/src/utils/exportLimits.ts`
 - [X] T011 [P] Add frontend service stubs for reports in `web/src/services/reports/index.ts`
 - [X] T012 [P] Add HeroUI-based base table component for report preview in `web/src/components/reports/ReportTable.tsx`
 - [X] T013 Integrate font/colors usage in new components via `web/src/styles/` additions (if needed)
 - [X] T014 Add initial Cucumber feature scaffold for reports in `web/src/tests/features/reports/export.feature` (placeholder)
 - [X] T015 [P] Add Jest test scaffold for CSV utility in `api/src/utils/__tests__/csvExporter.spec.ts`

**Checkpoint**: Foundation ready.

---
## Phase 3: User Story 1 - Export current view to CSV (Priority: P1) 🎯 MVP
**Goal**: User can generate a preview for a supported report and export the current view as CSV reflecting filters and sorting.
**Independent Test**: Trigger preview + export for Companies list; verify headers, ordering, filters, and sorting match UI.

### Implementation
- [X] T016 [P] [US1] Add `/reports/types` route in `api/src/routes/reports.types.ts`
- [X] T017 [P] [US1] Add `/reports/filters` route in `api/src/routes/reports.filters.ts`
- [X] T018 [US1] Implement `/reports/preview` controller in `api/src/routes/reports.preview.ts` using registry & filter schemas
- [X] T019 [US1] Implement `/reports/export` controller in `api/src/routes/reports.export.ts` with row/size limit check
- [X] T020 [P] [US1] Extend report registry with definitions for companies-list & forms-list in `api/src/utils/reportRegistry.ts`
- [X] T021 [P] [US1] Add company report data adapter in `api/src/services/reportCompanies.adapter.ts`
- [X] T022 [P] [US1] Add form report data adapter in `api/src/services/reportForms.adapter.ts`
- [ ] T023 [US1] Implement frontend selection UI (report type dropdown) in `web/src/components/reports/ReportSelector.tsx`
- [ ] T024 [P] [US1] Implement filters panel (generic) in `web/src/components/reports/FiltersPanel.tsx`
- [ ] T025 [US1] Implement preview fetch hook in `web/src/services/reports/useReportPreview.ts`
- [ ] T026 [US1] Implement export action hook in `web/src/services/reports/useReportExport.ts`
- [ ] T027 [P] [US1] Integrate table with preview data in `web/src/components/reports/ReportTable.tsx`
- [ ] T028 [US1] Add metadata row inclusion logic in exporter (use exportMetadata) in `api/src/utils/csvExporter.ts`
- [ ] T029 [US1] Wire up page route to components in `web/src/app/reports/page.tsx`
- [ ] T030 [P] [US1] Add Jest tests for preview adapter logic in `api/src/services/__tests__/reportCompanies.adapter.spec.ts`
- [ ] T031 [P] [US1] Add Jest tests for export CSV generation in `api/src/utils/__tests__/csvExporter.spec.ts` (expand on scaffold)
- [ ] T032 [US1] Add Cucumber scenario: export current view in `web/src/tests/features/reports/export.feature`
- [ ] T033 [US1] Add Cucumber steps for export scenario in `web/src/tests/steps/reports/export.steps.ts`
- [ ] T034 [US1] Add row limit exceed test (mock large dataset) in `api/src/utils/__tests__/exportLimits.spec.ts`

**Checkpoint**: User Story 1 independently testable (MVP deliverable).

---
## Phase 4: User Story 2 - Export reflects permissions (Priority: P2)
**Goal**: Export excludes unauthorized fields/records automatically.
**Independent Test**: Compare exports for users with different roles; restricted fields/rows absent appropriately.

### Implementation
- [ ] T035 [P] [US2] Extend permission helper for field-level filtering in `api/src/utils/permissions/reportPermissions.ts`
- [ ] T036 [US2] Integrate permission filtering into preview adapter pipeline in `api/src/services/reportCompanies.adapter.ts`
- [ ] T037 [US2] Integrate permission filtering into forms adapter in `api/src/services/reportForms.adapter.ts`
- [ ] T038 [P] [US2] Add Jest tests for field filtering logic in `api/src/utils/permissions/__tests__/reportPermissions.spec.ts`
- [ ] T039 [P] [US2] Add Jest tests ensuring unauthorized rows excluded in `api/src/services/__tests__/reportForms.adapter.spec.ts`
- [ ] T040 [US2] Add Cucumber scenario for permission-based export differences in `web/src/tests/features/reports/permissions.feature`
- [ ] T041 [US2] Add steps for permissions scenario in `web/src/tests/steps/reports/permissions.steps.ts`
- [ ] T042 [US2] Update UI to show consistent messaging (no extra gating) in `web/src/components/reports/ReportTable.tsx`

**Checkpoint**: User Story 2 independently testable.

---
## Phase 5: User Story 3 - Large export completes reliably (Priority: P3)
**Goal**: Large exports succeed within limits or provide clear guidance when limits exceeded.
**Independent Test**: Attempt export near 50k rows; confirm completion ≤15s; exceed limit triggers guidance.

### Implementation
- [ ] T043 [P] [US3] Add size estimation utility in `api/src/utils/exportSizeEstimator.ts`
- [ ] T044 [US3] Integrate size estimation pre-check in `/reports/export` controller in `api/src/routes/reports.export.ts`
- [ ] T045 [P] [US3] Add frontend guidance banner component in `web/src/components/reports/ExportGuidance.tsx`
- [ ] T046 [US3] Implement guidance trigger on limit exceed in `web/src/services/reports/useReportExport.ts`
- [ ] T047 [P] [US3] Jest tests for size estimation logic in `api/src/utils/__tests__/exportSizeEstimator.spec.ts`
- [ ] T048 [US3] Cucumber scenario: exceed limit guidance in `web/src/tests/features/reports/limit.feature`
- [ ] T049 [US3] Steps for limit scenario in `web/src/tests/steps/reports/limit.steps.ts`
- [ ] T050 [US3] Performance measurement script (manual) in `api/src/scripts/measureExportPerformance.ts`

**Checkpoint**: User Story 3 independently testable.

---
## Phase 6: Polish & Cross-Cutting Concerns
**Purpose**: Final refinements and observability basics.

- [ ] T051 [P] Add structured logging (non-PII) for export attempts in `api/src/utils/logger.ts`
- [ ] T052 Add metrics stub (counts, durations) integration point in `api/src/routes/reports.export.ts`
- [ ] T053 [P] Refactor duplicated adapter code into shared helper in `api/src/services/reportShared.adapter.ts`
- [ ] T054 [P] Add documentation section in `quickstart.md` for performance limits
- [ ] T055 Final accessibility pass on components in `web/src/components/reports/`
- [ ] T056 Verify fontAndColour.css usage consistency site-wide (spot audit)
- [ ] T057 [P] Add README snippet for reporting feature in `web/README.md`
- [ ] T058 Performance dry run script updates in `api/src/scripts/measureExportPerformance.ts`
- [ ] T059 Security review checklist completion (permissions logic) in `specs/008-expand-reporting-mvp/checklists/requirements.md`
- [ ] T060 Final test consolidation (remove redundant Playwright tests if replaced) in `web/src/tests/`

---
## Dependencies & Execution Order

### Phase Dependencies
- Setup → Foundational → User Stories → Polish.
- User Stories can start only after Foundational complete.
- Stories (US1, US2, US3) independent; can run in parallel after foundation.

### User Story Dependencies
- US1 has no story dependencies.
- US2 depends only on foundation; optionally leverages US1 adapters but not blocked.
- US3 depends only on foundation; uses export controller from US1.

### Within Each User Story
- Parallel tasks marked [P] can proceed immediately.
- Controllers depend on adapters and utilities.
- Tests should precede implementation where feasible.

### Parallel Opportunities
- Setup placeholders (T003–T005)
- Foundational utilities (T007–T012, T015)
- Registry/adapters (T020–T022)
- Permission filtering tests (T038–T039)
- Size estimation utilities/tests (T043, T047)
- Polish logging/metrics/docs (T051, T053, T054, T057)

---
## Implementation Strategy

### MVP (User Story 1 Only)
1. Complete Setup + Foundational phases.
2. Implement US1 tasks (T016–T034) focusing on preview + export.
3. Validate with Cucumber + Jest tests; deliver CSV MVP.

### Incremental Delivery
- Add US2 for permission filtering enhancements; verify exports differ by role.
- Add US3 for large dataset handling and guidance.
- Polish for logging, metrics, accessibility.

### Parallel Team Strategy
- Dev A: Foundational utilities & US1 API routes.
- Dev B: Frontend components/hooks (US1).
- Dev C: Permission filtering (US2) once foundation ready.
- Dev D: Size estimation & guidance (US3).

---
## Summary Metrics
- Total tasks: 60
- User Story task counts: US1 (19), US2 (8), US3 (8)
- Parallel-marked tasks: 30
- Independent test criteria defined per story.
- MVP scope: Deliver through completion of US1 (Tasks T016–T034).

All tasks follow required checklist format.
