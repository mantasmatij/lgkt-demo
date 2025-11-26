import React from 'react';
import { useI18n } from '../../i18n/LocaleProvider';

export interface ReportTableProps {
  columns: string[];
  rows: string[][];
  isLoading?: boolean;
  emptyMessage?: string;
  permissionInfo?: string;
  reportType?: 'companies-list' | 'forms-list';
}

export function ReportTable({ columns, rows, isLoading, emptyMessage, permissionInfo }: ReportTableProps) {
  const { t, locale } = useI18n();
  const tadmin = t('admin');
  const tfields = t('fields');
  const effectiveEmpty = emptyMessage || tadmin('reports_no_data');
  const loadingLabel = tadmin('reports_loading_preview');
  const permissionLabel = permissionInfo || tadmin('reports_permission_note');

  // Map column keys to translations if possible
  // Map registry keys to translation keys
  const keyMap: Record<string, string> = {
    companyName: 'table_col_company_name',
    companyCode: 'table_col_code',
    companyType: 'table_col_type',
    legalForm: 'legal_form',
    address: 'address',
    registry: 'registry',
    eDeliveryAddress: 'e_delivery_address',
    reportPeriodFrom: 'table_col_report_from',
    reportPeriodTo: 'table_col_report_to',
    submissionDate: 'table_col_submission_date',
    womenPercent: 'table_col_women_pct',
    menPercent: 'table_col_men_pct',
    requirementsApplied: 'table_col_requirements_applied',
    submitterEmail: 'table_col_submitter_email',
  };
  const columnLabels = columns.map((key) => {
    const dictKey = keyMap[key] || key;
    // Try fields, then admin, then fallback to key
    const fieldLabel = tfields(dictKey as any);
    const adminLabel = tadmin(dictKey as any);
    return fieldLabel || adminLabel || dictKey;
  });
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
            {columnLabels.map((label, idx) => (
              <th key={columns[idx]} scope="col" className="px-4 py-3 text-left font-semibold bg-gray-50">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
              {r.map((cell, j) => {
                // Translate company type values
                if (columns[j] === 'companyType') {
                  let translated = cell;
                  if (cell === 'LISTED') translated = tfields('company_type_option_listed');
                  else if (cell === 'STATE_OWNED') translated = tfields('company_type_option_state_owned');
                  else if (cell === 'LARGE') translated = tfields('company_type_option_large');
                  return <td key={j} className="px-4 py-2 whitespace-nowrap">{translated}</td>;
                }
                return <td key={j} className="px-4 py-2 whitespace-nowrap">{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
