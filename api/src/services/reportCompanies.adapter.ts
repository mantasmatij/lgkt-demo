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
      id: companies.id, // retained internally for joins/permissions if needed
      companyName: companies.name,
      companyCode: companies.code,
      companyType: companies.type,
      legalForm: companies.legalForm,
      address: companies.address,
      registry: companies.registry,
      eDeliveryAddress: companies.eDeliveryAddress,
      submissionDate: companies.createdAt,
      requirementsApplied: sql<boolean>`false`,
      // Placeholder columns not present on company entity for unified layout
      reportPeriodFrom: sql<string>`''`,
      reportPeriodTo: sql<string>`''`,
      womenPercent: sql<number>`0`,
      menPercent: sql<number>`0`,
    })
    .from(companies)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .where(where as any)
    .orderBy(companies.name)
    .limit(500);
  const rows: Array<Record<string, unknown>> = results.map(r => ({
    // id intentionally not exposed in preview columns
    companyName: r.companyName,
    companyCode: r.companyCode,
    companyType: r.companyType ?? '',
    legalForm: r.legalForm ?? '',
    address: r.address ?? '',
    registry: r.registry ?? '',
    eDeliveryAddress: r.eDeliveryAddress ?? '',
    reportPeriodFrom: '',
    reportPeriodTo: '',
    submissionDate: r.submissionDate?.toISOString?.() ?? String(r.submissionDate),
    womenPercent: 0,
    menPercent: 0,
    requirementsApplied: r.requirementsApplied,
  }));
  const filteredRows = applyAllowedKeysToRows(rows, columns, params.allowedKeys);
  return { columns, rows: filteredRows, total: filteredRows.length };
}
