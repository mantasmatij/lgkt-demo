import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { previewRequestSchema } from '../services/reportFilters.schemas';
import { fetchCompaniesReport } from '../services/reportCompanies.adapter';
import { fetchFormsReport } from '../services/reportForms.adapter';
import { getReportDefinition } from '../utils/reportRegistry';

export const reportsPreviewRouter = Router();
reportsPreviewRouter.use(requireAuth);

reportsPreviewRouter.post('/preview', async (req, res) => {
  const parse = previewRequestSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: parse.error.flatten() });
  }
  const { type, filters, sort } = parse.data;
  let result;
  if (type === 'companies-list') result = await fetchCompaniesReport({ filters, sort });
  else result = await fetchFormsReport({ filters, sort });
  const def = getReportDefinition(type);
  const columns = def?.columns.map(c => c.label) || [];
  const rows = result.rows.map(r => result.columns.map(c => String(r[c] ?? '')));
  res.json({ columns, rows, total: result.total });
});
