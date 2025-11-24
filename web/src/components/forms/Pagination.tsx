"use client";
import { useEffect, useMemo, useState } from 'react';
import PillSelect from '../../components/ui/PillSelect';
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
  // Page selector: use a select for reasonable totalPages, fall back to number input for very large totals
  const useSelect = totalPages <= 200;
  const pageOptions = useMemo(() => (useSelect ? Array.from({ length: totalPages }, (_, i) => i + 1) : []), [useSelect, totalPages]);
  const [pageInput, setPageInput] = useState<string>(String(page));
  useEffect(() => { setPageInput(String(page)); }, [page]);
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
        <button
          className="px-3 py-1 border-2 border-black rounded mr-2 bg-black text-white hover:bg-white hover:text-black hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={tadmin('pagination_prev')}
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
        >
          {tadmin('pagination_prev')}
        </button>
        <button
          className="px-3 py-1 border-2 border-black rounded bg-black text-white hover:bg-white hover:text-black hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={tadmin('pagination_next')}
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          {tadmin('pagination_next')}
        </button>
        <span className="ml-4 text-sm text-gray-600">
          {tadmin('pagination_page_of').replace('{page}', String(page)).replace('{total}', String(totalPages))}
        </span>
        <span className="ml-2" />
        {useSelect ? (
          <label className="ml-2 inline-flex items-center gap-2 text-sm text-gray-700">
            <span className="sr-only">Page</span>
            {/* Replace native select with pill dropdown for consistency */}
            <div className="min-w-0">
              <PillSelect
                id="pagination-page"
                value={String(page)}
                onChange={(val) => handlePageChange(Number(val) || 1)}
                options={pageOptions.map(p => ({ value: String(p), label: String(p) }))}
                placeholder={undefined}
                maxVisible={5}
                autoWidth={true}
                className="min-w-0"
              />
            </div>
            <span className="text-gray-600">/ {totalPages}</span>
          </label>
        ) : (
          <label className="ml-2 inline-flex items-center gap-2 text-sm text-gray-700">
            <span className="sr-only">Page</span>
            <input
              type="number"
              className="border-2 rounded px-2 py-1 w-20"
              min={1}
              max={totalPages}
              aria-label="Go to page"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => {
                const n = Number(pageInput);
                if (Number.isFinite(n)) {
                  const clamped = Math.min(Math.max(1, Math.trunc(n)), totalPages);
                  if (clamped !== page) handlePageChange(clamped);
                } else {
                  setPageInput(String(page));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const n = Number(pageInput);
                  if (Number.isFinite(n)) {
                    const clamped = Math.min(Math.max(1, Math.trunc(n)), totalPages);
                    if (clamped !== page) handlePageChange(clamped);
                  } else {
                    setPageInput(String(page));
                  }
                }
              }}
            />
            <span className="text-gray-600">/ {totalPages}</span>
          </label>
        )}
      </div>
      <div>
        <label className="mr-2" htmlFor="rows-per-page">{tadmin('pagination_rows_per_page')}</label>
        <div className="min-w-28">
          <PillSelect
            id="rows-per-page"
            value={String(pageSize)}
            onChange={(val) => handlePageSizeChange(Number(val) as 10 | 25 | 50 | 100)}
            options={[10,25,50,100].map(opt => ({ value: String(opt), label: String(opt) }))}
            placeholder={undefined}
            maxVisible={5}
          />
        </div>
      </div>
    </div>
  );
}
