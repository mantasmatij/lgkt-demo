import { z } from 'zod';
import { FormListItemSchema } from './list.schemas';

export const FormDetailsSchema = FormListItemSchema.extend({
  fields: z.record(z.any()),
});

export type FormDetails = z.infer<typeof FormDetailsSchema>;
