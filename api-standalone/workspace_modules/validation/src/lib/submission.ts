import { z } from 'zod';

export const organRowSchema = z.object({
  organType: z.enum(['VALDYBA', 'STEBETOJU_TARYBA']),
  lastElectionDate: z.string().date().optional(),
  plannedElectionDate: z.string().date().optional(),
});

export const genderBalanceRowSchema = z.object({
  role: z.enum(['CEO', 'BOARD', 'SUPERVISORY_BOARD']),
  women: z.number().int().min(0),
  men: z.number().int().min(0),
  total: z.number().int().min(0),
}).refine((v) => v.total === v.women + v.men, {
  message: 'Total must equal women + men',
  path: ['total'],
});

export const measureSchema = z.object({
  name: z.string().min(1),
  plannedResult: z.string().optional(),
  indicator: z.string().optional(),
  indicatorValue: z.string().optional(),
  indicatorUnit: z.string().optional(),
  year: z.string().optional(),
});

export const attachmentLinkSchema = z.object({
  type: z.literal('LINK'),
  url: z.string().url(),
});

export const attachmentFileRefSchema = z.object({
  type: z.literal('FILE'),
  uploadId: z.string().min(1),
});

export const attachmentRefSchema = z.union([attachmentLinkSchema, attachmentFileRefSchema]);

export const submitterSchema = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  phone: z.string().min(3),
  email: z.string().email(),
});

export const submissionSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  country: z.string().length(2),
  companyType: z.enum(['LISTED', 'STATE_OWNED', 'LARGE']),
  legalForm: z.string().min(1),
  address: z.string().min(1),
  registry: z.string().min(1),
  eDeliveryAddress: z.string().min(1),
  reportingFrom: z.string().date(),
  reportingTo: z.string().date(),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(3),
  requirementsApplied: z.boolean(),
  requirementsLink: z.string().url().optional(),
  organs: z.array(organRowSchema).default([]),
  genderBalance: z.array(genderBalanceRowSchema).min(1),
  measures: z.array(measureSchema).default([]),
  attachments: z.array(attachmentRefSchema).default([]),
  reasonsForUnderrepresentation: z.string().optional(),
  consent: z.boolean().refine((v) => v, { message: 'Consent is required' }),
  consentText: z.string().min(1),
  submitter: submitterSchema,
  captchaToken: z.string().min(1),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
