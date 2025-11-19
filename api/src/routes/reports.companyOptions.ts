import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

export const reportsCompanyOptionsRouter = Router();
reportsCompanyOptionsRouter.use(requireAuth);

// GET /api/reports/company-options?query=ABC
// Returns up to 50 company options filtered by company code (ILIKE %query%)
// Shape: { options: Array<{ value: string; label: string }> }
reportsCompanyOptionsRouter.get('/company-options', async (req, res, next) => {
  try {
    const q = String(req.query.query || '').trim();
    const { getDb, companies } = await import('db');
    const db = getDb();
    // Basic safety: require at least 1 char to search; otherwise limit to first page by code
    const like = q ? `%${q}%` : '%';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await db
      .select({ name: companies.name, code: companies.code })
      .from(companies)
      .where(q ? (await import('drizzle-orm')).sql`${companies.code} ILIKE ${like}` : undefined as any)
      .orderBy(companies.code)
      .limit(50);

    const options = rows.map(r => ({
      value: String(r.code),
      label: `${String(r.name)} | ${String(r.code)}|`,
    }));
    return res.json({ options });
  } catch (err) {
    return next(err);
  }
});
