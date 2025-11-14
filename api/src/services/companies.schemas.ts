import { z } from 'zod';

export const CompanyListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().refine((v) => [10, 25, 50].includes(v), {
    message: 'pageSize must be one of 10, 25, 50',
  }).default(25).optional(),
  search: z.string().max(100).trim().optional(),
  sort: z.literal('name:desc').default('name:desc').optional(),
  type: z.string().trim().optional(),
  // registry removed per updated product decision
});

export const CompanyListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  type: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  eDeliveryAddress: z.string().nullable().optional(),
});

export const CompanyListResponseSchema = z.object({
  items: z.array(CompanyListItemSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int(),
  total: z.number().int().nonnegative(),
});

export const CompanyDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  type: z.string().nullable().optional(),
  legalForm: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  registry: z.string().nullable().optional(),
  eDeliveryAddress: z.string().nullable().optional(),
});

export const CompanySubmissionSchema = z.object({
  id: z.string().uuid(),
  dateFrom: z.string().nullable().optional(),
  dateTo: z.string().nullable().optional(),
  womenPercent: z.number(),
  menPercent: z.number(),
  requirementsApplied: z.boolean(),
  submitterEmail: z.string().email().nullable().optional(),
  submittedAt: z.string(),
});

export const CompanySubmissionsResponseSchema = z.object({
  items: z.array(CompanySubmissionSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int(),
  total: z.number().int().nonnegative(),
});

export const CompaniesAllowedValuesSchema = z.object({
  types: z.array(z.string()),
  registries: z.array(z.string()),
});
