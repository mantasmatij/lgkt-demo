# Quickstart: Form List Improvements

Created: 2025-11-04

## What this covers
- Admin Forms list: fields, filters, sorting, pagination
- Read-only Form Details view
- API contracts in `contracts/openapi.yaml`

## Run locally (reference)

- Start database (PostgreSQL) per `docker/docker-compose.yml` if required for API.
- Run API and Web per Nx targets (existing project scripts).
- Ensure environment variables for API DB connectivity are set.

## Try the API

List forms (page 1, 25 per page, default sort):

```bash
curl -s "http://localhost:3000/admin/forms?page=1&pageSize=25"
```

Filter by company (name or code substring) and submission date range:

```bash
curl -s "http://localhost:3000/admin/forms?company=alfa&submissionDateFrom=2025-01-01&submissionDateTo=2025-01-31"
```

Filter by reporting period overlap and gender imbalance outside 33–67%:

```bash
curl -s "http://localhost:3000/admin/forms?reportPeriodFrom=2025-01-01&reportPeriodTo=2025-06-30&genderImbalance=outside_33_67"
```

Sort by company name ascending:

```bash
curl -s "http://localhost:3000/admin/forms?sortBy=companyName&sortDir=asc"
```

Get form details:

```bash
curl -s "http://localhost:3000/admin/forms/FORM123"
```

## UX notes
- Page size defaults to 25 (10/25/50/100 options); reset to page 1 on any filter change.
- Date ranges are inclusive and interpreted in the Admin’s local timezone.
- Deep-linking SHOULD be supported; invalid URL params MUST gracefully fall back to defaults.
- Details view renders the submitted form read-only (no edit controls).
