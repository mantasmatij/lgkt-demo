import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '../../middleware/authAdmin';
import { z } from 'zod';
import { getFormById } from '../../services/formsService';
import { eq, and, type SQL } from 'drizzle-orm';

export const adminFormDetailsRouter = Router();

adminFormDetailsRouter.use(requireAdmin);

adminFormDetailsRouter.get('/:id', async (req, res) => {
  const idSchema = z.object({ id: z.string().min(1) });
  const parse = idSchema.safeParse(req.params);
  if (!parse.success) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid id parameter' });
  }
  const data = await getFormById(parse.data.id);
  if (!data) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Form not found' });
  }
  return res.json(data);
});

// Download an attachment for a given form (admin-only)
adminFormDetailsRouter.get('/:id/attachments/:attachmentId', async (req, res) => {
  const paramsSchema = z.object({ id: z.string().min(1), attachmentId: z.string().min(1) });
  const parse = paramsSchema.safeParse(req.params);
  if (!parse.success) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid parameters' });
  }
  const { id, attachmentId } = parse.data;
  const { getDb, attachments: attachmentsTable } = await import('db');
  const db = getDb();
  const rows = await db
    .select()
    .from(attachmentsTable)
    .where(
      and(
        eq(attachmentsTable.id, attachmentId) as unknown as SQL<unknown>,
        eq(attachmentsTable.submissionId, id) as unknown as SQL<unknown>
      ) as unknown as SQL<unknown>
    );
  const att = rows?.[0];
  if (!att) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Attachment not found' });
  }
  if (att.type !== 'FILE' || !att.storageKey) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Attachment is not a file' });
  }
  try {
    // Stream the file from local storage
    const stat = await fs.promises.stat(att.storageKey);
    res.setHeader('Content-Type', att.contentType || 'application/octet-stream');
    res.setHeader('Content-Length', String(stat.size));
    const safeName = att.fileName || path.basename(att.storageKey);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeName)}"`);
    const stream = fs.createReadStream(att.storageKey);
    stream.on('error', () => {
      res.status(404).end();
    });
    stream.pipe(res);
  } catch {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'File not found' });
  }
});
