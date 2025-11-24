# Feature Specification: Expand Reporting MVP

**Feature Branch**: `008-expand-reporting-mvp`  
**Created**: 2025-11-18  
**Status**: Draft  
**Input**: User description: "Generating reports update. We want to expand our capability of generating reports. For the MVP lets keep only csv report generation that we have with a posibility to expand to xlsx, pdf and word documents."

## Clarifications

### Session 2025-11-18
- Q: What permission model governs access to the export action? → A: Export allowed for any user who can already view underlying data (inherits view permissions).
- Q: What is the enforced maximum row limit per CSV export? → A: 50,000 rows (hard limit) with guidance to narrow scope if exceeded.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Export current view to CSV (Priority: P1)

A user exports the data they are viewing as a CSV file from supported report screens.

**Why this priority**: CSV export delivers immediate business value by enabling offline analysis and sharing using existing workflows.

**Independent Test**: From any supported report screen, trigger CSV export and verify the correct file downloads containing the visible data.

**Acceptance Scenarios**:

1. **Given** a supported report with results visible, **When** the user selects "Export CSV", **Then** a CSV file downloads containing the data corresponding to the current view.
2. **Given** column sorting and filters applied, **When** exporting to CSV, **Then** the exported content respects the same sorting and filters.

---

### User Story 2 - Export reflects permissions (Priority: P2)

A user’s CSV export only includes data they are allowed to see.

**Why this priority**: Protects sensitive information and ensures exports align with access policies.

**Independent Test**: Compare exports from users with different access levels and verify restricted fields/rows are excluded accordingly.

**Acceptance Scenarios**:

1. **Given** a user lacking access to certain fields, **When** exporting to CSV, **Then** those fields are omitted from the export.
2. **Given** a user restricted from certain records, **When** exporting, **Then** excluded records do not appear in the CSV.

---

### User Story 3 - Large export completes reliably (Priority: P3)

A user can successfully export large datasets, or receives clear guidance if limits are exceeded.

**Why this priority**: Ensures reliability for high-volume users and sets expectations for limits.

**Independent Test**: Attempt CSV export on a large dataset near documented limits; verify completion within acceptable time or clear guidance to narrow scope.

**Acceptance Scenarios**:

1. **Given** a large report within documented limits, **When** exporting to CSV, **Then** the export completes successfully within the expected time.
2. **Given** a report exceeding documented limits, **When** exporting, **Then** the user is informed of the limit and advised on how to adjust scope (e.g., apply filters or date ranges).

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- Empty results: export produces a valid CSV containing headers and no data rows.
- Special characters: values with commas, quotes, and newlines are preserved correctly.
- Date/time: values remain unambiguous and consistent across the file; timezone application is consistent with on-screen presentation.
- Numeric formatting: leading zeros and large numbers are not altered unexpectedly in common spreadsheet apps.
- Permission changes mid-action: export reflects permissions at the moment of export initiation.
- Long-running exports: user receives clear status or feedback and no duplicate downloads occur on repeated clicks.
- Concurrent exports: multiple exports do not interfere; each file is correct and complete.

## Requirements *(mandatory)*

#### Dependencies & Assumptions

- Existing CSV export capability is available and remains accurate for current reports.
- Standard product conventions for date/time and numeric display apply consistently to exports.
- User permissions are enforced consistently across views and corresponding exports.
- Future formats (XLSX, PDF, DOCX) will be introduced in later releases without changing how users initiate an export.

### Functional Requirements

- **FR-001**: Users MUST be able to export supported reports as a CSV from the current view with a single, clearly labeled action.
- **FR-002**: CSV exports MUST reflect the user’s current filters, sorting, and selected time range.
- **FR-003**: Exports MUST include only data the user is authorized to access; restricted fields/records MUST be excluded.
- **FR-004**: The CSV MUST include clear column headers and maintain a consistent column order across exports of the same report.
- **FR-005**: If an export fails or is canceled, the user MUST receive an actionable message and a way to retry.
- **FR-006**: The system MUST enforce a maximum export limit of 50,000 rows (or earlier if a size threshold of ~25MB is reached) and inform users how to narrow scope when limits are exceeded.
- **FR-007**: For the MVP, only CSV MUST be available to end users; other formats (XLSX, PDF, DOCX) MUST NOT be visible in the user interface.
- **FR-008**: The export entry point MUST remain consistent so that adding additional formats in future releases does not change how users initiate an export.
- **FR-009**: Exports MUST include contextual metadata enabling users to understand what was exported (e.g., export time and applied filters) without exposing sensitive information.
- **FR-010**: CSV files MUST open without corruption and display correct characters and values in common spreadsheet applications.
- **FR-011**: MVP scope includes CSV export for the following reports: Companies list and Forms list. All other reports are out of scope for the MVP.
- **FR-012**: Export action MUST be available to any user with view access to the report data; no separate export permission layer is introduced in MVP.
 - **FR-013**: When an export request exceeds the 50,000 row limit (or ~25MB size threshold), the system MUST block generation and present clear guidance to refine filters (e.g., date range, company selection).

### Constitutional Requirements *(auto-checked against constitution v1.0.0)*

All features MUST comply with:
- **UX**: Simple, intuitive interfaces using NextUI components (Principle II)
- **Responsive**: Mobile-first design tested across all viewports (Principle III)
- **Validation**: Zod schemas for all user inputs, frontend and backend (Principle VII)
- **Styling**: Use fonts and colors exclusively from fontAndColour.css (Principle III, VII)
- **Testing**: Jest for backend, Cucumber for frontend (Principle VI)
- **Database**: Drizzle ORM with migrations for schema changes (Principle VII)

### Key Entities *(include if feature involves data)*

- **Report**: A named collection of data with defined columns and filters that users can view and export.
- **Export Request**: A user-initiated action to generate a file from a report in a specific format (MVP: CSV), associated with the initiating user, time, and parameters.

*Note: If feature adds database tables, migrations MUST be created using Drizzle ORM (Constitution VII)*

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 95% of CSV exports for standard reports (≤ 50,000 rows or equivalent size) complete within 15 seconds during business hours.
- **SC-002**: 0 critical data mismatches between on-screen results and exported CSV across acceptance test samples for each in-scope report.
- **SC-003**: 90% of users can successfully export a CSV on their first attempt without assistance, measured via usability testing or support ticket analysis.
- **SC-004**: Post-release, support contacts related to report exports do not increase and ideally reduce by 20% compared to the previous period.
- **SC-005**: Introducing an additional export format in a future release requires no changes to how users initiate an export, validated during an internal dry run.

