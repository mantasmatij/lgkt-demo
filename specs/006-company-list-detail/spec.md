# Feature Specification: Company List & Detail

**Feature Branch**: `006-company-list-detail`  
**Created**: 2025-11-11  
**Status**: Draft  
**Input**: User description: "Company list, preview. We want to extend our admin side with a company list, company detail view, filters for company list. In the company list table we want these columns: 'Company name', 'Company code', 'Company type', 'Company adress', 'Company eDelivery adress'. The table should be ordered by company name descending. We want to have a search for the 'Company name' and 'Company code'. In the Company Detail view we want to be able to see all company details: 'Company name', 'Company code', 'Company type', 'Legal form', 'Company adress', 'Registry', 'eDelivery adress' and we want to have that companies filled out form list below those. The companies form list should have these fields: 'Date from', 'Date to', 'Women %', 'Men %', 'Requirements applied', 'Submitter email', 'Submission date'. They should be ordered by submission date descending by default."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and search companies (Priority: P1)

An admin wants to find a company quickly from the admin panel by browsing a sortable list, searching by Company name or Company code, and seeing core details at a glance.

**Why this priority**: Enables the most common admin task—locating a specific company—fast, reducing support workload and time-to-action.

**Independent Test**: From the admin panel, navigate to the Companies list and verify searching by name/code and default sorting work without needing the detail view.

**Acceptance Scenarios**:

1. Given the Companies list is open, When the page loads, Then companies are ordered by Company name descending by default.
2. Given the Companies list is open, When an admin types a partial Company name and submits search, Then results show only companies whose names match the query (case-insensitive, substring).
3. Given the Companies list is open, When an admin searches by a full or partial Company code, Then results show only companies whose codes match the query (case-insensitive, substring).
4. Given a search yields no results, When the admin submits the query, Then the list displays an empty state message with no data rows and a clear option to reset.

---

### User Story 2 - Filter the company list (Priority: P2)

An admin wants to narrow down companies using filters to focus on relevant subsets.

**Why this priority**: Filtering accelerates discovery and auditing tasks across large datasets.

**Independent Test**: Apply one or more filters and verify that only companies meeting the criteria are shown, independently of search.

**Acceptance Scenarios**:

1. Given the Companies list is open, When a filter is applied, Then the list updates to show only matching companies and displays active filter chips.
2. Given one or more filters are active, When filters are cleared in one action, Then the list resets to default sort with no active filters.
3. Given filters and a search are both used, When either is changed, Then results reflect the combination of all active criteria.

Note: The exact set of filters requires confirmation. See FR-006.

---

### User Story 3 - View company details and submissions (Priority: P3)

An admin wants to open a company’s detail page to see all company attributes and a list of that company’s submitted forms.

**Why this priority**: Provides complete context for audits, corrections, and support inquiries.

**Independent Test**: From any company in the list, open the detail view and verify all specified fields are present along with the submissions list.

**Acceptance Scenarios**:

1. Given a company exists, When the admin opens its detail view, Then the page shows: Company name, Company code, Company type, Legal form, Company address, Registry, eDelivery address.
2. Given the company has submissions, When the admin views the submissions list, Then it shows columns: Date from, Date to, Women %, Men %, Requirements applied, Submitter email, Submission date, ordered by Submission date descending by default.
3. Given the company has no submissions, When the admin opens the detail view, Then an empty state explains that no submissions are available yet.

### Edge Cases

- Empty list: No companies exist or filters/search exclude all; show empty state and clear/reset controls.
- Extremely long names/addresses: Content truncates gracefully with tooltip or full text on hover.
- Missing optional fields: eDelivery address or Registry may be absent; display as "—" without errors.
- Invalid search input: Leading/trailing spaces ignored; special characters treated as literals.
- Large result sets: Pagination or infinite scroll ensures consistent performance with stable sorting.

## Requirements *(mandatory)*

### Functional Requirements

- FR-001: The Companies list must display columns: Company name, Company code, Company type, Company address, Company eDelivery address.
  - Acceptance: On first load with data present, the table header shows these five columns in the specified order.
- FR-002: The Companies list must be ordered by Company name descending by default.
  - Acceptance: On first load (no search/filters), the first data row has a name alphabetically closest to "Z".
- FR-003: Admins must be able to search companies by Company name (partial, case-insensitive) and Company code (partial, case-insensitive).
  - Acceptance: Queries like "lab" match "Labtech" and "ALAB123"; an empty query resets to default results.
- FR-004: Applying any filter must update the list to only include companies matching all active criteria; clearing filters must restore default results and sort.
  - Acceptance: Activating two filters narrows results to their intersection; using "Clear all" removes all filters and resets sort.
- FR-005: The Companies list must support pagination with a sensible default page size (assume 25) and allow navigation across pages.
  - Acceptance: With more than 25 results, only 25 are shown per page by default; next/previous controls navigate correctly while preserving search/filters.
- FR-006: The Companies list must provide filters including [NEEDS CLARIFICATION: Confirm required filters for v1 (e.g., Company type, Registry, Has eDelivery address)].
  - Acceptance: The agreed filter set is visible as controls; applying each affects results as expected.
- FR-007: The Company detail view must display: Company name, Company code, Company type, Legal form, Company address, Registry, eDelivery address.
  - Acceptance: Opening any company shows these fields exactly once with readable labels.
- FR-008: The Company detail view must include a submissions list for that company with columns: Date from, Date to, Women %, Men %, Requirements applied, Submitter email, Submission date.
  - Acceptance: Table header shows these seven columns in the specified order.
- FR-009: The submissions list must be ordered by Submission date descending by default.
  - Acceptance: The first row has the most recent submission date.
- FR-010: Empty states must be shown for no companies, no search results, or no submissions, with a clear action to reset/return.
  - Acceptance: In each empty state, explanatory text is visible and a reset or back control is provided.
- FR-011: Access must be restricted to authorized admins only; non-admins cannot view these screens.
  - Acceptance: Attempting to access without admin privileges results in a redirect or access denied message.

### Key Entities *(data involved)*

- Company: Represents an organization in the system. Attributes include Company name, Company code, Company type, Legal form, Company address, Registry, eDelivery address.
- Company Submission: A submitted form associated with a Company. Attributes include Date from, Date to, Women %, Men %, Requirements applied, Submitter email, Submission date.

## Assumptions

- Search is whitespace-trimmed, case-insensitive, and matches substrings for both name and code.
- Default page size is 25 items per page; this can be adjusted later if needed.
- "Requirements applied" is a yes/no indicator summarizing whether additional requirements were applied in that submission.
- Terminology normalized to "address" (spelling) and "eDelivery address" for consistency.
- Admin-only access; audit logging and permissions are handled by existing platform standards.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- SC-001: Admins can locate a specific company via search or filters and open its detail view in under 15 seconds in 90% of attempts.
- SC-002: From initial load, the Companies list renders with correct columns and default sort 100% of the time (across supported viewports).
- SC-003: Applying or clearing filters updates visible results within 2 seconds in 95% of attempts (perceived responsiveness to users).
- SC-004: On a company detail page, all specified fields and the submissions list are visible and correctly ordered in 100% of cases tested.


