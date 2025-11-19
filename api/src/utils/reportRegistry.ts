// Placeholder report registry for Expand Reporting MVP
// Will be extended in US1 tasks (T020) with concrete column and filter definitions.

export type ReportType = 'companies-list' | 'forms-list';

export interface ReportColumn {
  key: string;
  label: string;
}

export interface ReportFilterDefinition {
  key: string;
  type: 'text' | 'select' | 'dateRange' | 'boolean';
  options?: Array<{ value: string; label: string }>;
}

export interface ReportDefinition {
  id: ReportType;
  name: string;
  columns: ReportColumn[]; // Placeholder (populated later)
  filters: ReportFilterDefinition[]; // Placeholder (populated later)
}

// Initial empty definitions; adapters will supply dynamic columns later.
const definitions: Record<ReportType, ReportDefinition> = {
  'companies-list': {
    id: 'companies-list',
    name: 'Companies List Report',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' }
    ],
    filters: [
      { key: 'dateRange', type: 'dateRange' },
      // Company dropdown, options are loaded dynamically via /api/reports/company-options
      { key: 'companyCode', type: 'select' }
    ]
  },
  'forms-list': {
    id: 'forms-list',
    name: 'Forms List Report',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'schemaVersion', label: 'Schema Version' }
    ],
    filters: [
      { key: 'dateRange', type: 'dateRange' }
    ]
  }
};

export function getReportTypes(): Array<{ id: ReportType; name: string }> {
  return Object.values(definitions).map(d => ({ id: d.id, name: d.name }));
}

export function getReportDefinition(type: ReportType): ReportDefinition | undefined {
  return definitions[type];
}

export function registerReportColumns(type: ReportType, columns: ReportColumn[]): void {
  const def = definitions[type];
  if (def) def.columns = columns;
}

export function registerReportFilters(type: ReportType, filters: ReportFilterDefinition[]): void {
  const def = definitions[type];
  if (def) def.filters = filters;
}
