import { getReportDefinition } from '../utils/reportRegistry';

export interface AdapterResult {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  total: number;
}

interface FormsAdapterParams {
  filters?: Record<string, unknown>;
  sort?: { column?: string; direction?: 'asc' | 'desc' };
}

export async function fetchFormsReport(params: FormsAdapterParams): Promise<AdapterResult> {
  const def = getReportDefinition('forms-list');
  const columns = def?.columns.map(c => c.key) || [];
  const rows: Array<Record<string, unknown>> = [];
  return { columns, rows, total: rows.length };
}
