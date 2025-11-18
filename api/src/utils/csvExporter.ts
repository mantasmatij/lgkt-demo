import { Readable } from 'stream';

// CSV Export utility (UTF-8 BOM, quoting rules, metadata row support)
// Simplified for MVP; large exports handled synchronously within limits.

const UTF8_BOM = '\uFEFF';

export interface CsvExportOptions {
  columns: string[]; // ordered column keys
  rows: Array<Record<string, unknown>>;
  metadata?: Record<string, string | number | boolean | undefined>;
}

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  let str = String(value);
  const needsQuote = /[",\n]/.test(str);
  // Escape quotes by doubling them
  str = str.replace(/"/g, '""');
  return needsQuote ? `"${str}"` : str;
}

export function buildCsv(opts: CsvExportOptions): string {
  const lines: string[] = [];
  if (opts.metadata && Object.keys(opts.metadata).length > 0) {
    const metaPairs = Object.entries(opts.metadata)
      .map(([k,v]) => `${k}=${v}`);
    lines.push('# ' + metaPairs.join('; '));
  }
  // Header
  lines.push(opts.columns.map(c => escapeCell(c)).join(','));
  // Rows
  for (const row of opts.rows) {
    const cells = opts.columns.map(col => escapeCell(row[col]));
    lines.push(cells.join(','));
  }
  return UTF8_BOM + lines.join('\n');
}

export function buildCsvStream(opts: CsvExportOptions): Readable {
  const csv = buildCsv(opts);
  return Readable.from(csv);
}
