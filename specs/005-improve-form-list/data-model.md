# Data Model: Form List Improvements

Created: 2025-11-04

## Entities

### Form (List View)
- id: string (unique identifier)
- companyName: string (display)
- companyCode: string (display)
- companyType: string (display)
- reportPeriodFrom: date (YYYY-MM-DD)
- reportPeriodTo: date (YYYY-MM-DD)
- womenPercent: number (0–100, integer or one decimal)
- menPercent: number (0–100, integer or one decimal)
- requirementsApplied: boolean (true/false)
- submitterEmail: string (email format)
- submissionDate: datetime (ISO 8601)

Notes:
- Percentages SHOULD sum near 100%; do not enforce exact 100% to avoid rounding errors.
- `requirementsApplied` models "Requirements applied" as a boolean (Yes/No in UI). If upstream source is text, map to boolean during ingestion.

### Form (Details View)
- All fields above, plus the full set of submitted form fields rendered read-only.
- metadata: { lastUpdated: datetime, submitterName?: string }

## Validation Rules
- companyName/companyCode/companyType: non-empty (where applicable)
- reportPeriodFrom <= reportPeriodTo (inclusive)
- submissionDate: valid datetime; used for default sorting
- womenPercent/menPercent: 0 ≤ value ≤ 100
- gender imbalance filter: include if womenPercent < 33 OR womenPercent > 67 (equivalently on menPercent)

## Indexing Recommendations
- submission_date (descending) for default sort
- company_name (for search)
- company_code (for search)
- report_period_from, report_period_to (for overlap range)
- Optional composite: (submission_date, company_code) based on usage

## State & Transitions
- Not in scope for this list/detail feature (read-only). If Status exists, it is displayed in Details only.
