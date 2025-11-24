"use client";
import React from 'react';
import PillSelect from '../../components/ui/PillSelect';
import { useI18n } from '../../i18n/LocaleProvider';

export interface ReportTypeOption { id: string; name: string }
interface Props {
  types: ReportTypeOption[];
  value: string | undefined;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function ReportSelector({ types, value, onChange, disabled }: Props) {
  const { t } = useI18n();
  const tadmin = t('admin');
  const toKey = (id: string) => `reports_type_${id.replace(/-/g,'_')}` as const;
  return (
    <PillSelect
      id="reportType"
      label={tadmin('reports_type_label')}
      value={value || ''}
      onChange={(val) => onChange(val)}
      disabled={disabled}
      options={types.map(t => {
        const key = toKey(t.id);
        // Attempt translation; fallback to provided name
        let label: string;
        try { label = tadmin(key as any); } catch { label = t.name; }
        if (!label || label === key) label = t.name;
        return { value: t.id, label };
      })}
      placeholder={tadmin('reports_type_placeholder')}
      className="min-w-[20rem]"
      autoWidth={false}
    />
  );
}
