import { selectColumns, applyAllowedKeysToRows } from './reportShared.adapter';
import { sql } from 'drizzle-orm';

export interface AdapterResult {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  total: number;
}

interface CompaniesAdapterParams {
  filters?: { company?: { companyCode?: string } };
  sort?: { column?: string; direction?: 'asc' | 'desc' };
  allowedKeys?: string[];
}

export async function fetchCompaniesReport(params: CompaniesAdapterParams): Promise<AdapterResult> {
  const columns = selectColumns('companies-list', params.allowedKeys);
  const { getDb, companies } = await import('db');
  const db = getDb();
  // Build where clause for companyCode filter if provided
  const companyCode = params.filters?.company?.companyCode;
  const where = companyCode
    ? sql`${companies.code} = ${companyCode}`
    : undefined;
  // Query limited to 500 rows for preview performance
  const results = await db
    .select({
      id: companies.id,
      name: companies.name,
      code: companies.code,
      type: companies.type,
      address: companies.address,
    })
    .from(companies)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .where(where as any)
    .orderBy(companies.name)
    .limit(500);
  const rows: Array<Record<string, unknown>> = results.map(r => ({ ...r }));
  const filteredRows = applyAllowedKeysToRows(rows, columns, params.allowedKeys);
  return { columns, rows: filteredRows, total: filteredRows.length };
}
