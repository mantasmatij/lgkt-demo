import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { normalizePage, normalizePageSize } from '../../utils/pagination';
import { listCompanies } from '../../services/companies.service';

export const adminCompaniesRouter = Router();

// All admin routes require authentication
adminCompaniesRouter.use(requireAuth);

adminCompaniesRouter.get('/', async (req, res, next) => {
  try {
    const page = normalizePage(Number(req.query.page));
    const pageSize = normalizePageSize(Number(req.query.pageSize));
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const type = typeof req.query.type === 'string' ? req.query.type : undefined;
    const registry = typeof req.query.registry === 'string' ? req.query.registry : undefined;

    const result = await listCompanies({ page, pageSize, search, sort: 'name:desc', type, registry });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});
