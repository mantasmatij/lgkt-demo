import { Router } from 'express';
import { getDb, submissions } from 'db';
import { desc, count } from 'drizzle-orm';
import { requireAuth } from '../../middleware/auth';

export const adminSubmissionsRouter = Router();

// All admin routes require authentication
adminSubmissionsRouter.use(requireAuth);

adminSubmissionsRouter.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const db = getDb();

    // Get total count
    const [totalResult] = await db.select({ count: count() }).from(submissions);
    const total = totalResult.count;

    // Get paginated submissions
    const items = await db
      .select({
        id: submissions.id,
        companyCode: submissions.companyCode,
        nameAtSubmission: submissions.nameAtSubmission,
        country: submissions.country,
        contactEmail: submissions.contactEmail,
        createdAt: submissions.createdAt,
      })
      .from(submissions)
      .orderBy(desc(submissions.createdAt))
      .limit(limit)
      .offset(offset);

    return res.json({
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return next(err);
  }
});
