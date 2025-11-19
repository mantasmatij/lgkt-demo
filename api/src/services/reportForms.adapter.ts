import { selectColumns, applyAllowedKeysToRows } from './reportShared.adapter';

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
  const columns = selectColumns('forms-list', params.allowedKeys);
  const rows: Array<Record<string, unknown>> = [];
  const filteredRows = applyAllowedKeysToRows(rows, columns, params.allowedKeys);
  return { columns, rows: filteredRows, total: filteredRows.length };
}
