# Feature Specification: Anonymous Company Form & Admin Scaffold

**Feature Branch**: `001-users-mantas-matijosaitis`  
**Created**: 2025-10-21  
**Status**: Draft  
**Input**: User description: "Lets begin with the web app setup. I want to build an app where company users can fill-out a form without loging in. Company users will be redirected to the form from WordPress page under the same domain. We will also have administrators who will be able to login and view filled out forms, view companies who submited the forms and generate reports. Details about companies will be extracted from the forms. First part is just a scaffold."

## User Scenarios & Testing (mandatory)

### User Story 1 - Submit a public company form (Priority: P1)

A company user follows a link from the company website (WordPress) and lands on a public form under the same domain. They can complete required company details and submit without creating an account or logging in. They see a clear on-screen confirmation that the form was submitted.

Why this priority: This is the primary value: collecting company information without friction. It unblocks downstream admin review and reporting.

Independent Test: Access the public form URL, complete required fields, submit, and verify a submission record exists and a confirmation message is displayed.

Acceptance Scenarios:

1. Given a user navigates from the WordPress page under the same domain, When they open the form link, Then the public form is displayed without requiring login.
2. Given the public form is open, When the user completes all required fields and submits, Then the submission is accepted and a confirmation message is shown.
3. Given some required fields are empty or invalid, When the user attempts to submit, Then the form shows clear validation messages and prevents submission until corrected.

---

### User Story 2 - Administrator signs in and sees a dashboard (Priority: P2)

An administrator can sign in and access an admin dashboard that lists submitted forms (or an empty state if none). The dashboard is reachable only after successful sign-in.

Why this priority: Admin access is necessary to realize value from collected submissions and to prepare for future reporting.

Independent Test: Visit the admin URL, authenticate with valid admin credentials, and verify access to a dashboard with either an empty state or a list of submissions.

Acceptance Scenarios:

1. Given an unauthenticated visitor, When they visit an admin URL, Then they are prompted to sign in.
2. Given a valid administrator, When they sign in successfully, Then they are redirected to the admin dashboard.
3. Given no submissions exist, When an admin opens the dashboard, Then an empty state message is shown with no errors.
4. Given submissions exist, When an admin opens the dashboard, Then a list is displayed with at least submission date/time and company name.

---

### User Story 3 - View companies and export a basic report (Priority: P3)

An administrator can view a list of companies derived from submitted forms and export a basic report (e.g., CSV) of submissions within a date range.

Why this priority: Establishes the reporting scaffold and validates that data captured by the public form can be organized and exported.

Independent Test: With a handful of test submissions, verify the companies list is populated and a CSV export for a date range can be downloaded.

Acceptance Scenarios:

1. Given multiple submissions (including multiple from the same company), When an admin opens the Companies view, Then companies are shown with aggregated details (company name and count of submissions).
2. Given a date range is selected, When an admin exports a report, Then a CSV file is generated containing submissions in that range with key fields.

---

### Edge Cases

- Direct navigation to the form without coming from WordPress still works (no login required).
- Multiple submissions from the same company are allowed; companies are aggregated for admin views using exact match on company name and registration number (see Assumptions).
- Attempting to access admin pages without authentication redirects to sign-in.
- Form submission attempted without required consent (if shown) is blocked with a clear message.
- [NEEDS CLARIFICATION: Anti-spam protection for the public form – open access implies risk of automated submissions.]

## Requirements (mandatory)

### Functional Requirements

- FR-001: The public company form MUST be accessible under the same primary domain as the WordPress site without requiring login.
- FR-002: The form MUST collect core company details at minimum: company name, registration number/ID, country, contact person name, contact email, and contact phone (see Assumptions for defaults).
- FR-003: The form MUST enforce required fields and validate basic formats (e.g., email), displaying inline, user-friendly error messages.
- FR-004: On successful submission, the system MUST create a submission record and display an on-screen confirmation to the user.
- FR-005: Administrators MUST be able to sign in to access an admin area that is not accessible to unauthenticated users.
- FR-006: The admin dashboard MUST display a list of submissions (or an empty state) with at least submission date/time and company name.
- FR-007: The admin area MUST provide a Companies view that groups submissions by company (exact match on company name + registration number) and shows aggregate counts.
- FR-008: Administrators MUST be able to export a basic report of submissions within a selected date range as a downloadable CSV file.
- FR-009: Access to admin-only pages MUST be restricted to authenticated administrators; unauthenticated users are redirected to sign-in.
- FR-010: The public form and admin pages MUST present clear notices about data usage and include a required consent checkbox before submission (see Assumptions for wording baseline).
- FR-011: The form MUST be usable on mobile and desktop screens with readable text and tappable controls.
- FR-012: The system SHOULD prevent automated or abusive submissions via an anti-spam mechanism. [NEEDS CLARIFICATION: Preferred anti-spam approach]

### Acceptance Criteria for Functional Requirements

- AC-001 (covers FR-001): From the WordPress site, following the form link displays the form under the same domain path without a login prompt.
- AC-002 (covers FR-002, FR-003): Leaving required fields blank or entering an invalid email shows inline errors and blocks submission until corrected.
- AC-003 (covers FR-004): After valid submission, a confirmation message is shown and a submission record with a timestamp and provided fields exists for admin review.
- AC-004 (covers FR-005, FR-009): Visiting an admin URL while not signed in redirects to sign-in; signing in with valid admin credentials grants access to admin pages.
- AC-005 (covers FR-006): With at least one submission, the admin dashboard shows a list containing submission date/time and company name; with none, an empty state is shown.
- AC-006 (covers FR-007): Companies view shows one row per company (exact name + registration number), with a count of linked submissions.
- AC-007 (covers FR-008): Selecting a date range and exporting produces a CSV file that includes at least submission date/time, company name, registration number, country, and contact email.
- AC-008 (covers FR-010): The public form displays a consent checkbox; attempting to submit without checking it blocks submission with a clear message.
- AC-009 (covers FR-011): On a common mobile viewport, the form fits without horizontal scrolling and tap targets meet standard accessibility sizes.
- AC-010 (covers FR-012): When the anti-spam setting is enabled, automated submissions are measurably reduced in test (see Success Criteria) without degrading user completion.

### Constitutional Requirements (auto-checked against constitution v1.0.0)

All features MUST comply with the product's constitutional principles, including:

- UX: Simple, intuitive interfaces with consistent components and terminology.
- Responsive: Mobile-first layouts that work across common viewports.
- Validation: Consistent input validation on client and server boundaries.
- Accessibility: Clear labels, error messages, and keyboard/touch operability.
- Testing: Key user flows have automated tests for happy path and at least one edge case.
- Data Governance: Changes to data structures are tracked and reviewable.

### Key Entities

- Company: Business derived from submissions; attributes include company name, registration number/ID, country, and primary contact details.
- Submission: A single form submission capturing company details and timestamp; linked to a Company for aggregation.
- Admin User: Person with permission to access admin area; attributes include email and role.
- Report: An export artifact representing submissions within a date range (e.g., CSV), with metadata like generated date/time and filters used.

## Success Criteria (mandatory)

### Measurable Outcomes

- SC-001: 95% of company users can complete and submit the public form in under 5 minutes during usability testing.
- SC-002: 100% of unauthenticated attempts to access admin pages result in a sign-in prompt; 100% of authenticated admins reach the dashboard successfully.
- SC-003: For a dataset of up to 1,000 submissions, a CSV export for a 30-day range is produced within 10 seconds and contains the expected columns.
- SC-004: Aggregation accuracy: Companies list reflects submissions grouped by exact company name + registration number with at least 95% accuracy on a test dataset containing duplicates and variations as described in Edge Cases.
- SC-005: With an anti-spam mechanism enabled, the rate of clearly automated submissions in test drops by at least 80% without increasing legitimate user abandonment by more than 5 percentage points. [Dependent on clarification]

## Assumptions

- Public form fields (minimum): company name, registration number/ID, country, contact person name, contact email, contact phone, and a free-text notes field.
- Admin authentication uses a standard username/email + password flow.
- The form is accessible at a path under the same domain as the WordPress site (linked from a WordPress page); no SSO required for this scaffold phase.
- Consent checkbox text: a standard privacy notice stating data will be used to review submissions and contact the company.
- Data retention: submissions are retained for at least 24 months unless legal/policy dictates otherwise.

## Out of Scope (for this scaffold)

- Advanced report types (e.g., PDF generation, charts) beyond CSV export.
- Complex company deduplication (e.g., fuzzy matching); only exact match on name + registration number is considered.
- Email notifications and webhooks.
- WordPress SSO or deep integration beyond linking.
- Multi-language support beyond the default language.

## Open Questions (maximum 3)

- [NEEDS CLARIFICATION: Preferred anti-spam protection for the public form (e.g., invisible challenge, simple challenge, or none)?]
- [NEEDS CLARIFICATION: Report format expectations beyond CSV export in scaffold – is PDF summary required now or later?]
- [NEEDS CLARIFICATION: Company aggregation key – should we use exact match on name + registration number only, or include additional rules?]

