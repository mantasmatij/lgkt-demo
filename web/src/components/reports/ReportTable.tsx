import React from 'react';

export interface ReportTableProps {
  columns: string[];
  rows: string[][];
  isLoading?: boolean;
  emptyMessage?: string;
  permissionInfo?: string;
}

export function ReportTable({ columns, rows, isLoading, emptyMessage = 'No data', permissionInfo }: ReportTableProps) {
  if (isLoading) {
    return <div role="status" aria-busy="true" className="text-sm">Loading preview…</div>;
  }
  if (!rows.length) {
    return <div className="text-sm text-gray-600" role="note">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-auto border rounded-md">
      <div className="px-1 py-2 text-xs text-gray-500" role="note">
        {permissionInfo ?? 'Note: Export and preview reflect your permissions.'}
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c} scope="col" className="px-3 py-2 text-left font-medium bg-gray-50">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
              {r.map((cell,j) => (
                <td key={j} className="px-3 py-1 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
