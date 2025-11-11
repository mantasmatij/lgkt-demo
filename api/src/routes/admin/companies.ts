import { Router } from 'express';
import { sql, desc } from 'drizzle-orm';
import { requireAuth } from '../../middleware/auth';

export const adminCompaniesRouter = Router();

// All admin routes require authentication
adminCompaniesRouter.use(requireAuth);

adminCompaniesRouter.get('/', async (req, res, next) => {
  try {
    const { getDb, companies, submissions } = await import('db');
    const db = getDb();

    // Aggregate submissions by company code
    // For each code, get: count, latest submission name, latest submission date
    const aggregated = await db
      .select({
        code: companies.code,
        name: companies.name,
        country: companies.country,
        submissionCount: sql<number>`count(${submissions.id})::int`,
        latestSubmission: sql<string>`max(${submissions.createdAt})`,
      })
      .from(companies)
      .leftJoin(submissions, sql`${companies.code} = ${submissions.companyCode}`)
      .groupBy(companies.code, companies.name, companies.country)
      .orderBy(desc(sql`max(${submissions.createdAt})`));

    return res.json({ items: aggregated });
  } catch (err) {
    return next(err);
  }
});
