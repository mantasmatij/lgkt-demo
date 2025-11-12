import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { getCompanyDetail, listCompanies, listCompanySubmissions } from '../../services/companies.service';
import { CompanyDetailSchema, CompanyListResponseSchema, CompanySubmissionsResponseSchema } from '../../services/companies.schemas';
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

// GET /admin/companies/:id - company detail
adminCompaniesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const detail = await getCompanyDetail(id);
    if (!detail) return res.status(404).json({ message: 'Not found' });
    const response = CompanyDetailSchema.parse(detail);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});

// GET /admin/companies/:id/submissions - paged submissions
adminCompaniesRouter.get('/:id/submissions', async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const page = Number((req.query.page as string) ?? 1);
    const pageSize = Number((req.query.pageSize as string) ?? 25);
    const result = await listCompanySubmissions(id, page, pageSize);
    const response = CompanySubmissionsResponseSchema.parse(result);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});
