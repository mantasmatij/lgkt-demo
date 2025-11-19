import { getReportDefinition } from '../utils/reportRegistry';
import { filterUnauthorizedFields } from '../utils/permissions/reportPermissions';

export interface AdapterResult {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  total: number;
}

interface FormsAdapterParams {
  filters?: Record<string, unknown>;
  sort?: { column?: string; direction?: 'asc' | 'desc' };
  allowedKeys?: string[];
}

export async function fetchFormsReport(params: FormsAdapterParams): Promise<AdapterResult> {
  const def = getReportDefinition('forms-list');
  const allColumns = def?.columns.map(c => c.key) || [];
  const columns = params.allowedKeys ? allColumns.filter(k => params.allowedKeys!.includes(k)) : allColumns;
  const rows: Array<Record<string, unknown>> = [];
  const filteredRows = params.allowedKeys ? rows.map(r => filterUnauthorizedFields(r, columns)) : rows;
  return { columns, rows: filteredRows, total: filteredRows.length };
}
