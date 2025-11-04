import { z } from 'zod';
import { makeZDateOnOrAfterMin } from './date';
import { isValidGenderTriplet } from './gender';
import { COMPANY_TYPE_VALUES } from '../constants/companyType';

// Contract: Local UI schema matching the updated form requirements (Feature 004)
// - Includes companyType
// - Section 12 reasons is required
// - All dates >= 1990-01-01
// - Reporting period From <= To
// - Gender totals equal women + men

export type ValidationMessages = {
  required: string;
  email: string;
  url: string;
  dateMin: string;
  invalidDate?: string;
  dateOrder: string;
  consentRequired: string;
  genderTotalMismatch: string;
  phoneMin?: string;
};

export function makeCompanyFormSchema(messages: ValidationMessages) {
  const organRowSchema = z.object({
    organType: z.enum(['VALDYBA', 'STEBETOJU_TARYBA']),
    lastElectionDate: makeZDateOnOrAfterMin({ invalidDate: messages.invalidDate ?? 'Invalid date', dateMin: messages.dateMin }),
    plannedElectionDate: makeZDateOnOrAfterMin({ invalidDate: messages.invalidDate ?? 'Invalid date', dateMin: messages.dateMin }),
  });

  const genderBalanceRowSchema = z
    .object({
      role: z.enum(['CEO', 'BOARD', 'SUPERVISORY_BOARD']),
      women: z.number().int().min(0),
      men: z.number().int().min(0),
      total: z.number().int().min(0),
    })
    .refine(isValidGenderTriplet, {
      message: messages.genderTotalMismatch,
      path: ['total'],
    });

  const measureSchema = z.object({
    name: z.string().min(1, { message: messages.required }),
    plannedResult: z.string().min(1, { message: messages.required }),
    indicator: z.string().optional(),
    indicatorValue: z.string().optional(),
    indicatorUnit: z.string().optional(),
    year: z.string().optional(),
  });

  const attachmentLinkSchema = z.object({
    type: z.literal('LINK'),
    url: z.string().url(messages.url),
  });

  const attachmentFileRefSchema = z.object({
    type: z.literal('FILE'),
    uploadId: z.string().min(1, { message: messages.required }),
  });

  const attachmentRefSchema = z.union([attachmentLinkSchema, attachmentFileRefSchema]);

  const submitterSchema = z.object({
    name: z.string().min(1, { message: messages.required }),
    title: z.string().min(1, { message: messages.required }),
    phone: z.string().min(3, { message: messages.phoneMin ?? messages.required }),
    email: z.string().email({ message: messages.email }),
  });

  const schema = z
    .object({
      // Company
      name: z.string().min(1, { message: messages.required }),
      code: z.string().min(1, { message: messages.required }),
      companyType: z.enum(COMPANY_TYPE_VALUES),
      legalForm: z.string().min(1, { message: messages.required }),
      address: z.string().min(1, { message: messages.required }),
      registry: z.string().min(1, { message: messages.required }),
      eDeliveryAddress: z.string().min(1, { message: messages.required }),

      // Reporting period
  reportingFrom: makeZDateOnOrAfterMin({ invalidDate: messages.invalidDate ?? 'Invalid date', dateMin: messages.dateMin }),
  reportingTo: makeZDateOnOrAfterMin({ invalidDate: messages.invalidDate ?? 'Invalid date', dateMin: messages.dateMin }),

      // Requirements & link
      requirementsApplied: z.boolean(),
      requirementsLink: z.string().url(messages.url).optional(),

      // Organs & gender & measures
  organs: z.array(organRowSchema).min(1),
      genderBalance: z.array(genderBalanceRowSchema).min(1),
  measures: z.array(measureSchema).min(1),
      attachments: z.array(attachmentRefSchema).default([]),

      // Section 12 (required)
      reasonsForUnderrepresentation: z.string().min(1, { message: messages.required }),

      // Consent & submitter
      consent: z.boolean().refine((v) => v, { message: messages.consentRequired }),
      consentText: z.string().min(1, { message: messages.required }),
  submitter: submitterSchema,

      // Captcha
      captchaToken: z.string().min(1, { message: messages.required }),
    })
    .refine((v) => v.reportingFrom <= v.reportingTo, {
      message: messages.dateOrder,
      path: ['reportingTo'],
    });

  return schema;
}

export type CompanyFormInput = z.infer<ReturnType<typeof makeCompanyFormSchema>>;
