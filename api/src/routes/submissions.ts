import { Router } from 'express';
import { submissionSchema } from 'validation';
import { createSubmissionTree } from 'db';
import { getUpload, deleteUpload } from '../services/uploadIndex';

export const submissionsRouter = Router();

submissionsRouter.post('/', async (req, res, next) => {
  const parse = submissionSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid request', details: parse.error.flatten() });
  }
  try {
    const input = parse.data;

    // Resolve attachments: convert FILE refs via uploadId to file metadata
    const attachments = (input.attachments || []).map((a) => {
      if (a.type === 'LINK') return a;
      const saved = getUpload(a.uploadId);
      if (!saved) {
        throw Object.assign(new Error('Attachment upload not found'), { statusCode: 400 });
      }
      return {
        type: 'FILE' as const,
        fileName: saved.fileName,
        fileSize: saved.fileSize,
        contentType: saved.contentType,
        storageKey: saved.storageKey,
      };
    });

    const tree = {
      submission: {
        companyCode: input.code,
        nameAtSubmission: input.name,
        country: input.country,
        legalForm: input.legalForm,
        address: input.address,
        registry: input.registry,
        eDeliveryAddress: input.eDeliveryAddress,
        reportingFrom: input.reportingFrom,
        reportingTo: input.reportingTo,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        notes: input.reasonsForUnderrepresentation ?? null,
        consent: input.consent,
        consentText: input.consentText,
        requirementsApplied: input.requirementsApplied,
        requirementsLink: input.requirementsLink ?? null,
      },
      organs: input.organs?.map((o) => ({
        organType: o.organType,
        lastElectionDate: o.lastElectionDate ?? null,
        plannedElectionDate: o.plannedElectionDate ?? null,
      })) || [],
      genderBalance: input.genderBalance,
      measures: input.measures,
      attachments,
      meta: {
        reasonsForUnderrepresentation: input.reasonsForUnderrepresentation ?? null,
        submitterName: input.submitter.name,
        submitterTitle: input.submitter.title ?? null,
        submitterPhone: input.submitter.phone,
        submitterEmail: input.submitter.email,
      },
    };

  await createSubmissionTree(tree);

    // Cleanup used uploadIds
    (input.attachments || []).forEach((a) => {
      if (a.type === 'FILE') deleteUpload(a.uploadId);
    });

    return res.status(201).json({ ok: true });
  } catch (err) {
    return next(err);
  }
});
