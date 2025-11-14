import { z } from 'zod';
import { CompanyListQuerySchema } from '../services/companies.schemas';

/**
 * Parse and normalize query params for the companies list endpoint using Zod schema.
 * Returns a typed object with validated values.
 */
export function parseCompanyListQuery(raw: unknown): z.infer<typeof CompanyListQuerySchema> {
  const parsed = CompanyListQuerySchema.parse(raw ?? {});
  return parsed;
}
