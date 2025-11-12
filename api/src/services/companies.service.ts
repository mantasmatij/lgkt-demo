import { and, desc, sql } from 'drizzle-orm';

export type CompanyListQuery = {
  page?: number;
  pageSize?: number;
  search?: string; // matches name or code (case-insensitive substring)
  sort?: 'name:desc';
  type?: string;
};

export async function listCompanies(query: CompanyListQuery) {
  const { getDb, companies } = await import('db');
  const db = getDb();
  const page = Math.max(1, query.page ?? 1);
  const pageSize = [10, 25, 50].includes(query.pageSize ?? 25) ? (query.pageSize ?? 25) : 25;
  const offset = (page - 1) * pageSize;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClauses: any[] = [];
  if (query.search && query.search.trim()) {
    const q = `%${query.search.trim()}%`;
    whereClauses.push(sql`${companies.name} ILIKE ${q} OR ${companies.code} ILIKE ${q}`);
  }
  if (query.type) {
    whereClauses.push(sql`${companies.type} = ${query.type}`);
  }
  // registry filter removed per product decision

  const whereExpr = whereClauses.length ? and(...whereClauses) : undefined;

  const items = await db
    .select({
      id: companies.id,
      name: companies.name,
  code: companies.code,
  type: companies.type,
  address: companies.address,
      eDeliveryAddress: companies.eDeliveryAddress,
    })
    .from(companies)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .where(whereExpr as any)
    .orderBy(desc(companies.name))
    .limit(pageSize)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(${companies.id})::int` })
    .from(companies)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .where(whereExpr as any);

  return { items, page, pageSize, total: count };
}

export async function getCompanyDetail(companyId: string) {
  const { getDb, companies } = await import('db');
  const db = getDb();
  const [company] = await db
    .select({
      id: companies.id,
      name: companies.name,
  code: companies.code,
  type: companies.type,
  legalForm: companies.legalForm,
      address: companies.address,
      registry: companies.registry,
      eDeliveryAddress: companies.eDeliveryAddress,
    })
    .from(companies)
    .where(sql`${companies.id} = ${companyId}`)
    .limit(1);
  return company ?? null;
}

export async function listCompanySubmissions(companyId: string, page = 1, pageSize = 25) {
  const { getDb, companies, submissions, submissionMeta, genderBalanceRows } = await import('db');
  const db = getDb();
  const offset = (Math.max(1, page) - 1) * pageSize;
  const rawItems = await db
    .select({
      id: submissions.id,
      dateFrom: submissions.reportingFrom,
      dateTo: submissions.reportingTo,
      womenSum: sql<number>`COALESCE(SUM(${genderBalanceRows.women}), 0)`,
      menSum: sql<number>`COALESCE(SUM(${genderBalanceRows.men}), 0)`,
      requirementsApplied: submissions.requirementsApplied,
      submitterEmail: submissionMeta.submitterEmail,
      submittedAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(companies, sql`${companies.code} = ${submissions.companyCode}`)
    .leftJoin(submissionMeta, sql`${submissionMeta.submissionId} = ${submissions.id}`)
    .leftJoin(genderBalanceRows, sql`${genderBalanceRows.submissionId} = ${submissions.id}`)
    .where(sql`${companies.id} = ${companyId}`)
    .groupBy(
      submissions.id,
      submissions.reportingFrom,
      submissions.reportingTo,
      submissions.requirementsApplied,
      submissionMeta.submitterEmail,
      submissions.createdAt,
    )
    .orderBy(desc(submissions.createdAt))
    .limit(pageSize)
    .offset(offset);

  // Normalize dates to ISO strings and sanitize submitterEmail for Zod schema expectations
  const items = rawItems.map((r) => {
    const toIso = (v: unknown) => {
      if (!v) return null;
      if (typeof v === 'string') return v; // assume already date string like 'YYYY-MM-DD'
      if (v instanceof Date) return v.toISOString();
      try { const d = new Date(String(v)); return isNaN(+d) ? null : d.toISOString(); } catch { return null; }
    };
    const email = (r.submitterEmail && /[^@\s]+@[^@\s]+\.[^@\s]+/.test(r.submitterEmail)) ? r.submitterEmail : null;
    const women = Number(r.womenSum ?? 0);
    const men = Number(r.menSum ?? 0);
    const total = women + men;
    const womenPercent = total > 0 ? Math.round((women * 100) / total) : 0;
    const menPercent = total > 0 ? (100 - womenPercent) : 0;
    return {
      ...r,
      womenPercent,
      menPercent,
      dateFrom: toIso(r.dateFrom),
      dateTo: toIso(r.dateTo),
      submitterEmail: email,
      submittedAt: toIso(r.submittedAt) ?? new Date().toISOString(),
    };
  });

  const [{ count }] = await db
    .select({ count: sql<number>`count(${submissions.id})::int` })
    .from(submissions)
    .innerJoin(companies, sql`${companies.code} = ${submissions.companyCode}`)
    .where(sql`${companies.id} = ${companyId}`);

  return { items, page, pageSize, total: count };
}
