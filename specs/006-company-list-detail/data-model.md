# Data Model: Company List & Detail

## Entities

### Company
Fields:
- id (UUID) – unique identifier
- name (string, required, 1..255)
- code (string, required, unique, normalized uppercase?)
- type (string, required; constrained to known set)
- legalForm (string, optional)
- address (string, optional, 0..500)
- registry (string, optional)
- eDeliveryAddress (string, optional, email or URI format)
- createdAt (timestamp)
- updatedAt (timestamp)

Indexes:
- (name) for ordering
- (code) unique
- (type) for filtering
- (registry) for filtering

### CompanySubmission
Fields:
- id (UUID)
- companyId (UUID, FK -> Company.id, on delete cascade)
- dateFrom (date, required)
- dateTo (date, required, >= dateFrom)
- womenPercent (number 0..100, required)
- menPercent (number 0..100, required)
- requirementsApplied (boolean, required)
- submitterEmail (string, email)
- submittedAt (timestamp, required)
- createdAt (timestamp)

Constraints:
- (companyId, submittedAt) index for ordering recent submissions
- sum of womenPercent + menPercent may not necessarily equal 100 (assumption; not enforced unless specified)

## Relationships
- Company 1..* CompanySubmission

## Derived / Display Fields
- Submission date = submittedAt formatted
- Requirements applied = Yes/No from boolean

## Validation Rules (Zod concepts)
- Query: page (int >=1), pageSize (int in {10,25,50}), search (<=100 chars), sort=name:desc only for v1
- Filters: type (allowed set), registry (allowed set)

## State Transitions
- Company: passive entity (create/update); no complex lifecycle in scope
- CompanySubmission: immutable after creation (assumption)

## Assumptions
- Registry values come from existing reference data
- Legal form free-text or enumerated (to be confirmed during implementation)

