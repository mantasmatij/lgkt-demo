"use client";
import { useEffect } from 'react';
import { useI18n } from '../../i18n/LocaleProvider';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  page: number;
  pageSize: 10 | 25 | 50 | 100;
  total: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: 10 | 25 | 50 | 100) => void;
};

export function FormsPagination({ page, pageSize, total, onPageChange, onPageSizeChange }: Props) {
  const { t } = useI18n();
  const tadmin = t('admin');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pushWith = (updates: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(updates).forEach(([k, v]) => sp.set(k, v));
    router.push(`?${sp.toString()}`);
  };
  const handlePageChange = (next: number) => {
    if (onPageChange) return onPageChange(next);
    pushWith({ page: String(next) });
  };
  const handlePageSizeChange = (next: 10 | 25 | 50 | 100) => {
    if (onPageSizeChange) return onPageSizeChange(next);
    // Reset page when pageSize changes
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('adminForms.pageSize', String(next)); } catch { /* ignore */ }
    }
    pushWith({ pageSize: String(next), page: '1' });
  };
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // On first mount, apply stored pageSize (session persistence) if URL doesn't already match it.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('adminForms.pageSize');
      const allowed = ['10','25','50','100'];
      if (!stored || !allowed.includes(stored)) return;
      const sp = new URLSearchParams(searchParams?.toString() || '');
      const urlSize = sp.get('pageSize');
      if (urlSize === stored) return;
      // Apply stored pageSize and reset page to 1
      pushWith({ pageSize: stored, page: '1' });
    } catch { /* ignore */ }
    // Only on initial mount
  }, []);
  return (
    <div className="mt-4 flex items-center justify-between">
      <div>
        <button className="px-3 py-1 border rounded mr-2" aria-label={tadmin('pagination_prev')} disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
          {tadmin('pagination_prev')}
        </button>
        <button className="px-3 py-1 border rounded" aria-label={tadmin('pagination_next')} disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
          {tadmin('pagination_next')}
        </button>
        <span className="ml-4 text-sm text-gray-600">{tadmin('pagination_page_of').replace('{page}', String(page)).replace('{total}', String(totalPages))}</span>
      </div>
      <div>
        <label className="mr-2" htmlFor="rows-per-page">{tadmin('pagination_rows_per_page')}</label>
        <select
          id="rows-per-page"
          className="border rounded px-2 py-1"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value) as 10 | 25 | 50 | 100)}
        >
          {[10, 25, 50, 100].map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
