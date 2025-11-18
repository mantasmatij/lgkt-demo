// Export limits and helpers

export const ROW_LIMIT = 50000; // Hard row cap
export const SIZE_LIMIT_BYTES = 25 * 1024 * 1024; // Approx 25MB guidance threshold

export interface LimitCheckResult {
  withinLimits: boolean;
  reason?: string;
}

export function checkLimits(rowCount: number, estimatedSizeBytes?: number): LimitCheckResult {
  if (rowCount > ROW_LIMIT) {
    return { withinLimits: false, reason: `Row count ${rowCount} exceeds limit ${ROW_LIMIT}` };
  }
  if (estimatedSizeBytes !== undefined && estimatedSizeBytes > SIZE_LIMIT_BYTES) {
    return { withinLimits: false, reason: `Estimated size ${(estimatedSizeBytes/1024/1024).toFixed(2)}MB exceeds ${(SIZE_LIMIT_BYTES/1024/1024)}MB limit` };
  }
  return { withinLimits: true };
}
