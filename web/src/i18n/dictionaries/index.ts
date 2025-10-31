import type { en as enDict } from './en';
import type { lt as ltDict } from './lt';
import { en } from './en';
import { lt } from './lt';

export type Locale = 'lt' | 'en';

export const dictionaries: Record<Locale, typeof enDict | typeof ltDict> = {
  lt,
  en,
};
