"use client";
import React from 'react';

interface DateRange { from?: string; to?: string }
interface Props {
  dateRange: DateRange;
  onChange: (next: DateRange) => void;
  disabled?: boolean;
}

export function FiltersPanel({ dateRange, onChange, disabled }: Props) {
  return (
    <fieldset className="space-y-2 border rounded p-3" disabled={disabled} aria-label="Filters">
      <legend className="text-sm font-medium">Filters</legend>
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col">
          <label className="text-xs mb-1" htmlFor="from-date">From</label>
          <input
            id="from-date"
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={dateRange.from || ''}
            onChange={e => onChange({ ...dateRange, from: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs mb-1" htmlFor="to-date">To</label>
            <input
              id="to-date"
              type="date"
              className="border rounded px-2 py-1 text-sm"
              value={dateRange.to || ''}
              onChange={e => onChange({ ...dateRange, to: e.target.value })}
            />
        </div>
      </div>
    </fieldset>
  );
}
