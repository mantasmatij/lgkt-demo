import { selectColumns, applyAllowedKeysToRows } from './reportShared.adapter';
import { and, gte, lte, sql } from 'drizzle-orm';

export interface AdapterResult {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  total: number;
}

interface FormsAdapterParams {
  filters?: { dateRange?: { from?: string; to?: string } };
  sort?: { column?: string; direction?: 'asc' | 'desc' };
  allowedKeys?: string[];
  limit?: number;
  fullExport?: boolean;
}

export async function fetchFormsReport(params: FormsAdapterParams): Promise<AdapterResult> {
  const previewColumns = selectColumns('forms-list', params.allowedKeys);
  const fullExportColumns: string[] = [
    // base identifiers
    'id',
    // company fields
    'companyName', 'companyCode', 'companyType', 'legalForm', 'address', 'registry', 'eDeliveryAddress',
    // reporting
    'reportPeriodFrom', 'reportPeriodTo',
    // contact + submission meta
    'contactName', 'submitterEmail', 'contactPhone', 'notes',
    // consent/requirements
    'consent', 'consentText', 'requirementsApplied', 'requirementsLink',
    // submission
    'submissionDate',
    // gender aggregates
    'womenPercent', 'menPercent', 'totalsWomen', 'totalsMen', 'totalsTotal',
    // related collections (JSON)
    'genderBalanceRows', 'organs', 'measures', 'attachments', 'meta',
  ];
  const columns = params.fullExport ? fullExportColumns : previewColumns;
  const { getDb, submissions, genderBalanceRows } = await import('db');
  const db = getDb();
  const from = params.filters?.dateRange?.from;
  const to = params.filters?.dateRange?.to;
  // Inside condition: both reportingFrom and reportingTo must lie within filter range
  // If only one bound provided, both dates must satisfy that single bound
  const where = (() => {
    if (from && to) return and(gte(submissions.reportingFrom, from), lte(submissions.reportingTo, to));
    if (from && !to) return and(gte(submissions.reportingFrom, from), gte(submissions.reportingTo, from));
    if (!from && to) return and(lte(submissions.reportingFrom, to), lte(submissions.reportingTo, to));
    return undefined;
  })();
  const limit = params.limit && params.limit > 0 ? params.limit : undefined;
  const baseQuery = db
    .select({
      id: submissions.id,
      companyCode: submissions.companyCode,
      companyName: submissions.nameAtSubmission,
      companyType: submissions.companyType,
      legalForm: submissions.legalForm,
      address: submissions.address,
      registry: submissions.registry,
      eDeliveryAddress: submissions.eDeliveryAddress,
      reportPeriodFrom: submissions.reportingFrom,
      reportPeriodTo: submissions.reportingTo,
      requirementsApplied: submissions.requirementsApplied,
      consent: submissions.consent,
      consentText: submissions.consentText,
      requirementsLink: submissions.requirementsLink,
      contactName: submissions.contactName,
      submitterEmail: submissions.contactEmail,
      contactPhone: submissions.contactPhone,
      notes: submissions.notes,
      submissionDate: submissions.createdAt,
    })
    .from(submissions)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .where((where as any) ?? (sql`true` as any))
    .orderBy(submissions.createdAt);
  const rowsRaw = limit ? await baseQuery.limit(limit) : await baseQuery;

  const ids = rowsRaw.map((r) => r.id);
  let percentages: Record<string, { women: number; men: number; total: number }> = {};
  if (ids.length) {
    const agg = await db
      .select({
        submissionId: genderBalanceRows.submissionId,
        women: sql<number>`sum(${genderBalanceRows.women})`,
        men: sql<number>`sum(${genderBalanceRows.men})`,
        total: sql<number>`sum(${genderBalanceRows.total})`,
      })
      .from(genderBalanceRows)
      .where((await import('drizzle-orm')).inArray(genderBalanceRows.submissionId, ids))
      .groupBy(genderBalanceRows.submissionId);
    percentages = Object.fromEntries(
      agg.map((a) => [a.submissionId, { women: a.women ?? 0, men: a.men ?? 0, total: a.total ?? 0 }])
    );
  }

  // When full export, load related collections and meta in bulk and group by submissionId
  let rel:
    | null
    | {
        genderRowsById: Record<string, unknown[]>;
        organsById: Record<string, unknown[]>;
        measuresById: Record<string, unknown[]>;
        attachmentsById: Record<string, unknown[]>;
        metaById: Record<string, unknown | null>;
      } = null;
  if (params.fullExport && ids.length) {
    const { submissionOrgans, submissionMeasures, attachments, submissionMeta } = await import('db');
    const { inArray } = await import('drizzle-orm');
    const [genderRowsAll, organsAll, measuresAll, attachmentsAll, metaAll] = await Promise.all([
      db.select().from(genderBalanceRows).where(inArray(genderBalanceRows.submissionId, ids)),
      db.select().from(submissionOrgans).where(inArray(submissionOrgans.submissionId, ids)),
      db.select().from(submissionMeasures).where(inArray(submissionMeasures.submissionId, ids)),
      db.select().from(attachments).where(inArray(attachments.submissionId, ids)),
      db.select().from(submissionMeta).where(inArray(submissionMeta.submissionId, ids)),
    ]);
    const group = <T extends { submissionId: string }>(arr: T[]) =>
      arr.reduce<Record<string, T[]>>((acc, r) => {
        (acc[r.submissionId] ||= []).push(r);
        return acc;
      }, {});
    const metaById = metaAll.reduce<Record<string, unknown | null>>((acc, m: any) => {
      acc[m.submissionId] = m ?? null;
      return acc;
    }, {});
    rel = {
      genderRowsById: group(genderRowsAll as any),
      organsById: group(organsAll as any),
      measuresById: group(measuresAll as any),
      attachmentsById: group(attachmentsAll as any),
      metaById,
    };
  }

  const rows: Array<Record<string, unknown>> = rowsRaw.map((r) => {
    const p = percentages[r.id] ?? { women: 0, men: 0, total: 0 };
    const denom = p.total && p.total > 0 ? p.total : p.women + p.men;
    const womenPercent = denom > 0 ? Math.round((p.women / denom) * 100) : 0;
    const menPercent = denom > 0 ? Math.round((p.men / denom) * 100) : 0;
    const fmtDate = (d: unknown): string => {
      if (!d) return '';
      if (typeof d === 'string') return d.slice(0, 10);
      if (d instanceof Date) return d.toISOString().slice(0, 10);
      try { return new Date(String(d)).toISOString().slice(0, 10); } catch { return ''; }
    };
    const fmtDateTime = (d: unknown): string => {
      if (!d) return new Date().toISOString();
      if (typeof d === 'string') return d;
      if (d instanceof Date) return d.toISOString();
      try { return new Date(String(d)).toISOString(); } catch { return new Date().toISOString(); }
    };
    const base: Record<string, unknown> = {
      id: r.id,
      companyName: r.companyName ?? '',
      companyCode: r.companyCode,
      companyType: r.companyType ?? '',
      legalForm: r.legalForm ?? '',
      address: r.address ?? '',
      registry: r.registry ?? '',
      eDeliveryAddress: r.eDeliveryAddress ?? '',
      reportPeriodFrom: fmtDate(r.reportPeriodFrom),
      reportPeriodTo: fmtDate(r.reportPeriodTo),
      contactName: r.contactName ?? '',
      submitterEmail: r.submitterEmail ?? '',
      contactPhone: r.contactPhone ?? '',
      notes: r.notes ?? '',
      consent: r.consent,
      consentText: r.consentText ?? '',
      requirementsApplied: r.requirementsApplied,
      requirementsLink: r.requirementsLink ?? '',
      submissionDate: fmtDateTime(r.submissionDate),
      womenPercent,
      menPercent,
      totalsWomen: p.women,
      totalsMen: p.men,
      totalsTotal: p.total || p.women + p.men,
    };
    if (params.fullExport && rel) {
      base.genderBalanceRows = JSON.stringify(rel.genderRowsById[r.id] || []);
      base.organs = JSON.stringify(rel.organsById[r.id] || []);
      base.measures = JSON.stringify(rel.measuresById[r.id] || []);
      base.attachments = JSON.stringify(rel.attachmentsById[r.id] || []);
      base.meta = JSON.stringify(rel.metaById[r.id] ?? null);
    }
    return base;
  });

  const filteredRows = applyAllowedKeysToRows(rows, columns, params.allowedKeys);
  return { columns, rows: filteredRows, total: filteredRows.length };
}
