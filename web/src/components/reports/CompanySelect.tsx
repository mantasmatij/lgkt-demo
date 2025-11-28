"use client";
import React, { useEffect, useState } from 'react';
import PillSelect from '../ui/PillSelect';
import { useI18n } from '../../i18n/LocaleProvider';

interface Option { value: string; label: string }
interface Props {
  value?: string;
  onChange: (code: string | undefined) => void;
  disabled?: boolean;
}

export function CompanySelect({ value, onChange, disabled }: Props) {
  const { t } = useI18n();
  const tadmin = t('admin');
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  // Query filter removed per requirement; load all options unfiltered for now

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
        const url = `${API_BASE}/api/reports/company-options`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) setOptions(json.options || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col min-w-80" aria-label={tadmin('reports_company_selector_aria')}>
      <PillSelect
        id="company-select"
        label={tadmin('reports_company_label')}
        value={value || ''}
        disabled={disabled || loading}
        onChange={(val) => onChange(val || undefined)}
        options={options.map(o => ({ value: o.value, label: o.label }))}
        placeholder={tadmin('reports_company_placeholder_all')}
        autoWidth={false}
      />
    </div>
  );
}

// Debounce hook removed (no query filtering now)

export default CompanySelect;
