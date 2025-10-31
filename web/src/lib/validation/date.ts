import { z } from 'zod';

export const MIN_DATE_STR = '1990-01-01';

/** Returns true if the ISO date string is on or after 1990-01-01 */
export function isOnOrAfterMin(dateStr: string): boolean {
  // Safe for yyyy-mm-dd lexical comparison
  return dateStr >= MIN_DATE_STR;
}

export const zDateOnOrAfterMin = z
  .string()
  .date()
  .refine((v) => isOnOrAfterMin(v), {
    message: `Date must be on or after ${MIN_DATE_STR}`,
  });
