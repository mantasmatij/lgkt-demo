import { Router } from 'express';
import { submissionSchema } from 'validation';

export const submissionsRouter = Router();

submissionsRouter.post('/', (req, res) => {
  const parse = submissionSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid request', details: parse.error.flatten() });
  }

  // TODO: Persist submission and child rows using drizzle (T027)
  // TODO: Resolve uploadId references into attachments (T027a)

  return res.status(201).json({ ok: true });
});
