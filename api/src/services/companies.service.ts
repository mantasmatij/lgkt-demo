import { and, desc, sql } from 'drizzle-orm';

export type CompanyListQuery = {
  page?: number;
  pageSize?: number;
  search?: string; // matches name or code (case-insensitive substring)
  sort?: 'name:desc';
  type?: string;
  registry?: string;
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
  if (query.registry) {
    whereClauses.push(sql`${companies.registry} = ${query.registry}`);
  }

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
  const { getDb, companies, submissions } = await import('db');
  const db = getDb();
  const offset = (Math.max(1, page) - 1) * pageSize;
  const items = await db
    .select({
      id: submissions.id,
      dateFrom: submissions.reportingFrom,
      dateTo: submissions.reportingTo,
      womenPercent: sql<number>`CASE WHEN ${submissions.reportingFrom} IS NULL THEN 0 ELSE 0 END`,
      menPercent: sql<number>`CASE WHEN ${submissions.reportingFrom} IS NULL THEN 0 ELSE 0 END`,
      requirementsApplied: submissions.requirementsApplied,
      submitterEmail: sql<string>`(SELECT ${companies.primaryContactEmail} FROM ${companies} WHERE ${companies.code} = ${submissions.companyCode})`,
      submittedAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(companies, sql`${companies.code} = ${submissions.companyCode}`)
    .where(sql`${companies.id} = ${companyId}`)
    .orderBy(desc(submissions.createdAt))
    .limit(pageSize)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(${submissions.id})::int` })
    .from(submissions)
    .innerJoin(companies, sql`${companies.code} = ${submissions.companyCode}`)
    .where(sql`${companies.id} = ${companyId}`);

  return { items, page, pageSize, total: count };
}
