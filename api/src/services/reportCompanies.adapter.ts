import { selectColumns, applyAllowedKeysToRows } from './reportShared.adapter';

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
  const columns = selectColumns('companies-list', params.allowedKeys);
  // Placeholder: real implementation will query DB; empty rows for now
  const rows: Array<Record<string, unknown>> = [];
  const filteredRows = applyAllowedKeysToRows(rows, columns, params.allowedKeys);
  return { columns, rows: filteredRows, total: filteredRows.length };
}
