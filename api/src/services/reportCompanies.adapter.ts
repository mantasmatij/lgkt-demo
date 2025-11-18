import { getReportDefinition } from '../utils/reportRegistry';

export interface AdapterResult {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  total: number;
}

interface CompaniesAdapterParams {
  filters?: Record<string, unknown>;
  sort?: { column?: string; direction?: 'asc' | 'desc' };
}

export async function fetchCompaniesReport(params: CompaniesAdapterParams): Promise<AdapterResult> {
  const def = getReportDefinition('companies-list');
  const columns = def?.columns.map(c => c.key) || [];
  // Placeholder: real implementation will query DB; empty rows for now
  const rows: Array<Record<string, unknown>> = [];
  return { columns, rows, total: rows.length };
}
