import { z } from 'zod';

export const MIN_DATE_STR = '1990-01-01';

/** Returns true if the ISO date string is on or after 1990-01-01 */
export function isOnOrAfterMin(dateStr: string): boolean {
  // Safe for yyyy-mm-dd lexical comparison
  return dateStr >= MIN_DATE_STR;
}

/**
 * Factory: returns a Zod string schema that validates an ISO date and enforces >= MIN_DATE_STR with a localized message.
 */
export function makeZDateOnOrAfterMin(message: string) {
  return z
    .string()
    .date()
    .refine((v) => isOnOrAfterMin(v), {
      message,
    });
}
