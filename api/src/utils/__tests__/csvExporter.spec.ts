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

  it('omits metadata row when metadata empty', () => {
    const csv = buildCsv({ columns: ['a'], rows: [] });
    const firstLine = csv.split('\n')[0];
    // First line should be BOM + header, not metadata comment
    expect(firstLine.startsWith('\uFEFF#')).toBe(false);
    expect(firstLine).toContain('a');
  });

  it('handles newlines in cell by quoting', () => {
    const csv = buildCsv({ columns: ['text'], rows: [{ text: 'Line1\nLine2' }] });
    const lines = csv.split('\n');
    expect(lines[1]).toMatch(/"Line1\nLine2"/);
  });

  it('double quotes existing quotes in cell', () => {
    const csv = buildCsv({ columns: ['q'], rows: [{ q: 'He said "Hi"' }] });
    const line = csv.split('\n')[1];
    expect(line).toBe('"He said ""Hi"""');
  });
});
