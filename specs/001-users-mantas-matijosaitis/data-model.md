# Data Model – Anonymous Company Form & Admin Scaffold

Created: 2025-10-21  
Branch: 001-users-mantas-matijosaitis

## Entities

### Company
- id: UUID
- code: string (company code / registration number) [Unique]
- name: string
- country: string (ISO code)
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
- contactName: string
- contactEmail: string (email)
- contactPhone: string
- notes: string (optional)
- consent: boolean
- createdAt: datetime

Rules:
- All required fields validated via Zod on both client and server.
- consent must be true to accept submission.

### AdminUser
- id: UUID
- email: string (unique)
- passwordHash: string
- role: enum('admin')
- createdAt: datetime
- lastLoginAt: datetime (nullable)

## Relationships
- Company 1 — N Submission (via company code)

## Derived Views
- Companies View: aggregate by Submission.companyCode; display latest Submission.nameAtSubmission as company name; count submissions per code.

## Validation (Zod)
- submissionSchema: { name, code, country, contactName, contactEmail, contactPhone, notes?, consent }
- adminAuthSchema: { email, password }

## Migrations
- Create tables for Company, Submission, AdminUser with indexes:
  - Company.code unique index
  - Submission.companyCode index
  - Submission.createdAt index
