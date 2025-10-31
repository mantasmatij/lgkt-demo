import { z } from 'zod';
import { zDateOnOrAfterMin } from './date';
import { isValidGenderTriplet } from './gender';
import { COMPANY_TYPE_VALUES } from '../constants/companyType';

// Contract: Local UI schema matching the updated form requirements (Feature 004)
// - Includes companyType
// - Section 12 reasons is required
// - All dates >= 1990-01-01
// - Reporting period From <= To
// - Gender totals equal women + men

export const organRowSchema = z.object({
  organType: z.enum(['VALDYBA', 'STEBETOJU_TARYBA']),
  lastElectionDate: zDateOnOrAfterMin.optional(),
  plannedElectionDate: zDateOnOrAfterMin.optional(),
});

export const genderBalanceRowSchema = z
  .object({
    role: z.enum(['CEO', 'BOARD', 'SUPERVISORY_BOARD']),
    women: z.number().int().min(0),
    men: z.number().int().min(0),
    total: z.number().int().min(0),
  })
  .refine(isValidGenderTriplet, {
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

export const companyFormSchema = z
  .object({
    // Company
    name: z.string().min(1),
    code: z.string().min(1),
  companyType: z.enum(COMPANY_TYPE_VALUES),
    legalForm: z.string().min(1),
    address: z.string().min(1),
    registry: z.string().min(1),
    eDeliveryAddress: z.string().min(1),

    // Reporting period
    reportingFrom: zDateOnOrAfterMin,
    reportingTo: zDateOnOrAfterMin,

    // Requirements & link
    requirementsApplied: z.boolean(),
    requirementsLink: z.string().url().optional(),

    // Organs & gender & measures
    organs: z.array(organRowSchema).default([]),
    genderBalance: z.array(genderBalanceRowSchema).min(1),
    measures: z.array(measureSchema).default([]),
    attachments: z.array(attachmentRefSchema).default([]),

    // Section 12 (required)
    reasonsForUnderrepresentation: z.string().min(1),

    // Consent & submitter
    consent: z.boolean().refine((v) => v, { message: 'Consent is required' }),
    consentText: z.string().min(1),
    submitter: submitterSchema,

    // Captcha
    captchaToken: z.string().min(1),
  })
  .refine((v) => v.reportingFrom <= v.reportingTo, {
    message: 'From date must be before or the same as To date',
    path: ['reportingTo'],
  });

export type CompanyFormInput = z.infer<typeof companyFormSchema>;
