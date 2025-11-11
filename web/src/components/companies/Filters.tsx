"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../i18n/LocaleProvider';

export function CompaniesFilters() {
  const { t } = useI18n();
  const tadmin = t('admin');
  const router = useRouter();
  const searchParams = useSearchParams();
  const sp = useMemo(() => new URLSearchParams(searchParams?.toString() || ''), [searchParams]);

  const [search, setSearch] = useState(sp.get('search') || '');

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

  // Debounce search input to avoid excessive pushes, and only push when changed.
  useEffect(() => {
    const current = sp.get('search') || '';
    if (search === current) return;
    const id = setTimeout(() => {
      pushWith({ search });
    }, 300);
    return () => clearTimeout(id);
  }, [search, sp]);

  return (
    <div className="mb-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div>
        <label className="block text-base font-medium">{tadmin('filters_company')}</label>
        <input
          className="border-2 rounded px-2 py-1 w-full"
          placeholder={tadmin('filters_company_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
