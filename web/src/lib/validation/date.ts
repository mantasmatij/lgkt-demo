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
export function makeZDateOnOrAfterMin(messages: { invalidDate: string; dateMin: string }) {
  return z.string().superRefine((v, ctx) => {
    // Expect exactly YYYY-MM-DD
    const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(v);
    if (!isIsoDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: messages.invalidDate });
      return;
    }
    if (!isOnOrAfterMin(v)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: messages.dateMin });
    }
  });
}
