// Builds metadata object for CSV export
// Includes timestamp (UTC), timezone note, and applied filter summary.

export interface ExportMetadataInput {
  filters?: Record<string, unknown>;
  timezone?: string; // UI timezone label
}

export function buildExportMetadata(input: ExportMetadataInput): Record<string, string> {
  const meta: Record<string, string> = {};
  meta.exportedAt = new Date().toISOString();
  if (input.timezone) meta.timezone = input.timezone;
  if (input.filters) {
    const filterSummary = Object.entries(input.filters)
      .map(([k,v]) => `${k}=${serializeValue(v)}`)
      .join('|');
    if (filterSummary) meta.filters = filterSummary;
  }
  return meta;
}

function serializeValue(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
