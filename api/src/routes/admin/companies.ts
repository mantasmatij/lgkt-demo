import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { listCompanies } from '../../services/companies.service';
import { CompanyListResponseSchema } from '../../services/companies.schemas';
import { parseCompanyListQuery } from '../../utils/query';

export const adminCompaniesRouter = Router();

// All admin routes require authentication
adminCompaniesRouter.use(requireAuth);

adminCompaniesRouter.get('/', async (req, res, next) => {
  try {
    // Use shared query parser (validated via Zod)
    const { page, pageSize, search, sort, type } = parseCompanyListQuery(req.query);
    const result = await listCompanies({ page, pageSize, search, sort, type });
    // Validate response shape before returning (helps keep API contract stable)
    const response = CompanyListResponseSchema.parse(result);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});
