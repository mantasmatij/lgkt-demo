import type { Response } from 'express';
import { stringify } from 'csv-stringify';

export type CsvRow = Record<string, string | number | boolean | null | undefined>;

export function streamCsv(res: Response, headers: string[], rows: CsvRow[]) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');

  const stringifier = stringify({ header: true, columns: headers });
  stringifier.on('error', (err) => {
    console.error('CSV stream error', err);
    if (!res.headersSent) {
      res.status(500);
    }
    res.end();
  });

  stringifier.pipe(res);
  for (const row of rows) {
    stringifier.write(row);
  }
  stringifier.end();
}
