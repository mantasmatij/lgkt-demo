# Feature Specification: Company Form Updates

**Feature Branch**: `004-update-company-form`  
**Created**: 2025-10-31  
**Status**: Draft  
**Input**: User description summarized: Update the company form by removing the Country field and the Contact & Other section; add a new Company Type enum with three options (Listed company, State-owned company, Large company) with Lithuanian translations; add a new text field as item 12; restrict all date inputs to years ≥ 1990; and regroup layout so most inputs are single-line as per provided pseudo-layout.

## Clarifications

### Session 2025-10-31

- Q: How should removed fields appear in the submission payload? → A: Keep keys with null/empty values (preserve schema; no UI inputs visible).
- Q: When is the new Section 12 "reasons" text required? → A: Always required.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit updated company form (Priority: P1)

A company representative completes the updated company form, selecting a Company Type, providing all required information, entering dates (1990 or later), and submits successfully.

**Why this priority**: This is the core value of the feature—successful completion and submission of the form with the updated fields and constraints.

**Independent Test**: Using a fresh form, complete all visible fields including the new Company Type and the new text field (12), respect date limits, and submit; expect success confirmation and correct data in the submission payload.

**Acceptance Scenarios**:

1. Given the form is opened, When the user selects a Company Type and fills all required fields, Then the form submits successfully and the selection is included in the payload.
2. Given all date inputs enforce a minimum year of 1990, When a user picks any date earlier than 1990, Then validation blocks submission and shows a clear error next to the offending field.

---

### User Story 2 - Localized option labels (Priority: P2)

The user sees Company Type option labels in the selected language (Lithuanian/English) while the underlying selection remains consistent.

**Why this priority**: Ensures clarity and correctness for bilingual users and stakeholders.

**Independent Test**: Toggle the interface language and verify the three Company Type options display as translated labels without changing the underlying chosen value.

**Acceptance Scenarios**:

1. Given the UI is in Lithuanian, When opening the Company Type dropdown, Then options display as Biržinė įmonė, Valstybės valdoma įmonė, Didelė įmonė.
2. Given the UI is in English, When opening the Company Type dropdown, Then options display as Listed company, State-owned company, Large company.

---

### User Story 3 - Simplified layout (Priority: P3)

Most inputs appear in a single-line grouping as described, improving scannability while keeping all existing semantics (required/optional) unchanged.

**Why this priority**: Improves usability and reduces completion time without altering business rules.

**Independent Test**: On desktop viewport, visually verify single-line groupings per the pseudo-layout; on smaller screens, verify responsive stacking without loss of fields.

**Acceptance Scenarios**:

1. Given a desktop-width viewport, When the form is rendered, Then sections 1.1–1.3 are presented as labeled inputs arranged per the pseudo-layout.
2. Given a mobile-width viewport, When the form is rendered, Then inputs stack vertically with labels preserved and no overlap/truncation.

---

### Edge Cases

- If From > To in the report submission period, validation must block submission with a clear message.
- For gender balance counts, the Total must equal Women + Men; otherwise, validation blocks submission with guidance.
- If no governing body exists, zeros are accepted for the relevant counts and totals.
- File attachment is optional; empty file list must not block submission.
- Link field is optional; if provided, it must be a valid URL format.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Remove the Country field from the company form UI; it must not be visible to users.
- **FR-002**: Remove the Contact & Other section from the company form UI; it must not be visible to users.
- **FR-003**: Add a new field “Company Type” as a single-select enum with exactly three options displayed per current UI language: English (Listed company, State-owned company, Large company) and Lithuanian (Biržinė įmonė, Valstybės valdoma įmonė, Didelė įmonė).
- **FR-004**: The “Company Type” selection must be captured and included in the submitted payload as a stable, language-independent value with a deterministic mapping to the displayed labels.
- **FR-005**: Add a new text input for section 12 as described: reasons for underrepresentation; label must display bilingual text per the pseudo-layout.
- **FR-006**: All date inputs in the form must restrict selection to dates on or after 1990-01-01; attempts to select earlier dates must be prevented or clearly validated.
- **FR-007**: The Report submission period must enforce From ≤ To; if violated, show a specific validation message for the offending field(s).
- **FR-008**: Maintain the existing “Governance Organs” interactions and logic unchanged, aside from applying the date constraint in FR-006 where applicable.
- **FR-009**: Retain current behavior for the requirements/criteria radio input (Applied / Not applied) and link + optional file upload, ensuring they continue to work as before.
- **FR-010**: For gender balance subsections (8.1–8.3), validate that Total equals Women + Men for each subsection; show inline error if inconsistent.
- **FR-011**: Implement layout regrouping so that, on desktop viewports, most inputs appear as single-line groupings aligned to the pseudo-layout, with labels clearly associated with their inputs.
- **FR-012**: On small/mobile viewports, inputs may stack vertically while preserving labels, required indicators, and usability.
- **FR-013**: Required fields must remain required and be clearly indicated; optional fields must not block submission when empty.
- **FR-014**: The example link for measures (section 11) must remain visible and clickable, labeled as described in both languages.
- **FR-015**: The confirmation checkbox (“I confirm that the information provided is correct”) must remain required to submit.

- **FR-016**: For removed fields (Country; Contact & Other), the submission payload MUST retain their keys with null/empty values for backward compatibility; these inputs are not shown in the UI.
- **FR-017**: Section 12 "reasons" text is ALWAYS required for submission, regardless of underrepresentation counts in section 8.

### Assumptions & Dependencies

- The feature is UI- and validation-focused; no new backend data structures are required beyond including the Company Type selection and section 12 text in the submission payload.
- A stable, language-independent value will represent the Company Type in the payload, with a deterministic mapping to localized labels (Lithuanian/English).
- Layout changes are responsive: single-line groupings on desktop; vertical stacking on small/mobile viewports.
- Existing business rules (required vs optional fields, governance organ logic, link and file behaviors) remain unchanged unless explicitly specified above.
 - Removed fields will not be visible in the UI; payload retains their keys with null/empty values per FR-016.

### Constitutional Requirements *(auto-checked against constitution v1.0.0)*

All features MUST comply with:
- **UX**: Simple, intuitive interfaces using HeroUI components (Principle II)
- **Responsive**: Mobile-first design tested across all viewports (Principle III)
- **Validation**: Zod schemas for all user inputs, frontend and backend (Principle VII)
- **Styling**: Use fonts and colors exclusively from fontAndColour.css (Principle III, VII)
- **Testing**: Jest for backend, Cucumber for frontend (Principle VI)
- **Database**: Drizzle ORM with migrations for schema changes (Principle VII)

### Key Entities *(include if feature involves data)*

- **Company Submission**: Captures company data for the annual submission. Key attributes in scope of this feature include: Company name, Company code, Company Type (stable value mapped to localized labels), Legal form, Address, Registry, eDelivery address, Report period (From, To), Governance Organs dates and selections, Gender balance counts (Women, Men, Total per subsection), Requirements/criteria radio choice, Optional link and files, Measures (names, results, indicators, units, years), Section 12 reasons text, Confirmation checkbox, and Submitter info (name, position, phone, email).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of users can complete and submit the updated form within 12 minutes on first attempt.
- **SC-002**: 100% of date selections earlier than 1990 are prevented or blocked with clear validation before submission.
- **SC-003**: 0 submission payloads include non-empty values for removed fields (Country; Contact & Other); payload keys are present with null/empty values.
- **SC-004**: 95% of users report that Company Type options are clear and correctly translated in the selected language.
- **SC-005**: On desktop, form layout renders without horizontal scroll and with correct single-line groupings for the sections specified, across the last two major versions of common browsers.


