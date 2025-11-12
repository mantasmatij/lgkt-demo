import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { listCompanies } from '../../services/companies.service';
import { CompanyListQuerySchema, CompanyListResponseSchema } from '../../services/companies.schemas';

export const adminCompaniesRouter = Router();

// All admin routes require authentication
adminCompaniesRouter.use(requireAuth);

adminCompaniesRouter.get('/', async (req, res, next) => {
  try {
    const parsed = CompanyListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid query parameters', issues: parsed.error.issues });
    }

  const { page, pageSize, search, sort, type } = parsed.data;
  const result = await listCompanies({ page, pageSize, search, sort, type });
    // Validate response shape before returning (helps keep API contract stable)
    const response = CompanyListResponseSchema.parse(result);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});
