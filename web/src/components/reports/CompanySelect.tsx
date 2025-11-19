"use client";
import React, { useEffect, useState } from 'react';

interface Option { value: string; label: string }
interface Props {
  value?: string;
  onChange: (code: string | undefined) => void;
  disabled?: boolean;
}

export function CompanySelect({ value, onChange, disabled }: Props) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounced(query, 200);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const url = new URL('/api/reports/company-options', window.location.origin);
        if (debouncedQuery) url.searchParams.set('query', debouncedQuery);
        const res = await fetch(url.toString());
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) setOptions(json.options || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col gap-1 min-w-64" aria-label="Company filter">
      <label className="text-xs" htmlFor="company-query">Company code</label>
      <input
        id="company-query"
        type="text"
        className="border rounded px-2 py-1 text-sm"
        placeholder="Filter by code..."
        value={query}
        disabled={disabled}
        onChange={e => setQuery(e.target.value)}
      />
      <select
        className="border rounded px-2 py-1 text-sm"
        value={value || ''}
        disabled={disabled || loading}
        onChange={e => onChange(e.target.value || undefined)}
        aria-label="Select company"
      >
        <option value="">All companies</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function useDebounced<T>(value: T, delay: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default CompanySelect;
