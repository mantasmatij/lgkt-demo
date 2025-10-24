import { Router } from 'express';
import { submissionSchema } from 'validation';
import { createSubmissionTree, upsertCompany } from 'db';
import { getUpload, deleteUpload } from '../services/uploadIndex';
import { getCaptchaVerifier } from '../services/captcha';
import { submissionLimiter } from '../middleware/rateLimit';

export const submissionsRouter = Router();

submissionsRouter.post('/', submissionLimiter, async (req, res, next) => {
  const parse = submissionSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid request', details: parse.error.flatten() });
  }
  try {
    const input = parse.data;

    // Verify CAPTCHA
    const verifier = getCaptchaVerifier();
    const captchaResult = await verifier.verify(input.captchaToken);
    if (!captchaResult.success) {
      return res.status(400).json({
        code: 'CAPTCHA_FAILED',
        message: captchaResult.reason || 'CAPTCHA verification failed',
      });
    }

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

    // Upsert company record (update with latest submission data)
    await upsertCompany({
      code: input.code,
      name: input.name,
      country: input.country,
      legalForm: input.legalForm,
      address: input.address,
      registry: input.registry,
      eDeliveryAddress: input.eDeliveryAddress,
      primaryContactName: input.contactName,
      primaryContactEmail: input.contactEmail,
      primaryContactPhone: input.contactPhone,
    });

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
