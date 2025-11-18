import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getReportTypes } from '../utils/reportRegistry';

export const reportsTypesRouter = Router();
reportsTypesRouter.use(requireAuth);

reportsTypesRouter.get('/types', (_req, res) => {
  const types = getReportTypes();
  res.json({ types });
});
