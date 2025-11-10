"use client";
import { useI18n } from '../../i18n/LocaleProvider';
import { COMPANY_TYPE_LABEL_KEYS, isCompanyType, CompanyType } from '../../lib/constants/companyType';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

type Props = {
  items: Array<{
    id: string;
    companyName: string;
    companyCode: string;
    companyType: string;
    reportPeriodFrom: string;
    reportPeriodTo: string;
    womenPercent: number;
    menPercent: number;
    requirementsApplied: boolean;
    submitterEmail: string;
    submissionDate: string;
  }>;
  baseQuery?: string;
};

function formatDate(dateIso: string): string {
  // Always output YYYY-MM-DD
  try {
    const d = new Date(dateIso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

function formatDateTime(dateIso: string): string {
  try {
    const d = new Date(dateIso);
    if (Number.isNaN(d.getTime())) return '';
    // 24h HH:MM, local time, with zero padding
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}`;
  } catch {
    return '';
  }
}

export function FormsTable({ items, baseQuery = '' }: Props) {
  const { t } = useI18n();
  const tadmin = t('admin');
  const tcommon = t('common');
  const tfields = t('fields') as unknown as (key: string) => string;
  const router = useRouter();
  const onRowClick = useCallback((id: string) => {
    router.push(`/admin/forms/${id}${baseQuery}`);
  }, [router, baseQuery]);
  if (!items.length) {
    return <p className="text-gray-600">{tadmin('table_no_items')}</p>;
  }
  return (
    <div className="overflow-x-auto border-2 border-gray-300 rounded">
      <table className="min-w-full border-collapse">
        <caption className="sr-only">{tadmin('table_caption')}</caption>
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_company_name')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_code')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_type')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_report_from')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_report_to')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_women_pct')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_men_pct')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_requirements_applied')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_submitter_email')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_submission_date')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((f) => (
            <tr
              key={f.id}
              onClick={() => onRowClick(f.id)}
              className="border-b last:border-b-0 border-gray-200 cursor-pointer hover:bg-blue-50 focus-within:bg-blue-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              tabIndex={0}
              aria-label={`Open details for ${f.companyName}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(f.id); } }}
            >
              <td className="py-2 pr-4">
                <span className="text-blue-700 font-medium underline-offset-2 hover:underline" role="link">{f.companyName}</span>
              </td>
              <td className="py-2 pr-4">{f.companyCode}</td>
              <td className="py-2 pr-4">{isCompanyType(f.companyType) ? tfields(COMPANY_TYPE_LABEL_KEYS[f.companyType as CompanyType]) : f.companyType}</td>
              <td className="py-2 pr-4">{formatDate(f.reportPeriodFrom)}</td>
              <td className="py-2 pr-4">{formatDate(f.reportPeriodTo)}</td>
              <td className="py-2 pr-4">{f.womenPercent}</td>
              <td className="py-2 pr-4">{f.menPercent}</td>
              <td className="py-2 pr-4">{f.requirementsApplied ? tcommon('yes') : tcommon('no')}</td>
              <td className="py-2 pr-4">{f.submitterEmail}</td>
              <td className="py-2 pr-4">{formatDateTime(f.submissionDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
