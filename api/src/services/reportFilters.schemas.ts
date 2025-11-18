import { z } from 'zod';

// Zod filter schemas for Expand Reporting MVP
// Generic reusable definitions; can be extended when new report types added.

export const dateRangeFilterSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional()
}).refine(v => !v.from || !v.to || v.from <= v.to, {
  message: 'from must be before to'
});

export const companyFilterSchema = z.object({
  companyId: z.string().uuid().optional()
});

export const formFilterSchema = z.object({
  formId: z.string().uuid().optional()
});

export const sortSchema = z.object({
  column: z.string().optional(),
  direction: z.enum(['asc', 'desc']).optional()
});

export const previewRequestSchema = z.object({
  type: z.enum(['companies-list', 'forms-list']),
  filters: z.object({
    dateRange: dateRangeFilterSchema.optional(),
    company: companyFilterSchema.optional(),
    form: formFilterSchema.optional()
  }).optional(),
  sort: sortSchema.optional()
});

export type PreviewRequest = z.infer<typeof previewRequestSchema>;
