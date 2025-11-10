import { Router } from 'express';
import { requireAdmin } from '../../middleware/authAdmin';
import { getForms } from '../../services/formsService';
import type { ListQuery } from '../../services/formsService';
import { ListQuerySchema } from 'validation';

export const adminFormsRouter = Router();

// All routes require admin
adminFormsRouter.use(requireAdmin);

adminFormsRouter.get('/', async (req, res) => {
  const parse = ListQuerySchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid query parameters', issues: parse.error.issues });
  }
  const result = await getForms(parse.data as unknown as ListQuery);
  return res.json(result);
});
