import { z } from 'zod';

export const SortFieldEnum = z.enum([
  'submissionDate',
  'companyName',
  'companyCode',
  'reportPeriodFrom',
  'reportPeriodTo',
  'womenPercent',
  'menPercent',
]);

export const SortDirEnum = z.enum(['asc', 'desc']);

// Helpers: normalize query values coming from Express (string | string[] | undefined)
// - Accept empty strings, arrays with empties, 'undefined', 'NaN'
// - Fallback to undefined so defaults apply
const pickLastNonEmpty = (v: unknown): string | undefined => {
  if (v == null) return undefined;
  if (Array.isArray(v)) {
    for (let i = v.length - 1; i >= 0; i--) {
      const s = String(v[i] ?? '').trim();
      if (s !== '') return s;
    }
    return undefined;
  }
  const s = String(v).trim();
  return s === '' ? undefined : s;
};

const normalizePage = (raw: unknown): number | undefined => {
  const s = pickLastNonEmpty(raw);
  if (!s) return undefined;
  const n = parseInt(s, 10);
  if (!Number.isFinite(n) || n < 1) return undefined;
  return n;
};

const normalizePageSize = (raw: unknown): number | undefined => {
  const s = pickLastNonEmpty(raw);
  if (!s) return undefined;
  const n = parseInt(s, 10);
  const allowed = [10, 25, 50, 100];
  return allowed.includes(n) ? n : undefined;
};

export const ListQuerySchema = z.object({
  page: z.preprocess(normalizePage, z.number().int().min(1).default(1)),
  pageSize: z.preprocess(normalizePageSize, z.number().int().default(25)),
  sortBy: SortFieldEnum.default('submissionDate'),
  sortDir: SortDirEnum.default('desc'),
  company: z.string().trim().min(1).optional(),
  companyType: z.enum(['LISTED','STATE_OWNED','LARGE']).optional(),
  submissionDateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  submissionDateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  reportPeriodFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  reportPeriodTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  genderImbalance: z.literal('outside_33_67').optional(),
  genderAlignment: z.enum(['meets_33','not_meet_33']).optional(),
  requirementsApplied: z.enum(['yes','no']).optional(),
});

export const FormListItemSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  companyCode: z.string(),
  companyType: z.string(),
  reportPeriodFrom: z.string(),
  reportPeriodTo: z.string(),
  womenPercent: z.number().min(0).max(100),
  menPercent: z.number().min(0).max(100),
  requirementsApplied: z.boolean(),
  submitterEmail: z.string().email(),
  submissionDate: z.string(),
});

export const ListResponseSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int(),
  total: z.number().int().min(0),
  items: z.array(FormListItemSchema),
});

export type ListQuery = z.infer<typeof ListQuerySchema>;
export type FormListItem = z.infer<typeof FormListItemSchema>;
export type ListResponse = z.infer<typeof ListResponseSchema>;
