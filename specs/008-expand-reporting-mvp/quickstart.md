# Quickstart: Expand Reporting MVP

This guide explains how to preview and export reports (CSV) during development.

## Prerequisites
- Node.js 20+
- Nx workspace bootstrapped
- API and Web apps configured to run locally
- Database accessible with seed data

## Steps
1. Start the database and API
   - Ensure local Postgres is running with required schema and data.
   - Start the API server (Express) according to repository instructions.
2. Start the web app
   - Launch the Next.js app.
3. Open the Reports area
   - Navigate to the reports entry point and select a report type (Companies list or Forms list).
   - Apply filters (e.g., date range, company selection) and generate a preview.
4. Export CSV
   - Click Download CSV.
   - Verify the file name pattern and content (columns, filters, sorting).

## Verification Checklist
- Preview respects filters and sorting
- CSV includes all columns and matches preview data
- Restricted fields/rows are excluded based on your user permissions
- Large dataset behavior aligns with documented limits

## Notes
- MVP only exposes CSV export; future formats will reuse the same export entry point.
