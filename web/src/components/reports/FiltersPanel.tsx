"use client";
import React from 'react';
import { useI18n } from '../../i18n/LocaleProvider';
import { DateInputWithPicker } from '../forms/DateInputWithPicker';

interface DateRange { from?: string; to?: string }
interface Props {
  dateRange: DateRange;
  onChange: (next: DateRange) => void;
  disabled?: boolean;
}

export function FiltersPanel({ dateRange, onChange, disabled }: Props) {
  const { t } = useI18n();
  const tadmin = t('admin');
  return (
    <div className={"flex gap-4 flex-wrap items-end " + (disabled ? 'opacity-50 pointer-events-none' : '')} aria-label={tadmin('reports_date_range_aria')} aria-disabled={disabled}>
      <div className="flex flex-col">
        <label className="text-xs mb-1" htmlFor="from-date">{tadmin('reports_from')}</label>
        <DateInputWithPicker
          id="from-date"
          value={dateRange.from || ''}
          onChange={(v) => onChange({ ...dateRange, from: v || '' })}
          className="w-56"
        />
      </div>
      <div className="flex items-center text-gray-700" aria-hidden="true">-</div>
      <div className="flex flex-col">
        <label className="text-xs mb-1" htmlFor="to-date">{tadmin('reports_to')}</label>
        <DateInputWithPicker
          id="to-date"
          value={dateRange.to || ''}
          onChange={(v) => onChange({ ...dateRange, to: v || '' })}
          className="w-56"
        />
      </div>
    </div>
  );
}
