# Research: Expand Reporting MVP

Created: 2025-11-18
Branch: 008-expand-reporting-mvp

## Unknowns and Decisions

### 1) Frontend testing framework alignment
- Decision: Adopt Cucumber for new frontend BDD scenarios for reporting flows, while keeping existing Playwright tests until migration plan is defined.
- Rationale: Constitution mandates Cucumber; phased adoption minimizes disruption.
- Alternatives considered: Continue only with Playwright (violates constitution); Cypress+Cucumber (adds dependencies).

### 2) CSV encoding and spreadsheet compatibility
- Decision: Use UTF-8 with BOM for CSV downloads to maximize compatibility with spreadsheet apps.
- Rationale: Prevents mojibake and preserves non-ASCII characters.
- Alternatives considered: UTF-8 without BOM (Excel issues), ISO-8859-1 (lossy for non-Latin).

### 3) File naming convention
- Decision: `<report-type>_<yyyy-mm-ddThhmmssZ>_<scope>.csv` (UTC timestamp); avoid PII in filenames.
- Rationale: Deterministic, sortable, safe for sharing.
- Alternatives considered: Local time in name (ambiguous), human readable spaces (spaces problematic for automation).

### 4) Row/size limits and execution strategy
- Decision: Synchronous generation up to ~50k rows or 25MB, otherwise instruct user to narrow filters per MVP.
- Rationale: Meets SC-001 performance goal and simplifies MVP; async queue can be added later.
- Alternatives considered: Background jobs (adds infra complexity for MVP), streaming downloads (can be evaluated later).

### 5) Timezone handling for date fields
- Decision: Display/export dates in the same timezone as shown in the UI (current product convention); include export timestamp and timezone note in metadata row (non-sensitive).
- Rationale: Consistency with UI prevents confusion.
- Alternatives considered: Force UTC (user confusion), per-user timezone override (scope increase).

### 6) "All fields present" definition for dynamic forms
- Decision: Export includes all defined fields for the relevant form schema at the time of submission; empty values appear as empty cells.
- Rationale: Guarantees column completeness without data loss; stable column order per form/report.
- Alternatives considered: Only visible fields (ambiguous), omit empty fields (breaks analytics).

### 7) MVP scope reconciliation (spec vs. user flow)
- Decision: MVP export endpoints and UI will support Companies list and Forms list reports (as per FR-011). The “Company report” and “Date range report” flows will be captured in design for forward compatibility, but only wired where they overlap with Companies/Forms list pages.
- Rationale: Honor approved MVP scope while incorporating UX flow that won’t require rework later.
- Alternatives considered: Expand MVP scope now (schedule risk), ignore user flow details (rework risk later).

## Best Practices & Patterns

- Use centralized report definition registry to map report type → columns, filters, permissions.
- Build a single export controller that normalizes dataset to CSV with consistent headers and metadata.
- Validate all filter inputs with Zod on both client and server.
- Log export attempts (non-PII) with parameters and result status for supportability.

## Consolidated Decisions (TL;DR)
- CSV: UTF-8+BOM, stable column order, metadata row, UTC timestamp in filename.
- Limits: Up to ~50k rows/25MB sync; otherwise guide user to narrow scope.
- Timezone: Match UI timezone; include timestamp + TZ note.
- Testing: Add Cucumber scenarios for key flows; keep Playwright temporarily.
- Scope: Implement Companies list and Forms list; design flows allow extension to Company/date-range reports later.
