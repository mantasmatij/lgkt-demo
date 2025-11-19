/*
 * Manual performance measurement script (US3 T050/T058).
 * Usage:
 *   ts-node api/src/scripts/measureExportPerformance.ts --type companies-list --rows 25000
 *   ts-node api/src/scripts/measureExportPerformance.ts -t forms-list -r 15000
 *   ts-node api/src/scripts/measureExportPerformance.ts --help
 * Measures time to build a synthetic CSV in-memory using existing utilities.
 */
import { buildCsv } from '../utils/csvExporter';
import { estimateCsvSize, formatByteSize } from '../utils/exportSizeEstimator';

function makeRows(rowCount: number, columns: string[]): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];
  for (let i = 0; i < rowCount; i++) {
    const r: Record<string, unknown> = {};
    for (const c of columns) r[c] = `${c}_${i}`;
    rows.push(r);
  }
  return rows;
}

function parseArgs(argv: string[]) {
  const out: { type?: string; rows?: number; help?: boolean } = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--type' || a === '-t') out.type = argv[++i];
    else if (a === '--rows' || a === '-r') out.rows = Number(argv[++i]);
    else if (!out.type) out.type = a;
    else if (!out.rows) out.rows = Number(a);
  }
  return out;
}

function printHelp() {
  console.log('Usage:');
  console.log('  ts-node api/src/scripts/measureExportPerformance.ts --type companies-list --rows 25000');
  console.log('Options:');
  console.log('  -t, --type <id>   Report type (companies-list | forms-list)');
  console.log('  -r, --rows <n>    Number of synthetic rows (default 10000)');
  console.log('  -h, --help        Show this help');
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) { printHelp(); return; }
  const type = args.type || 'companies-list';
  const rowCount = Number.isFinite(args.rows) && (args.rows as number) > 0 ? (args.rows as number) : 10000;
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
