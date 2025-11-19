import { getReportDefinition } from '../utils/reportRegistry';
import { filterUnauthorizedFields } from '../utils/permissions/reportPermissions';

export interface AdapterResult {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  total: number;
}

interface CompaniesAdapterParams {
  filters?: Record<string, unknown>;
  sort?: { column?: string; direction?: 'asc' | 'desc' };
  allowedKeys?: string[];
}

export async function fetchCompaniesReport(params: CompaniesAdapterParams): Promise<AdapterResult> {
  const def = getReportDefinition('companies-list');
  const allColumns = def?.columns.map(c => c.key) || [];
  const columns = params.allowedKeys ? allColumns.filter(k => params.allowedKeys!.includes(k)) : allColumns;
  // Placeholder: real implementation will query DB; empty rows for now
  const rows: Array<Record<string, unknown>> = [];
  const filteredRows = params.allowedKeys ? rows.map(r => filterUnauthorizedFields(r, columns)) : rows;
  return { columns, rows: filteredRows, total: filteredRows.length };
}
