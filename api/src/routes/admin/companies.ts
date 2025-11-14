import { Router } from 'express';
import { ZodError } from 'zod';
import { requireAuth } from '../../middleware/auth';
import { getCompanyDetail, listCompanies, listCompanySubmissions, listAllowedCompanyValues } from '../../services/companies.service';
import { CompanyDetailSchema, CompanyListResponseSchema, CompanySubmissionsResponseSchema, CompaniesAllowedValuesSchema } from '../../services/companies.schemas';
import { parseCompanyListQuery } from '../../utils/query';

export const adminCompaniesRouter = Router();

// All admin routes require authentication
adminCompaniesRouter.use(requireAuth);

adminCompaniesRouter.get('/', async (req, res, next) => {
  try {
    // Use shared query parser (validated via Zod)
    const { page, pageSize, search, sort, type } = parseCompanyListQuery(req.query);
    const t0 = performance.now?.() ?? Date.now();
    const result = await listCompanies({ page, pageSize, search, sort, type });
    const t1 = performance.now?.() ?? Date.now();
    if (process.env.DEBUG_COMPANIES) {
      // Lightweight structured timing log
      console.log('[companies:list] query_ms', Math.round(t1 - t0), { page, pageSize, search, type, count: result.items.length });
    }
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
    const t0 = performance.now?.() ?? Date.now();
    const detail = await getCompanyDetail(id);
    const t1 = performance.now?.() ?? Date.now();
    if (process.env.DEBUG_COMPANIES) {
      console.log('[companies:detail] query_ms', Math.round(t1 - t0), { id, found: Boolean(detail) });
    }
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
    const t0 = performance.now?.() ?? Date.now();
    const result = await listCompanySubmissions(id, page, pageSize);
    const t1 = performance.now?.() ?? Date.now();
    if (process.env.DEBUG_COMPANIES) {
      console.log('[companies:submissions] query_ms', Math.round(t1 - t0), { id, page, pageSize, count: result.items.length });
    }
    try {
      const response = CompanySubmissionsResponseSchema.parse(result);
      return res.json(response);
    } catch (e) {
      if (e instanceof ZodError) {
        // Log validation issues to aid debugging; do not leak to client
        console.error('[companies/:id/submissions] Zod validation failed', {
          id,
          page,
          pageSize,
          issues: e.issues,
        });
      }
      throw e;
    }
  } catch (err) {
    return next(err);
  }
});

// GET /admin/companies/allowed-values - distinct type & registry values for filters (T053)
adminCompaniesRouter.get('/allowed-values', async (_req, res, next) => {
  try {
    const t0 = performance.now?.() ?? Date.now();
    const values = await listAllowedCompanyValues();
    const t1 = performance.now?.() ?? Date.now();
    if (process.env.DEBUG_COMPANIES) {
      console.log('[companies:allowed-values] query_ms', Math.round(t1 - t0), { typeCount: values.types.length, registryCount: values.registries.length });
    }
    const response = CompaniesAllowedValuesSchema.parse(values);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
});
