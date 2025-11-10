"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useI18n } from '../../i18n/LocaleProvider';
import { DateInputWithPicker } from './DateInputWithPicker';
import { COMPANY_TYPE_VALUES, COMPANY_TYPE_LABEL_KEYS } from '../../lib/constants/companyType';

export function FormsFilters() {
  const { t } = useI18n();
  const tadmin = t('admin');
  const tfields = t('fields') as unknown as (key: string) => string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const sp = useMemo(() => new URLSearchParams(searchParams?.toString() || ''), [searchParams]);

  const [company, setCompany] = useState(sp.get('company') || '');
  const submissionDateFrom = sp.get('submissionDateFrom') || '';
  const submissionDateTo = sp.get('submissionDateTo') || '';
  const reportPeriodFrom = sp.get('reportPeriodFrom') || '';
  const reportPeriodTo = sp.get('reportPeriodTo') || '';
  const companyType = sp.get('companyType') || '';
  const genderAlignment = sp.get('genderAlignment') || '';
  const requirementsApplied = sp.get('requirementsApplied') || '';

  const pushWith = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    });
    // Reset page when filters change
    next.set('page', '1');
    router.push(`?${next.toString()}`);
  };

  const hasFilters = Boolean(
    sp.get('company') ||
    sp.get('submissionDateFrom') || sp.get('submissionDateTo') ||
    sp.get('reportPeriodFrom') || sp.get('reportPeriodTo') ||
    sp.get('genderAlignment') || sp.get('requirementsApplied') ||
    sp.get('companyType')
  );

  const clearAll = () => {
    const next = new URLSearchParams(sp.toString());
  ['company','companyType','submissionDateFrom','submissionDateTo','reportPeriodFrom','reportPeriodTo','genderImbalance','genderAlignment','requirementsApplied'].forEach((k) => next.delete(k));
    next.set('page', '1');
    router.push(`?${next.toString()}`);
  };

  // Debounce company typing to avoid excessive pushes.
  // IMPORTANT: Only push when the debounced value actually differs from the URL,
  // otherwise this effect would reset page to 1 on every navigation (breaking pagination).
  useEffect(() => {
    const spCompany = sp.get('company') || '';
    if (company === spCompany) return;
    const id = setTimeout(() => {
      pushWith({ company });
    }, 300);
    return () => clearTimeout(id);
  }, [company, sp]);

  return (
    <div className="mb-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-base font-medium">{tadmin('filters_company')}</label>
          <input
            className="border-2 rounded px-2 py-1 w-full"
            placeholder={tadmin('filters_company_placeholder')}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-base font-medium">{tadmin('filters_company_type')}</label>
          <select
            className="border-2 rounded px-2 py-1 w-full"
            value={companyType}
            onChange={(e) => pushWith({ companyType: e.target.value || null })}
          >
            <option value="">{tadmin('filters_any')}</option>
            {COMPANY_TYPE_VALUES.map((ct) => (
              <option key={ct} value={ct}>{tfields(COMPANY_TYPE_LABEL_KEYS[ct])}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base font-medium">{tadmin('filters_gender_alignment')}</label>
          <select
            className="border-2 rounded px-2 py-1 w-full"
            value={genderAlignment}
            onChange={(e) => pushWith({ genderAlignment: e.target.value || null, genderImbalance: null })}
          >
            <option value="">{tadmin('filters_any')}</option>
            <option value="meets_33">{tadmin('filters_alignment_meets')}</option>
            <option value="not_meet_33">{tadmin('filters_alignment_not_meet')}</option>
          </select>
        </div>
        <div>
          <label className="block text-base font-medium">{tadmin('filters_requirements_applied')}</label>
          <select
            className="border-2 rounded px-2 py-1 w-full"
            value={requirementsApplied}
            onChange={(e) => pushWith({ requirementsApplied: e.target.value || null })}
          >
            <option value="">{tadmin('filters_any')}</option>
            <option value="yes">{t('common')('yes')}</option>
            <option value="no">{t('common')('no')}</option>
          </select>
        </div>
      </div>
      {/* Side-by-side date blocks */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submission Date */}
        <div>
          <label className="block text-base font-medium mb-2">{tadmin('filters_submission_date')}</label>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">Nuo</div>
              <DateInputWithPicker
                id="submissionDateFrom"
                value={submissionDateFrom}
                onChange={(v) => pushWith({ submissionDateFrom: v || null })}
                aria-label={tadmin('filters_submission_date') + ' nuo'}
                className="w-full sm:w-56"
              />
            </div>
            <div className="hidden sm:flex items-center justify-center text-gray-700" aria-hidden="true">-</div>
            <div>
              <div className="text-xs text-gray-600 mb-1 sm:text-right">Iki</div>
              <DateInputWithPicker
                id="submissionDateTo"
                value={submissionDateTo}
                onChange={(v) => pushWith({ submissionDateTo: v || null })}
                aria-label={tadmin('filters_submission_date') + ' iki'}
                className="w-full sm:w-56"
              />
            </div>
          </div>
        </div>
        {/* Reporting Period */}
        <div>
          <label className="block text-base font-medium mb-2">{tadmin('filters_reporting_period')}</label>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">Nuo</div>
              <DateInputWithPicker
                id="reportPeriodFrom"
                value={reportPeriodFrom}
                onChange={(v) => pushWith({ reportPeriodFrom: v || null })}
                aria-label={tadmin('filters_reporting_period') + ' nuo'}
                className="w-full sm:w-56"
              />
            </div>
            <div className="hidden sm:flex items-center justify-center text-gray-700" aria-hidden="true">-</div>
            <div>
              <div className="text-xs text-gray-600 mb-1 sm:text-right">Iki</div>
              <DateInputWithPicker
                id="reportPeriodTo"
                value={reportPeriodTo}
                onChange={(v) => pushWith({ reportPeriodTo: v || null })}
                aria-label={tadmin('filters_reporting_period') + ' iki'}
                className="w-full sm:w-56"
              />
            </div>
          </div>
        </div>
      </div>

      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-800 hover:bg-gray-100"
            onClick={clearAll}
            aria-label="Clear all filters"
          >
            {tadmin('filters_clear_all')}
          </button>
        </div>
      )}
    </div>
  );
}
