# Data Model: Company Form Submission

Created: 2025-10-31

## Entities

### CompanySubmission
Represents one submitted company form.

Fields (selected relevant fields for this feature):
- companyName: string (required)
- companyCode: string (required)
- companyType: enum (required)
  - Values (stable): LISTED | STATE_OWNED | LARGE
  - Labels (LT): Biržinė įmonė | Valstybės valdoma įmonė | Didelė įmonė
  - Labels (EN): Listed company | State-owned company | Large company
- legalForm: string (required)
- address: string (required)
- registry: string (required)
- eDeliveryAddress: string (optional)
- reportPeriodFrom: date (required, >= 1990-01-01)
- reportPeriodTo: date (required, >= 1990-01-01, must be >= reportPeriodFrom)
- governance:
  - bodyType: string/enum (existing)
  - lastElectionDate: date (>= 1990-01-01)
  - plannedElectionDate: date (>= 1990-01-01)
- genderBalance:
  - manager: { women: number, men: number, total: number }
  - board: { women: number, men: number, total: number }
  - supervisoryBoard: { women: number, men: number, total: number }
  - Constraint: total == women + men per subsection
- requirementsCriteriaApplied: enum (APPLIED | NOT_APPLIED)
- requirementsLink: url (optional)
- attachments: file[] (optional)
- measures: array of { name: string, plannedResult: string, targetIndicator: string, indicatorValue: string|number, unit: string, year: number }
- reasons: string (required, Section 12)
- confirmation: boolean (required)
- submitter: { fullName: string, position: string, phone: string, email: string }

Removed UI fields (for payload backward compatibility):
- country: null/empty
- contactOther: null/empty

Notes:
- No new tables introduced. Payload schema is documented for integration consistency.
