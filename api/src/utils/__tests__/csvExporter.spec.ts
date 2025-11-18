import { buildCsv } from '../csvExporter';

describe('csvExporter', () => {
  it('includes BOM and headers', () => {
    const csv = buildCsv({ columns: ['id', 'name'], rows: [], metadata: { exportedAt: 'test' } });
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('id,name');
  });

  it('quotes cells with commas or quotes', () => {
    const csv = buildCsv({ columns: ['val'], rows: [{ val: 'Hello, "World"' }] });
    const line = csv.split('\n')[1];
    expect(line).toMatch(/"Hello, ""World"""/);
  });

  it('renders metadata row when provided', () => {
    const csv = buildCsv({ columns: ['a'], rows: [], metadata: { filters: 'x=1' } });
    const firstLine = csv.split('\n')[0];
    expect(firstLine.startsWith('\uFEFF#')).toBe(true); // BOM + metadata line
    expect(firstLine).toContain('filters=x=1');
  });
});
