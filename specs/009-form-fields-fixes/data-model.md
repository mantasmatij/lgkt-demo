# Data Model: Page-wide Form Field & UI Fixes

**Branch**: `009-form-fields-fixes`  
**Date**: 2025-11-24

## Overview
No new persistent entities. Enhancements focus on client-side representation of validation issues and controlled form state.

## Entities

### Submission (existing)
Represents a user-submitted company form.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| name | string | required, non-empty | Company legal name at submission |
| code | string | required, unique company code | Links to companies table |
| companyType | enum (LISTED, STATE_OWNED, LARGE, etc.) | optional depending on business logic | Already persisted in submissions.company_type |
| legalForm | string | required | Legal form descriptor |
| address | string | required | Full postal address |
| registry | string | required | Registry identifier |
| eDeliveryAddress | string | required | e-service address |
| reportingFrom | date (ISO) | required | Period start |
| reportingTo | date (ISO) | required | Period end >= reportingFrom |
| organs | array<OrganRow> | optional | Dynamic rows |
| genderBalance | array<GenderBalanceRow> | required (three roles) | CEO, BOARD, SUPERVISORY_BOARD |
| measures | array<MeasureRow> | optional | Strategic measures |
| attachments | array<AttachmentRow> | optional | Links/files |
| reasonsForUnderrepresentation | string | optional | Long-form explanation |
| consent | boolean | required true | Must be checked |
| consentText | string | required | Static text captured at submission |
| submitter.name | string | required | Person name |
| submitter.title | string | required | Position title |
| submitter.phone | string | required | Phone (min length rule) |
| submitter.email | string (email) | required | Valid email format |

### ValidationIssue (ephemeral)
Represents a single field error used for inline + summary display.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| fieldKey | string | required | Matches DOM id / schema path (e.g. `submitter.email`) |
| message | string | required | Localized human-readable error |

### OrganRow
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| organType | enum | required | Valdyba / Stebėtojų taryba |
| lastElectionDate | date | optional | Past election |
| plannedElectionDate | date | optional | Future election |

### GenderBalanceRow
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| role | enum (CEO, BOARD, SUPERVISORY_BOARD) | required | Fixed set |
| women | number | ≥0 | Count |
| men | number | ≥0 | Count |
| total | number | women + men | Consistency check |

### MeasureRow
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| name | string | required | Measure name |
| plannedResult | string | optional | Outcome description |
| plannedIndicator | string | optional | Indicator descriptor |
| indicatorValue | string | optional | Numeric or descriptive |
| indicatorUnit | string | optional | Unit (e.g., %) |
| year | string | optional | Target year |

### AttachmentRow
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| type | string | required | File or link type |
| url | string (URL) | optional | Link target |
| fileName | string | optional | Original filename |
| fileSize | number | optional | Size bytes |
| contentType | string | optional | MIME type |
| storageKey | string | optional | Internal storage reference |

## Relationships
- Submission has many OrganRow, GenderBalanceRow, MeasureRow, AttachmentRow.
- ValidationIssue references a field within Submission or nested rows (flattened path).

## Validation Rules (summary)
- Required indicators must reflect required fields (FR-001).
- Inline validity recalculated on blur (D3).
- GenderBalanceRow.total == women + men (schema rule).
- Date ordering: reportingFrom <= reportingTo.
- Consent must be true to submit.

## State Transitions
1. Editing → Attempt Submit → Validation Issues generated if invalid.
2. Correction on blur → ValidationIssue removed if field passes validation.
3. Submit pending (button disabled) → Response success → Redirect; on error → Issues persist.

## Notes
No persistence changes; all modeling leverages existing tables. Ephemeral entities only in client state.
