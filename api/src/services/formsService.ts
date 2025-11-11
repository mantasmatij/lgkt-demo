// Forms service: list and details fetching. Implementation will be wired to Drizzle in later phases.
export type SortField =
  | 'submissionDate'
  | 'companyName'
  | 'companyCode'
  | 'reportPeriodFrom'
  | 'reportPeriodTo'
  | 'womenPercent'
  | 'menPercent';

export type SortDir = 'asc' | 'desc';

export interface ListQuery {
  page: number;
  pageSize: 10 | 25 | 50 | 100;
  sortBy: SortField;
  sortDir: SortDir;
  company?: string;
  companyType?: 'LISTED' | 'STATE_OWNED' | 'LARGE';
  submissionDateFrom?: string; // YYYY-MM-DD
  submissionDateTo?: string;   // YYYY-MM-DD
  reportPeriodFrom?: string;   // YYYY-MM-DD
  reportPeriodTo?: string;     // YYYY-MM-DD
  genderImbalance?: 'outside_33_67';
  genderAlignment?: 'meets_33' | 'not_meet_33';
  requirementsApplied?: 'yes' | 'no';
}

export interface FormListItem {
  id: string;
  companyName: string;
  companyCode: string;
  companyType: string;
  reportPeriodFrom: string; // date
  reportPeriodTo: string;   // date
  womenPercent: number;
  menPercent: number;
  requirementsApplied: boolean;
  submitterEmail: string;
  submissionDate: string; // date-time
}

export interface ListResult {
  page: number;
  pageSize: number;
  total: number;
  items: FormListItem[];
}

import { and, desc, asc, inArray, sql, ilike, or, lte, gte, eq } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { normalizePage, normalizePageSize, getOffset } from '../utils/pagination';

export async function getForms(query: ListQuery): Promise<ListResult> {
  const { getDb, submissions, genderBalanceRows } = await import('db');
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const db = getDb();

  // Sort selection (percent fields are computed post-query; sort by createdAt for stability for now)
  const sortDir = query.sortDir === 'asc' ? asc : desc;
  const sortCol = (() => {
    switch (query.sortBy) {
      case 'companyName':
        return submissions.nameAtSubmission;
      case 'companyCode':
        return submissions.companyCode;
      case 'reportPeriodFrom':
        return submissions.reportingFrom;
      case 'reportPeriodTo':
        return submissions.reportingTo;
      case 'womenPercent':
      case 'menPercent':
        return submissions.createdAt;
      case 'submissionDate':
      default:
        return submissions.createdAt;
    }
  })();

  // Build filters
  const whereParts: SQL<unknown>[] = [];
  // Company filter: name OR code substring (case-insensitive)
  if (query.company && query.company.trim().length > 0) {
  const term = `%${query.company.trim()}%`;
  whereParts.push(or(ilike(submissions.nameAtSubmission, term), ilike(submissions.companyCode, term)) as unknown as SQL<unknown>);
  }
  // Company type exact match
  if (query.companyType && ['LISTED','STATE_OWNED','LARGE'].includes(query.companyType)) {
    whereParts.push(eq(submissions.companyType, query.companyType) as unknown as SQL<unknown>);
  }
  // Submission date range (inclusive, local semantics approximated by day bounds)
  if (query.submissionDateFrom) {
    const start = new Date(`${query.submissionDateFrom}T00:00:00`);
    whereParts.push(gte(submissions.createdAt, start) as unknown as SQL<unknown>);
  }
  if (query.submissionDateTo) {
    const end = new Date(`${query.submissionDateTo}T23:59:59.999`);
    whereParts.push(lte(submissions.createdAt, end) as unknown as SQL<unknown>);
  }
  // Reporting period overlap: [reportingFrom, reportingTo] intersects [from, to] (inclusive)
  const rpFrom = query.reportPeriodFrom;
  const rpTo = query.reportPeriodTo;
  if (rpFrom || rpTo) {
    // If only one bound provided, intersect with open-ended other side
    // Conditions: reporting_from <= to AND reporting_to >= from
    const to = rpTo ?? rpFrom ?? null;
    const from = rpFrom ?? rpTo ?? null;
    if (to && from) {
      whereParts.push(
        and(lte(submissions.reportingFrom, to), gte(submissions.reportingTo, from)) as unknown as SQL<unknown>
      );
    }
  }

  let baseWhere: SQL<unknown> | undefined = whereParts.length ? (and(...whereParts) as unknown as SQL<unknown>) : undefined;

  // Gender imbalance outside 33–67%: filter IDs based on aggregated gender rows
  let filteredIds: string[] | null = null;
  if (!query.genderAlignment && query.genderImbalance === 'outside_33_67') {
    // Preselect candidate IDs matching other filters to reduce aggregation scope
    const idRows = baseWhere
      ? await db.select({ id: submissions.id }).from(submissions).where(baseWhere)
      : await db.select({ id: submissions.id }).from(submissions);
    const ids = idRows.map((r) => r.id);
    if (ids.length) {
      const gi = await db
        .select({
          submissionId: genderBalanceRows.submissionId,
          women: sql<number>`sum(${genderBalanceRows.women})`,
          men: sql<number>`sum(${genderBalanceRows.men})`,
          total: sql<number>`sum(${genderBalanceRows.total})`,
        })
        .from(genderBalanceRows)
        .where(inArray(genderBalanceRows.submissionId, ids))
        .groupBy(genderBalanceRows.submissionId);
      filteredIds = gi
        .map((a) => {
          const w = a.women ?? 0;
          const m = a.men ?? 0;
          const t = (a.total ?? 0) > 0 ? (a.total ?? 0) : w + m;
          if (t === 0) return null;
          const wp = w / t;
          return wp < 0.33 || wp > 0.67 ? a.submissionId : null;
        })
        .filter((v): v is string => Boolean(v));
      if (filteredIds.length === 0) {
        // No matches; short-circuit
        return { page, pageSize, total: 0, items: [] };
      }
      baseWhere = baseWhere
        ? ((and(baseWhere, inArray(submissions.id, filteredIds)) as unknown) as SQL<unknown>)
        : ((inArray(submissions.id, filteredIds) as unknown) as SQL<unknown>);
    } else {
      return { page, pageSize, total: 0, items: [] };
    }
  }

  // Gender alignment filter (mutually exclusive with genderImbalance UI-wise)
  if (query.genderAlignment) {
    // We need IDs satisfying or not satisfying 33% rule
    const idRows = baseWhere
      ? await db.select({ id: submissions.id }).from(submissions).where(baseWhere)
      : await db.select({ id: submissions.id }).from(submissions);
    const ids = idRows.map((r) => r.id);
    if (ids.length) {
      const gi = await db
        .select({
          submissionId: genderBalanceRows.submissionId,
          women: sql<number>`sum(${genderBalanceRows.women})`,
          men: sql<number>`sum(${genderBalanceRows.men})`,
          total: sql<number>`sum(${genderBalanceRows.total})`,
        })
        .from(genderBalanceRows)
        .where(inArray(genderBalanceRows.submissionId, ids))
        .groupBy(genderBalanceRows.submissionId);
      const alignedIds: string[] = [];
      const notAlignedIds: string[] = [];
      gi.forEach((a) => {
        const w = a.women ?? 0;
        const m = a.men ?? 0;
        const t = (a.total ?? 0) > 0 ? (a.total ?? 0) : w + m;
        if (t === 0) return; // ignore
        const wp = w / t;
        const aligned = wp >= 0.33 && wp <= 0.67; // satisfies 33% rule
        if (aligned) alignedIds.push(a.submissionId);
        else notAlignedIds.push(a.submissionId);
      });
      const targetIds = query.genderAlignment === 'meets_33' ? alignedIds : notAlignedIds;
      if (!targetIds.length) {
        return { page: normalizePage(query.page), pageSize: normalizePageSize(query.pageSize), total: 0, items: [] };
      }
      baseWhere = baseWhere
        ? ((and(baseWhere, inArray(submissions.id, targetIds)) as unknown) as SQL<unknown>)
        : ((inArray(submissions.id, targetIds) as unknown) as SQL<unknown>);
    } else {
      return { page: normalizePage(query.page), pageSize: normalizePageSize(query.pageSize), total: 0, items: [] };
    }
  }

  // Requirements applied yes/no
  if (query.requirementsApplied) {
    const want = query.requirementsApplied === 'yes';
    baseWhere = baseWhere
      ? ((and(baseWhere, eq(submissions.requirementsApplied, want)) as unknown) as SQL<unknown>)
      : ((eq(submissions.requirementsApplied, want) as unknown) as SQL<unknown>);
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(submissions)
  .where(baseWhere ?? (sql`true` as unknown as SQL<unknown>));

  const rows = await db
    .select({
      id: submissions.id,
      companyCode: submissions.companyCode,
      companyName: submissions.nameAtSubmission,
      companyType: submissions.companyType,
      reportPeriodFrom: submissions.reportingFrom,
      reportPeriodTo: submissions.reportingTo,
      requirementsApplied: submissions.requirementsApplied,
      submitterEmail: submissions.contactEmail,
      submissionDate: submissions.createdAt,
    })
    .from(submissions)
  .where(baseWhere ?? (sql`true` as unknown as SQL<unknown>))
    .orderBy(sortDir(sortCol ?? submissions.createdAt))
    .limit(pageSize)
    .offset(getOffset(page, pageSize));

  const ids = rows.map((r) => r.id);
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
      .where(inArray(genderBalanceRows.submissionId, ids))
      .groupBy(genderBalanceRows.submissionId);
    percentages = Object.fromEntries(
      agg.map((a) => [a.submissionId, { women: a.women ?? 0, men: a.men ?? 0, total: a.total ?? 0 }])
    );
  }

  const items = rows.map<FormListItem>((r) => {
    const fmtDate = (d: unknown): string => {
      if (!d) return '';
      if (typeof d === 'string') return d;
      if (d instanceof Date) return d.toISOString().slice(0, 10);
      try {
        return new Date(String(d)).toISOString().slice(0, 10);
      } catch {
        return '';
      }
    };
    const fmtDateTime = (d: unknown): string => {
      if (!d) return new Date().toISOString();
      if (typeof d === 'string') return d;
      if (d instanceof Date) return d.toISOString();
      try {
        return new Date(String(d)).toISOString();
      } catch {
        return new Date().toISOString();
      }
    };
  const p = percentages[r.id] ?? { women: 0, men: 0, total: 0 };
  const denom = p.total && p.total > 0 ? p.total : p.women + p.men;
  const womenPercent = denom > 0 ? Math.round((p.women / denom) * 100) : 0;
  const menPercent = denom > 0 ? Math.round((p.men / denom) * 100) : 0;
    return {
      id: r.id,
      companyName: r.companyName ?? '',
      companyCode: r.companyCode,
      companyType: r.companyType ?? '',
      reportPeriodFrom: fmtDate(r.reportPeriodFrom),
      reportPeriodTo: fmtDate(r.reportPeriodTo),
      womenPercent,
      menPercent,
      requirementsApplied: r.requirementsApplied,
      submitterEmail: r.submitterEmail,
      submissionDate: fmtDateTime(r.submissionDate),
    };
  });

  return { page, pageSize, total: Number(count ?? 0), items };
}

export type FormDetails = FormListItem & { fields: Record<string, unknown> };

export async function getFormById(id: string): Promise<FormDetails | null> {
  const { getDb, submissions, genderBalanceRows } = await import('db');
  const db = getDb();
  // Load the main submission row
  const [row] = await db
    .select({
      id: submissions.id,
      companyCode: submissions.companyCode,
      companyName: submissions.nameAtSubmission,
      companyType: submissions.companyType,
      legalForm: submissions.legalForm,
      reportPeriodFrom: submissions.reportingFrom,
      reportPeriodTo: submissions.reportingTo,
      requirementsApplied: submissions.requirementsApplied,
      submitterEmail: submissions.contactEmail,
      submissionDate: submissions.createdAt,
      country: submissions.country,
      address: submissions.address,
      registry: submissions.registry,
      eDeliveryAddress: submissions.eDeliveryAddress,
      contactName: submissions.contactName,
      contactPhone: submissions.contactPhone,
      notes: submissions.notes,
      consent: submissions.consent,
      consentText: submissions.consentText,
      requirementsLink: submissions.requirementsLink,
    })
  .from(submissions)
  .where(eq(submissions.id, id) as unknown as SQL<unknown>);

  if (!row) return null;

  // Aggregate gender balance totals for percentages
  const agg = await db
    .select({
      women: sql<number>`sum(${genderBalanceRows.women})`,
      men: sql<number>`sum(${genderBalanceRows.men})`,
      total: sql<number>`sum(${genderBalanceRows.total})`,
    })
    .from(genderBalanceRows)
    .where(eq(genderBalanceRows.submissionId, id) as unknown as SQL<unknown>);

  const totals = agg?.[0] || { women: 0, men: 0, total: 0 };
  const denom = (totals.total ?? 0) > 0 ? (totals.total ?? 0) : (totals.women ?? 0) + (totals.men ?? 0);
  const womenPercent = denom > 0 ? Math.round(((totals.women ?? 0) / denom) * 100) : 0;
  const menPercent = denom > 0 ? Math.round(((totals.men ?? 0) / denom) * 100) : 0;

  // Load related collections
  const { submissionOrgans, submissionMeasures, attachments, submissionMeta } = await import('db');
  // Per-role gender rows
  const genderRows = await db
    .select()
    .from(genderBalanceRows)
    .where(eq(genderBalanceRows.submissionId, id) as unknown as SQL<unknown>);
  const organs = await db
    .select()
    .from(submissionOrgans)
    .where(eq(submissionOrgans.submissionId, id) as unknown as SQL<unknown>);
  const measures = await db
    .select()
    .from(submissionMeasures)
    .where(eq(submissionMeasures.submissionId, id) as unknown as SQL<unknown>);
  const attachmentsRows = await db
    .select()
    .from(attachments)
    .where(eq(attachments.submissionId, id) as unknown as SQL<unknown>);
  const metaRows = await db
    .select()
    .from(submissionMeta)
    .where(eq(submissionMeta.submissionId, id) as unknown as SQL<unknown>);

  const fmtDate = (d: unknown): string => {
    if (!d) return '';
    if (typeof d === 'string') return d.slice(0, 10);
    if (d instanceof Date) return d.toISOString().slice(0, 10);
    try {
      return new Date(String(d)).toISOString().slice(0, 10);
    } catch {
      return '';
    }
  };
  const fmtDateTime = (d: unknown): string => {
    if (!d) return new Date().toISOString();
    if (typeof d === 'string') return d;
    if (d instanceof Date) return d.toISOString();
    try {
      return new Date(String(d)).toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  return {
    id: row.id,
    companyName: row.companyName ?? '',
    companyCode: row.companyCode,
    companyType: row.companyType ?? '',
    reportPeriodFrom: fmtDate(row.reportPeriodFrom),
    reportPeriodTo: fmtDate(row.reportPeriodTo),
    womenPercent,
    menPercent,
    requirementsApplied: row.requirementsApplied,
    submitterEmail: row.submitterEmail,
    submissionDate: fmtDateTime(row.submissionDate),
    fields: {
      company: {
        code: row.companyCode,
        name: row.companyName,
        country: row.country,
        legalForm: row.legalForm,
        address: row.address,
        registry: row.registry,
        eDeliveryAddress: row.eDeliveryAddress,
      },
      contact: {
        name: row.contactName,
        email: row.submitterEmail,
        phone: row.contactPhone,
      },
      reportingPeriod: { from: fmtDate(row.reportPeriodFrom), to: fmtDate(row.reportPeriodTo) },
      consent: { consent: row.consent, consentText: row.consentText },
      requirements: { applied: row.requirementsApplied, link: row.requirementsLink },
      notes: row.notes,
  totals: { women: totals.women ?? 0, men: totals.men ?? 0 },
      genderBalance: genderRows,
      organs,
      measures,
      attachments: attachmentsRows,
      meta: metaRows?.[0] ?? null,
    },
  };
}
