import { checkLimits, ROW_LIMIT, SIZE_LIMIT_BYTES } from '../exportLimits';

describe('exportLimits', () => {
  it('passes within limits', () => {
    const res = checkLimits(10, 1000);
    expect(res.withinLimits).toBe(true);
  });

  it('fails when row count exceeds limit', () => {
    const res = checkLimits(ROW_LIMIT + 1, 1000);
    expect(res.withinLimits).toBe(false);
    expect(res.reason).toMatch(String(ROW_LIMIT));
  });

  it('fails when estimated size exceeds limit', () => {
    const res = checkLimits(10, SIZE_LIMIT_BYTES + 1);
    expect(res.withinLimits).toBe(false);
    expect(res.reason).toMatch(/exceeds/);
  });

  it('ignores size check when undefined', () => {
    const res = checkLimits(10);
    expect(res.withinLimits).toBe(true);
  });
});
