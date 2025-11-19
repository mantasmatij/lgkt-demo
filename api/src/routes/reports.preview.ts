import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { previewRequestSchema } from '../services/reportFilters.schemas';
import { fetchCompaniesReport } from '../services/reportCompanies.adapter';
import { fetchFormsReport } from '../services/reportForms.adapter';
import { getReportDefinition } from '../utils/reportRegistry';
import { allowedColumnKeys } from '../utils/permissions/reportPermissions';

export const reportsPreviewRouter = Router();
reportsPreviewRouter.use(requireAuth);

reportsPreviewRouter.post('/preview', async (req, res) => {
  const parse = previewRequestSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: parse.error.flatten() });
  }
  const { type, filters, sort } = parse.data;
  const def = getReportDefinition(type);
  const allKeys = def?.columns.map(c => c.key) || [];
  const user = req.session?.user ? { id: req.session.user.id, roles: [req.session.user.role] } : { id: 'anon', roles: [] };
  const allowed = allowedColumnKeys(type, user, allKeys);
  let result;
  if (type === 'companies-list') result = await fetchCompaniesReport({ filters, sort, allowedKeys: allowed });
  else result = await fetchFormsReport({ filters, sort, allowedKeys: allowed });
  const labelByKey = new Map<string, string>((def?.columns || []).map(c => [c.key, c.label]));
  const columns = result.columns.map(k => labelByKey.get(k) || k);
  const rows = result.rows.map(r => result.columns.map(c => String(r[c] ?? '')));
  res.json({ columns, rows, total: result.total });
});
