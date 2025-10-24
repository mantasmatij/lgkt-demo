# Data Model – Anonymous Company Form & Admin Scaffold

Created: 2025-10-21  
Branch: 001-users-mantas-matijosaitis

## Entities

### Company
- id: UUID
- code: string (company code / registration number) [Unique]
- name: string
- country: string (ISO code)
- legalForm: string
- address: string
- registry: string
- eDeliveryAddress: string
- primaryContactName: string
- primaryContactEmail: string (email)
- primaryContactPhone: string
- createdAt: datetime
- updatedAt: datetime

Rules:
- code is required and unique; code is canonical aggregation key.
- name may change over time; latest name displayed in Companies view.

### Submission
- id: UUID
- companyCode: string (FK to Company.code)
- nameAtSubmission: string
- country: string (ISO code)
- legalForm: string
- address: string
- registry: string
- eDeliveryAddress: string
- reportingFrom: date
- reportingTo: date
- contactName: string
- contactEmail: string (email)
- contactPhone: string
- notes: string (optional)
- consent: boolean
- consentText: string (snapshot of consent wording)
- requirementsApplied: boolean (Q9)
- requirementsLink: string (URL, optional) (Q10.1)
- createdAt: datetime

Rules:
- All required fields validated via Zod on both client and server.
- consent must be true to accept submission.
- submission captures snapshot of company details (legalForm, address, registry, eDeliveryAddress) at time of submission, and Company record is updated with latest values on accept.

### AdminUser
- id: UUID
- email: string (unique)
- passwordHash: string
- role: enum('admin')
- createdAt: datetime
- lastLoginAt: datetime (nullable)

### SubmissionOrgan
- id: UUID
- submissionId: UUID (FK to Submission.id)
- organType: enum('VALDYBA','STEBETOJU_TARYBA')
- lastElectionDate: date (Q7.2)
- plannedElectionDate: date (Q7.3)

Rules:
- Multiple records allowed per submission (Q7.4 add/remove UI behavior).

### GenderBalanceRow
- id: UUID
- submissionId: UUID (FK to Submission.id)
- role: enum('CEO','BOARD','SUPERVISORY_BOARD')
- women: integer (>=0)
- men: integer (>=0)
- total: integer (>=0)

Rules:
- One row per role per submission (Q8.1–8.3); total == women + men.

### SubmissionMeasure
- id: UUID
- submissionId: UUID (FK to Submission.id)
- name: string (Q11.2)
- plannedResult: string (Q11.3)
- indicator: string (Q11.4)
- indicatorValue: string (Q11.5)
- indicatorUnit: string (Q11.6)
- year: string (Q11.7)

Rules:
- Multiple measures allowed; user can add/remove.

### Attachment
- id: UUID
- submissionId: UUID (FK to Submission.id)
- type: enum('LINK','FILE')
- url: string (for LINK) (Q10.1)
- fileName: string (for FILE)
- fileSize: integer (bytes) (for FILE)
- contentType: string (for FILE)
- storageKey: string (for FILE)  

Rules:
- At least one attachment MAY be provided. Files are optional; links recommended.

### SubmissionMeta
- id: UUID
- submissionId: UUID (FK to Submission.id)
- reasonsForUnderrepresentation: string (Q12)
- submitterName: string (Q14, full name)
- submitterTitle: string (Q14, role/position)
- submitterPhone: string (Q14)
- submitterEmail: string (Q14, email)

## Relationships
- Company 1 — N Submission (via company code)
- Submission 1 — N SubmissionOrgan
- Submission 1 — N GenderBalanceRow (3 rows expected per submission)
- Submission 1 — N SubmissionMeasure
- Submission 1 — N Attachment
- Submission 1 — 1 SubmissionMeta

## Derived Views
- Companies View: aggregate by Submission.companyCode; display latest Submission.nameAtSubmission as company name; count submissions per code.

## Validation (Zod)
- submissionSchema: {
  name, code, country, legalForm, address, registry, eDeliveryAddress,
  reportingFrom, reportingTo,
  contactName, contactEmail, contactPhone,
  requirementsApplied, requirementsLink?,
  organs: [{ organType, lastElectionDate, plannedElectionDate }...],
  genderBalance: [ { role, women, men, total } x3 ],
  measures: [{ name, plannedResult, indicator, indicatorValue, indicatorUnit, year }...],
  attachments: [{ type, url? }...] (links)  // files uploaded via multipart; metadata recorded post-upload,
  reasonsForUnderrepresentation?,
  consent, consentText,
  submitter: { name, title, phone, email }
}
- adminAuthSchema: { email, password }

## Migrations
- Create tables for Company, Submission, AdminUser with indexes:
  - Company.code unique index
  - Submission.companyCode index
  - Submission.createdAt index
- Create tables for SubmissionOrgan, GenderBalanceRow, SubmissionMeasure, Attachment, SubmissionMeta with FKs to Submission.

## File Uploads

### Strategy
- Files are uploaded inline while the user is filling out the form. Selecting or dragging files starts an asynchronous upload to `POST /uploads` (multipart/form-data, field `file`) without leaving the form.
- The UI shows per-file progress, allows removing a file, and validates type/size on the client before upload. No extra steps or pages are required for the user.
- The server validates content type and size, stores the file (local filesystem or object storage), and returns an `uploadId` plus metadata (fileName, contentType, fileSize, storageKey).
- When the user submits the form, the payload includes attachments as either links or file references by `uploadId`. On successful submission, the server persists `Attachment` rows linked to `Submission` and finalizes any temporary storage state.

### Constraints
- Allowed content types: `application/pdf`, `image/png`, `image/jpeg`.
- Max file size: 10 MB per file (configurable via environment variable).
- Max attachments per submission: 5 files (configurable).
- Storage: Local development uses `./uploads/` directory; production SHOULD use an object store (e.g., S3 or S3-compatible). `storageKey` records the object key.

### API Contract References
- `POST /uploads` — returns `{ uploadId, fileName, contentType, fileSize, storageKey }`
- `PublicSubmissionRequest.attachments[]` — may include either a link (`{ type: 'LINK', url }`) or a file reference (`{ type: 'FILE', uploadId }`).
