"use client";
import React from 'react';

export interface ReportTypeOption { id: string; name: string }
interface Props {
  types: ReportTypeOption[];
  value: string | undefined;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function ReportSelector({ types, value, onChange, disabled }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Report Type</label>
      <select
        className="border rounded px-2 py-1 text-sm"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Select report type"
      >
        <option value="" disabled>Select type...</option>
        {types.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}
