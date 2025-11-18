# Implementation Plan: Expand Reporting MVP

**Branch**: `008-expand-reporting-mvp` | **Date**: 2025-11-18 | **Spec**: `/Users/mantas.matijosaitis/repos/lgkt-forma/specs/008-expand-reporting-mvp/spec.md`
**Input**: Feature specification from `/specs/008-expand-reporting-mvp/spec.md`

**Note**: Filled by `/speckit.plan` following `.specify/templates/commands/plan.md` workflow.

## Summary

Primary requirement: Enable users to generate reports via a simple flow (select report type, apply filters, generate table view, and download). MVP supports CSV export only. MVP report scope: Companies list and Forms list; user-provided flows also specify a “Company report” view and date-range reports with granularity and current filters. All exports must include all fields visible for the dataset and respect permissions, filters, and sorting.

Approach (high level):
- Provide unified “Generate report” entry with report type selection and context-specific filters.
- Render a preview table honoring applied filters/sorting, with a Download CSV action.
- Reuse existing CSV generation capability while codifying consistent column headers, metadata, and limits.
- Design for future additional formats (XLSX, PDF, DOCX) without changing the export entry point.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (ES2022), Node 20+
**Primary Dependencies**: Next.js (web), Express (API), Drizzle ORM, Zod, HeroUI, Tailwind CSS
**Storage**: PostgreSQL (existing db package, migrations via Drizzle)
**Testing**: Jest (backend), Cucumber (frontend, per constitution) [NEEDS CLARIFICATION: current frontend tests use Playwright; confirm Cucumber adoption path]
**Target Platform**: Web (Next.js app + Express API)
**Project Type**: Nx monorepo with `api/`, `web/`, `db/`, shared packages
**Performance Goals**: CSV export ≤ 15s for standard datasets (≤ 50k rows) as per spec success criteria
**Constraints**: Respect permission filtering; consistent column order and headers; avoid UI changes when adding formats
**Scale/Scope**: MVP covers Companies list and Forms list reports; user flows also describe Company-specific and date-range reports with existing filters [NEEDS CLARIFICATION: align MVP UI flows with agreed scope]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with LGKT Forma Constitution v1.0.0:

- [x] **I. Clean Code Excellence**: Plan favors reusable report/export utilities
- [x] **II. Simple & Intuitive UX**: Uses consistent report-type selection and single export entry; HeroUI per constitution
- [x] **III. Responsive Design First**: Preview table and controls designed mobile-first
- [x] **IV. DRY**: Shared export formatting and metadata utilities extracted
- [x] **V. Minimal Dependencies**: Reuse existing CSV capability; defer new libs
- [ ] **VI. Comprehensive Testing**: Jest for API; Cucumber for frontend [NEEDS CLARIFICATION: migrate from current Playwright]
- [x] **VII. Technology Stack Compliance**: 
  - [x] Uses Nx monorepo structure
  - [x] TypeScript for all code
  - [x] Express for backend
  - [x] Drizzle ORM with migrations for database (PostgreSQL)
  - [x] Zod for validation (frontend + backend)
  - [x] HeroUI for UI components (NextUI deprecated in constitution)
  - [x] fontAndColour.css for styling

*If any gate fails, document justification in Complexity Tracking section below.*

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Monorepo with `api/` (Express routes/controllers), `web/` (Next.js pages/app, components), `db/` (Drizzle ORM & migrations), shared `contracts/` package. Feature touches `web` (report screens, export button), `api` (export endpoints), and reuses `db` queries. Documentation artifacts live under `specs/008-expand-reporting-mvp/`.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

No violations requiring justification at this time. One testing alignment item remains (Cucumber adoption path for frontend tests).

