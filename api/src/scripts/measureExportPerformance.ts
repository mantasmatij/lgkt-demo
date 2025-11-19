/*
 * Manual performance measurement script (US3 T050).
 * Usage:
 *   ts-node api/src/scripts/measureExportPerformance.ts companies-list 25000
 * Measures time to build a synthetic CSV in-memory using existing utilities.
 */
import { buildCsv } from '../../utils/csvExporter';
import { estimateCsvSize, formatByteSize } from '../../utils/exportSizeEstimator';

function makeRows(rowCount: number, columns: string[]): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];
  for (let i = 0; i < rowCount; i++) {
    const r: Record<string, unknown> = {};
    for (const c of columns) r[c] = `${c}_${i}`;
    rows.push(r);
  }
  return rows;
}

async function main() {
  const type = process.argv[2] || 'companies-list';
  const rowCount = parseInt(process.argv[3] || '10000', 10);
  const columns = type === 'forms-list'
    ? ['id','name','status','created']
    : ['id','code','name','country','type'];
  const rows = makeRows(rowCount, columns);
  const est = estimateCsvSize({ rows: rowCount, columns, includeMetadata: true });
  console.log(`Type: ${type}`);
  console.log(`Rows: ${rowCount}`);
  console.log(`Estimated size: ${formatByteSize(est.estimatedBytes)} (exceeds limit? ${est.exceedsRowLimit})`);
  const start = process.hrtime.bigint();
  const csv = buildCsv({ columns, rows, metadata: { synthetic: 'true' } });
  const end = process.hrtime.bigint();
  const ms = Number(end - start) / 1_000_000;
  console.log(`Build time: ${ms.toFixed(2)} ms`);
  console.log(`Actual size: ${formatByteSize(Buffer.byteLength(csv, 'utf8'))}`);
}

main().catch(e => { console.error(e); process.exit(1); });
