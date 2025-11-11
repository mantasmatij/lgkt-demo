# Research: Form List Improvements

Created: 2025-11-04

## Context

Admin needs an improved Forms list and read-only Details view with:
- Fields shown in list: Company Name, Company Code, Company Type, Report Period From, Report Period To, Women %, Men %, Requirements Applied, Submitter Email, Submission Date.
- Default sort: Submission Date (newest first); optional sorting by other fields.
- Filters: Company, Submission Date, Reporting Period Date, Gender percentage outside threshold.
- Details view: render form as on the fill page, read-only.

## Unknowns and Decisions

1. Gender imbalance filter semantics
- Decision: Outside 33–67% inclusive for either Women % or Men % (i.e., show forms where women < 33% OR women > 67%; equivalently, men > 67% OR men < 33%).
- Rationale: Matches the “below 33% or above” request as an outside‑band check; 33% is a common policy threshold.
- Alternatives considered:
  - Fixed only “below 33%” (too narrow; ignores high imbalance)
  - Custom threshold per query (adds complexity; can be added later as optional `threshold` parameter)

2. Company filter field(s)
- Decision: Single input matching Company Name OR Company Code (case-insensitive substring).
- Rationale: Admins typically know either name or code; a unified control simplifies UX.
- Alternatives considered:
  - Separate fields for name and code (more UI fields; minimal benefit)
  - Exact match only (hurts discoverability for partial inputs)

3. Reporting period filter semantics
- Decision: Overlap with selected range (inclusive). A form is included if its reporting period intersects the selected [from, to] dates.
- Rationale: Admin intent is to find forms active during a period; overlap is most intuitive.
- Alternatives considered:
  - Containment (form period fully inside range): too strict for many queries
  - Starts-within or ends-within: less intuitive than overlap for auditors

4. Sortable fields beyond Submission Date
- Decision: Permit sorting by Company Name, Company Code, Report Period From, Report Period To, Women %, Men %.
- Rationale: Common administrative pivots; low implementation risk with proper indexing.
- Alternatives considered:
  - Only Submission Date: misses the “nice to have” explicitly requested

5. Status field visibility
- Decision: Retain Status in Details (if present) but not mandatory in List columns; this feature’s list columns follow the provided field set. Status-based filtering is not in scope unless added later.
- Rationale: User-provided list omitted Status; aligning with request avoids scope creep.
- Alternatives considered:
  - Include Status column and filters now (potentially conflicting with field list scope)

6. Deep-linking scope
- Decision: SHOULD include filters, search, page, and page size with graceful degradation on invalid params.
- Rationale: Improves shareability and QA; already clarified.

7. Date range semantics
- Decision: Inclusive start and end, evaluated in Admin’s local timezone.
- Rationale: Matches expectations for date pickers; clarified earlier.

## Best Practices References

- Server-side pagination and filtering with stable sort keys
- Index recommendations: (submission_date), (company_name), (company_code), (report_period_from), (report_period_to), plus composite indexes based on query patterns
- Input validation via Zod on both client and server
- Accessible table patterns: keyboard navigation, table headers, visible focus
- URL state management: encode/decode query params; ignore invalid params and fall back to defaults

## Consolidated Decisions (for plan)

- Default sort: Submission Date desc; additional sorts allowed as listed
- Filters: Company (name or code), Submission Date range, Reporting Period overlap range, Gender imbalance outside 33–67%
- Pagination: page size options 10/25/50/100; default 25; reset to page 1 on filter change
- Combination: OR within type; AND across types
- Deep-linking: SHOULD; include relevant params; graceful fallback
- Details view: read-only rendering of submitted form with all fields and metadata
