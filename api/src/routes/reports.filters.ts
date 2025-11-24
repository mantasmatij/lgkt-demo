import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getReportDefinition } from '../utils/reportRegistry';

export const reportsFiltersRouter = Router();
reportsFiltersRouter.use(requireAuth);

reportsFiltersRouter.get('/filters', (req, res) => {
  const type = req.query.type as string;
  if (!type) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'type query param required' });
  const def = getReportDefinition(type as any);
  if (!def) return res.status(404).json({ code: 'NOT_FOUND', message: 'Unknown report type' });
  res.json({ filters: def.filters });
});
