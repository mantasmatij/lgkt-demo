# Feature Specification: Form List Improvements

**Feature Branch**: `[005-improve-form-list]`  
**Created**: 2025-11-04  
**Status**: Draft  
**Input**: User description: "Form List Improvements. As an Admin user I want a better experience in the Admin dashboard. I want to see the form list, choose how many forms I can see in a page, be able to filter forms and view any specific form details"

## Clarifications

### Session 2025-11-04

 - Q: Status filter behavior (single vs multi-select)? → A: Multi-select statuses
 - Q: Deep-linking requirement strength? → A: SHOULD (best-effort)
 - Q: Date range interpretation? → A: Inclusive start and end; local timezone
 - Q: Page index on filter change? → A: Reset to page 1
 - Q: Filter combination logic? → A: OR within type; AND across types

---

### User Story 1 - View forms list (Priority: P1)

As an Admin, I can open the Admin dashboard and view a list of forms with key information so I can quickly scan recent activity.

**Why this priority**: Establishes the baseline visibility of forms; without a reliable list view, other improvements have limited value.

**Independent Test**: Navigate to the Admin Forms area and verify a list of forms is visible with expected columns and default sorting, without relying on filters or details view.

**Acceptance Scenarios**:

1. Given I am an authenticated Admin and there are existing forms, When I open the Admin Forms area, Then I see a list of forms with columns: Company Name, Company Code, Company Type, Report Period From, Report Period To, Women %, Men %, Requirements Applied, Submitter Email, Submission Date, limited to the default page size.
2. Given no forms exist, When I open the Admin Forms area, Then I see an empty-state message explaining that no forms are available and how to refresh or adjust filters.
3. Given I am not an Admin, When I attempt to access the Admin Forms area, Then I am prevented from accessing it and see an appropriate message.

---

### User Story 2 - Filter forms (Priority: P1)

As an Admin, I can filter the list of forms by common criteria so I can quickly narrow results to what I need.

**Why this priority**: Filtering significantly reduces time to find a specific form and enables targeted review.

**Independent Test**: Apply each filter independently and in combination and verify the results and counts update accordingly, including empty-result cases.

**Acceptance Scenarios**:

1. Given forms exist with various companies, When I filter by Company with a substring matching name or code, Then only matching forms are shown and the result count reflects the filtered set.
2. Given forms have varying submission dates, When I set a Submission Date range, Then only forms within the date range are shown.
3. Given forms have reporting periods, When I set a Reporting Period range (From/To), Then forms are included if their reporting period overlaps the selected range (inclusive).
4. Given forms have Women % and Men %, When I enable the gender imbalance filter (outside 33–67%), Then only forms where women% < 33 or > 67 are shown (equivalently on men%).
5. Given multiple filters are applied, When I view results, Then filters within the same type combine with OR and different types combine with AND.
6. Given I am on page 3 of results, When I apply any filter change, Then the page index resets to page 1 and results reflect the new filter.
7. Given I share or open a deep link with filters, page, and page size, When parameters are valid, Then the list reconstructs the same view; When parameters are invalid, Then sane defaults are applied.

---

### User Story 3 - Select page size (Priority: P2)

As an Admin, I can choose how many forms are shown per page so I can scan more or fewer rows based on my task.

**Why this priority**: Reduces unnecessary pagination and improves scanning efficiency for power users.

**Independent Test**: Change the page size and verify the number of rows and pagination controls update immediately; confirm the chosen size persists for the current session.

**Acceptance Scenarios**:

1. Given the default page size is 25, When I change it to 50, Then the list displays 50 rows (or fewer if not available) and the pagination reflects the new total of pages.
2. Given I previously selected a page size, When I return to the list during the same session, Then my last selected page size is remembered.
3. Given I select the largest page size option, When the list updates, Then the page remains usable with a visible loading state and results appear without freezing the interface.

---

### User Story 4 - View form details (Priority: P2)

As an Admin, I can open a form’s details from the list so I can review its content and metadata.

**Why this priority**: Enables targeted review and auditing of a specific submission.

**Independent Test**: From the list, open a form’s details and verify comprehensive information is displayed; navigate back and confirm list state is preserved.

**Acceptance Scenarios**:

1. Given a form exists, When I click its row or details action, Then I see a details view showing the form’s captured fields and metadata (ID, status, submitted date/time, last updated, submitter).
2. Given I applied filters and navigated to a later page, When I return from the details view, Then my filters, search terms, page size, and page index are preserved.
3. Given I open a deep link to a specific form ID, When the form exists, Then the details view opens; When it does not exist, Then I see a not-found message with a path back to the list.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- No forms exist (first-time system state)
- Very large total number of forms (performance and usability at scale)
- Filters set to invalid or conflicting values (e.g., end date before start date)
- No results after applying filters
- Access by non-admin or expired session
- Form is deleted or archived between list view and detail open
- Special characters and casing in keyword search
- Date range boundaries (inclusive/exclusive at midnight)
- Pagination out-of-bounds after filters reduce total pages
- Network latency or temporary backend errors (loading and retry behavior)
 - Date range across DST transitions and timezone boundaries
 - Submissions near midnight boundary (end-of-day inclusion)
 - Invalid or partial deep-link URL parameters (graceful fallback to defaults)

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: Admin users MUST be able to access a Forms list from the Admin dashboard navigation.
- **FR-002**: The list MUST display, per form, the following columns: Company Name, Company Code, Company Type, Report Period From, Report Period To, Women %, Men %, Requirements Applied, Submitter Email, Submission Date.
- **FR-003**: The list MUST default to sorting by Submission Date (newest first).
- **FR-004**: The list MUST provide pagination with a page-size selector offering options 10, 25, 50, and 100 items per page; the default page size is 25.
- **FR-005**: The system MUST remember the selected page size for the current admin session and apply it when returning to the list in the same session.
- **FR-006**: The list MUST support filters for: Company (name or code substring), Submission Date range (inclusive start and end in the Admin’s local timezone), Reporting Period overlap (from/to inclusive), and Gender imbalance outside 33–67%.
- **FR-007**: Applying or clearing filters MUST update the results and total count promptly after the user action.
- **FR-008**: The list MUST provide clear controls to reset/clear all filters in one action.
- **FR-009**: When no results match the current filters, the system MUST show a clear empty-state message and a one-click way to clear filters.
- **FR-010**: If data cannot be loaded, the system MUST display a non-technical error message with a retry option.
- **FR-011**: From the list, Admins MUST be able to open a form’s Details view.
- **FR-012**: The Details view MUST display the form’s captured fields and metadata (ID, status, submitter, submitted date/time, last updated) in a readable layout.
- **FR-013**: Returning from the Details view to the list MUST preserve prior filters, search term, page size, and page index so the Admin continues where they left off.
- **FR-014**: The list view state (filters, search, pagination including page and page size) SHOULD be deep-linkable on a best-effort basis so that sharing or reopening the current view reconstructs the same results; invalid or partial URL parameters MUST degrade gracefully to sane defaults.
- **FR-015**: Access control MUST restrict the Admin Forms area to Admin users; non-admins are blocked with an appropriate message.
- **FR-016**: The Forms list and Details view MUST meet common accessibility requirements (e.g., keyboard navigation, focus order, labels) aligned with WCAG 2.1 AA.
- **FR-017**: Filter combination logic MUST be: OR within the same filter type (e.g., multiple statuses) and AND across different filter types (e.g., status with date range and keyword).
- **FR-018**: On any filter change (including Status, Date range, Keyword, Form ID, Form Type), the page index MUST reset to page 1; clearing all filters MUST also reset to page 1.

### Constitutional Requirements *(auto-checked against constitution v1.0.0)*

All features MUST comply with:
- **UX**: Simple, intuitive interfaces consistent with the organization’s design system and patterns.
- **Responsive**: Mobile-first layouts that remain usable across common viewport sizes.
- **Validation**: User inputs validated appropriately on both client and server to prevent invalid submissions.
- **Styling**: Visuals follow approved brand typography and color guidelines for consistency and readability.
- **Testing**: Critical user flows are covered by automated tests to reduce regression risk.
- **Data**: Any data changes follow a controlled migration/change-management process.

### Key Entities *(include if feature involves data)*

- **Form**: A submitted or draft record representing a filled form; key attributes include ID, title/type, status, submitter, submitted date/time, last updated, and captured fields.
- **Admin User**: A user with permissions to view and manage forms in the Admin dashboard.
- **Filter Set**: A transient set of criteria (status, date range, keyword, form ID, form type) used to refine the list of forms.

*Note: If feature adds or changes data structures, follow the standard change-management and migration process.*

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can locate a specific form by ID or keyword in 10 seconds or less for at least 90% of attempts during usability testing.
- **SC-002**: In routine operations, 95% of list views display visible results within 2 seconds.
- **SC-003**: At least 80% of Admin respondents rate the new list experience as "easy" or "very easy" in a post-release survey within two weeks of launch.
- **SC-004**: The average number of pagination interactions per Admin session on the forms list decreases by 30% within 30 days of release.
- **SC-005**: Zero critical accessibility issues are identified by automated checks and spot manual review on the forms list and details views.

## Assumptions & Scope

### Assumptions

- Admin authentication and roles already exist and correctly identify Admin users.
- Status values include common states such as Draft, Submitted, Approved, Rejected, and Archived.
- Default date range is "All time" until the Admin sets a range.
- Keyword search matches across form title/type and submitter name/email.
- "Remember for session" means the setting persists until the browser/tab session ends.
 - Date ranges are interpreted using the Admin’s local timezone.

### Out of Scope

- Creating or editing forms
- Exporting lists (CSV/Excel)
- Bulk actions (approve/reject multiple)
- Customizable columns or saved views
- Audit trails or change history beyond what details already show

