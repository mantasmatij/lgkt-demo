import { getReportDefinition } from '../utils/reportRegistry';
import { filterUnauthorizedFields } from '../utils/permissions/reportPermissions';

export interface SharedAdapterResult {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  total: number;
}

export function selectColumns(reportType: 'companies-list' | 'forms-list', allowedKeys?: string[]): string[] {
  const def = getReportDefinition(reportType);
  const all = def?.columns.map(c => c.key) || [];
  return allowedKeys ? all.filter(k => allowedKeys.includes(k)) : all;
}

export function applyAllowedKeysToRows(
  rows: Array<Record<string, unknown>>,
  columns: string[],
  allowedKeys?: string[]
): Array<Record<string, unknown>> {
  if (!allowedKeys) return rows;
  return rows.map(r => filterUnauthorizedFields(r, columns));
}
