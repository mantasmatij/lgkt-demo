'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDateISO, formatDateTimeISO } from '../../../lib/utils/format';

interface SubmissionItem {
  id: string;
  dateFrom?: string | null;
  dateTo?: string | null;
  womenPercent: number;
  menPercent: number;
  requirementsApplied: boolean;
  submitterEmail?: string | null;
  submittedAt: string;
}

interface CompanySubmissionsTableProps {
  companyId: string;
  items: SubmissionItem[];
  dict: any; // dictionary object with admin/common fields
}

export function CompanySubmissionsTable({ companyId, items, dict }: CompanySubmissionsTableProps) {
  const router = useRouter();
  const tadmin = (k: keyof typeof dict.admin) => dict.admin[k];
  const tcommon = (k: keyof typeof dict.common) => dict.common[k];
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-gray-300">
      <table className="min-w-full border-separate border-spacing-0">
        <caption className="sr-only">{tadmin('submissions_table_aria')}</caption>
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th scope="col" className="py-2 pr-4 pl-6">{tadmin('table_col_report_from')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_report_to')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_women_pct')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_men_pct')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_requirements_applied')}</th>
            <th scope="col" className="py-2 pr-4">{tadmin('table_col_submitter_email')}</th>
            <th scope="col" aria-sort="descending" className="py-2 pr-4">{tadmin('table_col_submission_date')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr
              key={s.id}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/admin/companies/${companyId}/submissions/${s.id}?fromCompany=${companyId}`)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/admin/companies/${companyId}/submissions/${s.id}?fromCompany=${companyId}`); } }}
              className="border-b last:border-b-0 border-gray-200 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              aria-label={`Submission ${s.id}`}
            >
              <td className="py-2 pr-4 pl-6">{formatDateISO(s.dateFrom)}</td>
              <td className="py-2 pr-4">{formatDateISO(s.dateTo)}</td>
              <td className="py-2 pr-4">{s.womenPercent}%</td>
              <td className="py-2 pr-4">{s.menPercent}%</td>
              <td className="py-2 pr-4">{s.requirementsApplied ? tcommon('yes') : tcommon('no')}</td>
              <td className="py-2 pr-4">{s.submitterEmail ?? ''}</td>
              <td className="py-2 pr-4">{formatDateTimeISO(s.submittedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
