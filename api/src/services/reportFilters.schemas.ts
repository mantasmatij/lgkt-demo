import { z } from 'zod';

// Zod filter schemas for Expand Reporting MVP
// Generic reusable definitions; can be extended when new report types added.

// Accept date-only strings (YYYY-MM-DD) as used by the web UI
export const dateRangeFilterSchema = z.object({
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/,{ message: 'from must be YYYY-MM-DD' })
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/,{ message: 'to must be YYYY-MM-DD' })
    .optional()
}).refine(v => {
  if (!v.from || !v.to) return true;
  // Compare as dates to avoid lexical pitfalls
  const f = new Date(v.from);
  const t = new Date(v.to);
  return f.getTime() <= t.getTime();
}, { message: 'from must be before to' });

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
