"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../i18n/LocaleProvider';
import { COMPANY_TYPE_VALUES, COMPANY_TYPE_LABEL_KEYS } from '../../lib/constants/companyType';

export function CompaniesFilters() {
  const { t } = useI18n();
  const tadmin = t('admin');
  const tfields = t('fields') as unknown as (key: string) => string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const sp = useMemo(() => new URLSearchParams(searchParams?.toString() || ''), [searchParams]);

  const [search, setSearch] = useState(sp.get('search') || '');
  const [type, setType] = useState(sp.get('type') || '');
  const [registry, setRegistry] = useState(sp.get('registry') || '');

  const pushWith = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === '' ) next.delete(k);
      else next.set(k, v);
    });
    // Reset page when filters change
    next.set('page', '1');
    router.push(`?${next.toString()}`);
  };

  // Debounce search input to avoid excessive pushes, and only push when changed.
  useEffect(() => {
    const current = sp.get('search') || '';
    if (search === current) return;
    const id = setTimeout(() => {
      pushWith({ search });
    }, 300);
    return () => clearTimeout(id);
  }, [search, sp]);

  // Immediate update for selects
  useEffect(() => {
    const currentType = sp.get('type') || '';
    if (type !== currentType) {
      pushWith({ type: type || null });
    }
  }, [type, sp]);
  useEffect(() => {
    const currentRegistry = sp.get('registry') || '';
    if (registry !== currentRegistry) {
      pushWith({ registry: registry || null });
    }
  }, [registry, sp]);

  const hasFilters = Boolean(sp.get('search') || sp.get('type') || sp.get('registry'));

  const clearAll = () => {
    const next = new URLSearchParams(sp.toString());
    ['search','type','registry','page'].forEach((k) => next.delete(k));
    next.set('page','1');
    router.push(`?${next.toString()}`);
  };

  return (
    <div className="mb-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-base font-medium">{tadmin('filters_company')}</label>
          <input
            className="border-2 rounded px-2 py-1 w-full"
            placeholder={tadmin('filters_company_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-base font-medium">{tadmin('filters_company_type')}</label>
          <select
            className="border-2 rounded px-2 py-1 w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">{tadmin('filters_any')}</option>
            {COMPANY_TYPE_VALUES.map((ct) => (
              <option key={ct} value={ct}>{tfields(COMPANY_TYPE_LABEL_KEYS[ct])}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base font-medium">{tfields('registry')}</label>
          <input
            className="border-2 rounded px-2 py-1 w-full"
            placeholder={tfields('registry')}
            value={registry}
            onChange={(e) => setRegistry(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          {hasFilters && (
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-800 hover:bg-gray-100"
              onClick={clearAll}
            >
              {tadmin('filters_clear_all')}
            </button>
          )}
        </div>
      </div>
      {/* Active filter chips */}
      {hasFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm">
              {tadmin('filters_company')}: <strong>{search}</strong>
              <button
                type="button"
                aria-label="Remove search filter"
                className="ml-1 text-blue-600 hover:text-blue-900"
                onClick={() => { setSearch(''); pushWith({ search: null }); }}
              >×</button>
            </span>
          )}
          {type && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 px-2 py-1 rounded text-sm">
              {tadmin('filters_company_type')}: <strong>{tfields(COMPANY_TYPE_LABEL_KEYS[type as keyof typeof COMPANY_TYPE_LABEL_KEYS])}</strong>
              <button
                type="button"
                aria-label="Remove type filter"
                className="ml-1 text-green-600 hover:text-green-900"
                onClick={() => { setType(''); pushWith({ type: null }); }}
              >×</button>
            </span>
          )}
          {registry && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2 py-1 rounded text-sm">
              {tfields('registry')}: <strong>{registry}</strong>
              <button
                type="button"
                aria-label="Remove registry filter"
                className="ml-1 text-purple-600 hover:text-purple-900"
                onClick={() => { setRegistry(''); pushWith({ registry: null }); }}
              >×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
