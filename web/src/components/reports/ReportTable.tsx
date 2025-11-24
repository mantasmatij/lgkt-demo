import React from 'react';
import { useI18n } from '../../i18n/LocaleProvider';

export interface ReportTableProps {
  columns: string[];
  rows: string[][];
  isLoading?: boolean;
  emptyMessage?: string;
  permissionInfo?: string;
}

export function ReportTable({ columns, rows, isLoading, emptyMessage, permissionInfo }: ReportTableProps) {
  const { t } = useI18n();
  const tadmin = t('admin');
  const effectiveEmpty = emptyMessage || tadmin('reports_no_data');
  const loadingLabel = tadmin('reports_loading_preview');
  const permissionLabel = permissionInfo || tadmin('reports_permission_note');
  if (isLoading) {
    return <div role="status" aria-busy="true" className="text-base">{loadingLabel}</div>;
  }
  if (!rows.length) {
    return <div className="text-base text-gray-600" role="note">{effectiveEmpty}</div>;
  }
  return (
    <div className="overflow-auto border-2 rounded-lg">
      <div id="report-permission-note" className="px-2 py-3 text-sm text-gray-600" role="note">
        {permissionLabel}
      </div>
      <table className="min-w-full text-base" aria-describedby="report-permission-note">
        <caption className="sr-only">{tadmin('reports_preview_table_caption')}</caption>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c} scope="col" className="px-4 py-3 text-left font-semibold bg-gray-50">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
              {r.map((cell,j) => (
                <td key={j} className="px-4 py-2 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
