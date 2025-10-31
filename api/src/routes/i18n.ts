import { Router } from 'express';
import { z } from 'zod';
import { csrfCheck } from '../middleware/csrf';
import { getLocale, setLocale, type Locale } from '../middleware/locale';

export const i18nRouter = Router();

// GET /api/i18n/locale -> { locale: 'lt' | 'en' }
i18nRouter.get('/locale', (req, res) => {
  const locale = getLocale(req);
  return res.status(200).json({ locale });
});

// POST /api/i18n/locale { locale } -> 204
const BodySchema = z.object({
  locale: z.union([z.literal('lt'), z.literal('en')]),
});

i18nRouter.post('/locale', csrfCheck, (req, res) => {
  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: 'INVALID_BODY', message: 'Invalid locale', issues: parsed.error.issues });
  }
  const desired = parsed.data.locale as Locale;
  setLocale(req, res, desired);
  return res.status(204).send();
});
