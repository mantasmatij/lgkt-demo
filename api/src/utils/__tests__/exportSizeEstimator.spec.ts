import { estimateCsvSize, formatByteSize } from '../exportSizeEstimator';

describe('exportSizeEstimator', () => {
  it('estimates size and flags row limit exceed', () => {
    const res = estimateCsvSize({ rows: 60_000, columns: ['a','b','c'] });
    expect(res.exceedsRowLimit).toBe(true);
    expect(res.projectedRows).toBe(60_000);
    expect(res.estimatedBytes).toBeGreaterThan(0);
  });

  it('handles small exports within limits', () => {
    const res = estimateCsvSize({ rows: 100, columns: ['id','name'], averageCellLength: 10, includeMetadata: true });
    expect(res.exceedsRowLimit).toBe(false);
    expect(formatByteSize(res.estimatedBytes)).toMatch(/B|KB/);
  });
});
