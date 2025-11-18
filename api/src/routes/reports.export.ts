import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { previewRequestSchema } from '../services/reportFilters.schemas';
import { fetchCompaniesReport } from '../services/reportCompanies.adapter';
import { fetchFormsReport } from '../services/reportForms.adapter';
import { buildCsv } from '../utils/csvExporter';
import { buildExportMetadata } from '../utils/exportMetadata';
import { checkLimits } from '../utils/exportLimits';
import { getReportDefinition } from '../utils/reportRegistry';

export const reportsExportRouter = Router();
reportsExportRouter.use(requireAuth);

reportsExportRouter.post('/export', async (req, res) => {
  const parse = previewRequestSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: parse.error.flatten() });
  }
  const { type, filters, sort } = parse.data;
  let result;
  if (type === 'companies-list') result = await fetchCompaniesReport({ filters, sort });
  else result = await fetchFormsReport({ filters, sort });

  const limitCheck = checkLimits(result.total);
  if (!limitCheck.withinLimits) {
    return res.status(413).json({ code: 'EXPORT_LIMIT_EXCEEDED', message: limitCheck.reason });
  }

  const metadata = buildExportMetadata({ filters });
  const csv = buildCsv({ columns: result.columns, rows: result.rows, metadata });
  const timestamp = new Date().toISOString().replace(/[:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const filename = `${type}_${timestamp}_full.csv`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
});
