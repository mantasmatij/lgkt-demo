# Data Model: Expand Reporting MVP

Created: 2025-11-18

## Entities

- ReportDefinition
  - id (string)
  - name (string)
  - type (enum: companies-list, forms-list)
  - columns: ordered list of ColumnDefinition
  - availableFilters: list of FilterDefinition
  - permissions: rules for field/row-level access

- ColumnDefinition
  - key (string)
  - label (string)
  - dataType (string)
  - format (optional)

- FilterDefinition
  - key (string)
  - type (enum: text, select, dateRange, boolean)
  - options (optional for select)
  - validation (Zod-derived rules)

- ExportRequest
  - id (string)
  - userId (string)
  - reportId (string)
  - createdAt (datetime)
  - params: filters, sort, pagination
  - format (enum: csv)
  - status (enum: completed, failed)
  - metadata: exportTime, timezone, columnSetId

- Company
  - id (uuid)
  - name (string)
  - code (string)

- Form
  - id (uuid)
  - name (string)
  - schemaVersion (string)

- Submission
  - id (uuid)
  - formId (uuid)
  - companyId (uuid)
  - submittedAt (datetime)
  - fields: map<string, value>

## Relationships
- ReportDefinition defines columns/filters mapping onto companies and forms/submissions datasets.
- ExportRequest references a ReportDefinition and captures the parameterized snapshot.
- Submissions link Form and Company via foreign keys.

## Validation Rules (from spec)
- Filters and sorting must be validated (Zod) to accepted ranges/options.
- Permission filtering must be applied before export.
- All exports include all fields defined for the dataset; missing values are empty.

## Notes
- No schema changes required for MVP if existing data satisfies needs; if later persisted export logs are required, introduce a dedicated table via Drizzle migration.
