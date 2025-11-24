# Feature Specification: Page-wide Form Field & UI Fixes

**Feature Branch**: `009-form-fields-fixes`  
**Created**: 2025-11-24  
**Status**: Draft  
**Input**: User description: "Page wide fixes. We want some fixes made to the page. This part will be done while testing live, sugesting fixes and implementing them. This will be done when I say 'We Are Done'. First we need to fix form fields, then we will go on other fixes"

## Summary (Context & Purpose)
The goal is to iteratively improve the public-facing form page and related UI elements across the site, starting with correctness, clarity, accessibility, and consistency of form fields. After form fields are fixed, broader page-wide improvements (layout, spacing, responsiveness, consistency of interactive controls) will be addressed live while testing until the stakeholder signals completion ("We Are Done").

Primary focus initial phase: Fix broken / confusing form fields (labels, ordering, required indicators, validation feedback, keyboard accessibility, mobile layout). Subsequent phase: apply page-wide UX polish (spacing rhythm, visual alignment, consistent component variants, focus states, translation coverage).

The work proceeds incrementally; each user story below is independently testable and provides a visible improvement without needing later stories.

## Scope
INCLUDES: Public submission form page (currently `web/src/app/form/page.tsx`), shared form UI components, validation messages, accessibility semantics (aria, focus management), internationalization coverage for new/updated labels, layout and spacing adjustments, visual consistency (button styles, select widths), and minor usability improvements site-wide that stem from the form fixes (e.g. shared select or input components used elsewhere).

EXCLUDES: Backend data model changes (unless a field is truly incorrect or missing and requires schema alignment), new business features (e.g., new sections), performance optimizations beyond obvious layout improvements, unrelated admin-only features. No introduction of new third-party UI libraries.

## Assumptions
1. The "page" primarily refers to the public form page; secondary fixes can extend to other pages only when component-level changes ripple through.
2. Validation schema already exists (Zod); adjustments stay within existing schema boundaries unless a clear business rule mismatch is discovered.
3. Accessibility baseline: WCAG 2.1 AA targets (focus visible, labels associated, error identification, keyboard navigation).
4. Live iterative testing will happen in a dev/staging environment before sign-off.
5. No major rebrand; existing design tokens (fontAndColour.css, Tailwind config) remain.

## Out of Scope
- Adding new persistence fields unrelated to existing form content.
- Large redesign of navigation or information architecture.
- Export/reporting functionality (already handled in prior feature).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Correct & Accessible Form Fields (Priority: P1)
As a public user filling out the company submission form, I can understand each field's purpose, required status, and receive clear inline + summary validation feedback, with proper keyboard navigation and focus management.

**Why this priority**: This is the core data collection interface; clarity and correctness directly affect submission success and reduce support overhead.

**Independent Test**: Load form with no data; attempt submit; observe structured error summary and inline messages; navigate using keyboard-only; all interactive elements reachable with visible focus; screen reader announces labels and errors.

**Acceptance Scenarios**:
1. **Given** a fresh form, **When** I submit empty, **Then** I see an error summary listing top issues and each required field shows an inline error.
2. **Given** focus on a field with error, **When** I correct the value, **Then** inline error disappears without requiring full form resubmission.
3. **Given** I use only Tab/Shift+Tab, **When** I traverse the form, **Then** I can reach all inputs, selects, radios, checkboxes, and action buttons in logical order.
4. **Given** a screen reader user, **When** errors occur, **Then** the error summary heading receives programmatic focus and is announced.
5. **Given** a required field, **When** I inspect its label, **Then** required status is visually and programmatically indicated (aria-required or similar).

---

### User Story 2 - Consistent Field Presentation & Layout (Priority: P2)
As a user on mobile or desktop I see consistent spacing, alignment, and sizing (especially selects, buttons, section headers), improving readability and reducing mis-clicks.

**Why this priority**: Layout polish improves efficiency and perceived quality, decreasing friction and abandonment after core correctness is ensured.

**Independent Test**: Resize viewport to common breakpoints (320px, 768px, 1024px); measure spacing between section blocks, label alignment, consistent min-width for critical selects; no horizontal scroll; sections visually separated.

**Acceptance Scenarios**:
1. **Given** a mobile viewport < 400px, **When** form renders, **Then** no horizontal scrolling appears, and selects wrap naturally with readable labels.
2. **Given** desktop width ≥ 1024px, **When** form renders, **Then** primary action button aligns consistently to the right and section headings maintain uniform vertical spacing.
3. **Given** a select trigger, **When** I compare across different select instances, **Then** consistent min width rules apply (avoids overly narrow truncation).

---

### User Story 3 - Unified Validation & Feedback Patterns (Priority: P3)
As a user encountering validation issues across different sections (organs, measures, attachments), I receive consistent phrasing, styling, and placement of error messages and they clear uniformly when fixed.

**Why this priority**: Uniform messaging reduces cognitive load; inconsistent patterns lead to confusion about whether errors persist.

**Independent Test**: Trigger validation errors in multiple sections; verify message formatting (prefix, color, capitalization) consistent; fix one error—only its message disappears; summary updates appropriately.

**Acceptance Scenarios**:
1. **Given** errors in multiple sections, **When** I view the summary, **Then** phrasing follows a consistent pattern (e.g., "Field X is required").
2. **Given** I correct an error inside a repeated section row, **When** I blur the input, **Then** only that error clears and summary does not list it anymore.

---

### User Story 4 - Internationalization Completion & Alignment (Priority: P4)
As a Lithuanian or English-speaking user, all labels, error messages, helper texts introduced or changed by the fixes are translated; no fallback English appears except intentional technical terms.

**Why this priority**: Ensures usability and trust for primary language audience; prevents partial localization regressions.

**Independent Test**: Toggle locale; inspect updated fields, buttons, error summary; confirm all dynamic and static texts match dictionary entries; missing keys cause explicit test failure.

**Acceptance Scenarios**:
1. **Given** LT locale active, **When** form loads, **Then** all form labels and error messages display in LT with no raw key names.
2. **Given** EN locale active, **When** I submit invalid data, **Then** error summary heading and inline messages appear in English consistently.

---

### Edge Cases
- Very long company name exceeds typical length: label wraps without overlapping adjacent controls.
- Rapid submission clicks while validation running: second click ignored until first completes; no duplicate POST.
- Browser autofill inserts unexpected values: required indicators still reflect completion; validation re-check occurs on submit.
- User disables JavaScript: user sees an upgrade message stating JavaScript is required; form inputs disabled; no submission fallback.
- Extremely slow network on submission: loading state persists with accessible status text; user can cancel by navigating away.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST present required field indicators consistently (visual + accessible programmatic cue).
- **FR-002**: System MUST provide an error summary section listing up to first N (configurable, default 5) distinct field errors.
- **FR-003**: Inline errors MUST clear immediately after the field value satisfies validation without full form submit.
- **FR-004**: Keyboard focus order MUST follow visual top-to-bottom, left-to-right reading order.
- **FR-005**: System MUST ensure select components have a consistent min width and accessible name.
- **FR-006**: Error summary heading MUST receive focus when validation fails to support assistive technologies.
- **FR-007**: All newly added or modified static texts MUST have localization keys (EN, LT) prior to merging.
- **FR-008**: Validation messages MUST follow a unified phrasing convention (e.g., "Field label: error message").
- **FR-009**: Submission MUST prevent duplicate requests by disabling submit button while pending.
- **FR-010**: Layout MUST remain fully usable without horizontal scrolling at 320px width.
- **FR-011**: Error messages within dynamic list sections (organs/measures/attachments) MUST associate to the exact field instance.
- **FR-012**: System MUST expose an accessible status or aria-live region for submission pending state.
- **FR-013**: Non-critical decorative elements MUST not trap focus (e.g., progress bars, visual separators).
- **FR-014**: Internationalization fallback MUST not surface raw key strings in either supported locale.
- **FR-015**: Form MUST support assistive navigation (screen reader announces label and error state for each field).
- **FR-016**: Provide configurable max number of shown summary errors (default 5); if more remain, append a final line: "+ X more not shown" (X = remaining count).
- **FR-017**: JavaScript is required; if JS disabled, display upgrade message and do not allow submission (no progressive enhancement fallback).

### Constitutional Requirements *(auto-checked against constitution v1.0.0)*
All features MUST comply with:
- **UX**: Simple, intuitive interfaces using approved component library (HeroUI not deprecated here).
- **Responsive**: Mobile-first design tested at key breakpoints.
- **Validation**: Zod schemas for all user inputs.
- **Styling**: Use fonts/colors from `fontAndColour.css` and existing Tailwind tokens.
- **Testing**: Jest + Cucumber/Playwright as per repository direction; additions must include test coverage.
- **Database**: No new schema unless a mismatch discovered; then use Drizzle migrations.

### Key Entities *(data involved)*
- **Submission**: Represents user-entered form data; attributes already defined (name, code, companyType, dates, nested arrays).
- **Validation Issue**: Ephemeral representation of a field-specific error (fieldKey, message) used for summary/inlined display.

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: User can complete a valid submission from a blank form in ≤ 3 minutes (median within test group of 5 users).
- **SC-002**: 100% of required fields announce required status via screen reader audit (axe/ARIA evaluation).
- **SC-003**: Keyboard-only navigation completes full form without obstruction (0 blocked elements) in ≤ 2 minutes.
- **SC-004**: Error correction latency (time from valid input blur to error disappearance) ≤ 300ms.
- **SC-005**: Localization coverage for modified/added strings = 100% (no fallback counts) in automated key scan.
- **SC-006**: No horizontal scroll at viewport width 320px (layout audit on Chrome/Firefox/Safari).
- **SC-007**: Duplicate submission attempts reduced to 0 (verified by network log; only one POST per submit action).
- **SC-008**: Assistive technology audit: All fields and error messages pass labeling tests (axe: 0 violations in form category).

## Dependencies
- Existing form components (`ui` package) may require minor updates.
- i18n dictionaries must expand for new keys.
- Potential schema alignment if discovered mismatch (post scope decision).

## Risks
- Ambiguity in non-JS support could delay implementation if not decided early.
- Overflow handling for error summary may affect accessibility if not specified.

## Open Questions / Clarifications
None remaining; all prior clarification markers resolved per user choices (Q1 A, Q2 A, Q3 B).

## Clarification Markers Summary
No outstanding markers.

## Next Steps
Proceed to planning (`/speckit.plan` equivalent) and task generation; begin implementation with User Story 1.
Await user clarification on marked items; then finalize spec (remove markers), create planning tasks, proceed to implementation.

