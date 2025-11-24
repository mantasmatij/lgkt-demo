# Contracts: Page-wide Form Field & UI Fixes

This feature introduces no new backend API endpoints. All changes are client-side improvements to the existing submission form.

## Existing Endpoint Usage
- `POST /api/submissions` (already implemented) continues to be the submission target.

## Validation & Client Behavior
- Client performs pre-submit validation; server remains authoritative.
- Duplicate submission prevention: client disables button; server unchanged.

## Future Extension Placeholder
If future enhancements require partial save or autosave endpoints, propose:
- `POST /api/submissions/draft` to create a draft
- `PATCH /api/submissions/draft/:id` to update draft
- `POST /api/submissions/draft/:id/submit` to finalize

These are NOT in scope now.
