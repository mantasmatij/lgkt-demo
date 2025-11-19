// Export size estimation utility (US3 T043)
// Provides a rough byte size estimate for a CSV export given row count, column count,
// average cell length heuristic, plus metadata/header overhead.

export interface SizeEstimateInput {
  rows: number; // number of data rows (excluding metadata + header)
  columns: string[]; // column keys (used for header length)
  averageCellLength?: number; // heuristic average characters per cell (default 12)
  includeMetadata?: boolean; // whether a metadata row is prepended
}

export interface SizeEstimateResult {
  estimatedBytes: number;
  exceedsRowLimit: boolean;
  projectedRows: number;
}

// Hard row cap aligned with exportLimits constant (duplicated to avoid circular import).
const ROW_LIMIT = 50_000;

export function estimateCsvSize(input: SizeEstimateInput): SizeEstimateResult {
  const avg = Math.max(1, Math.floor(input.averageCellLength ?? 12));
  const { rows, columns } = input;
  const colCount = columns.length;
  // Rough per-cell overhead: quotes + possible comma/newline ~2 chars
  const perCell = avg + 2;
  // Per row bytes ~ colCount * perCell + newline
  const perRow = colCount * perCell + 1;
  const headerBytes = columns.join(',').length + 5; // header + BOM + newline buffer
  const metadataBytes = input.includeMetadata ? 40 : 0; // conservative small metadata row
  const dataBytes = rows * perRow;
  const estimatedBytes = headerBytes + metadataBytes + dataBytes;
  return {
    estimatedBytes,
    exceedsRowLimit: rows > ROW_LIMIT,
    projectedRows: rows,
  };
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}
