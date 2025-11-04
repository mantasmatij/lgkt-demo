export type GenderTriplet = { women: number; men: number; total: number };

/** Validates that total equals women + men (non-negative integers). */
export function isValidGenderTriplet({ women, men, total }: GenderTriplet): boolean {
  if (!Number.isInteger(women) || !Number.isInteger(men) || !Number.isInteger(total)) return false;
  if (women < 0 || men < 0 || total < 0) return false;
  return total === women + men;
}
