"use client";
import * as React from 'react';

export type DateInputWithPickerProps = {
  id?: string;
  value: string;
  placeholder?: string;
  onChange: (next: string) => void;
  className?: string;
  label?: string;
  ariaLabel?: string;
  min?: string;
};

function normalizeValidDate(v: string): string | null {
  const s = (v || '').trim();
  if (!s) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map((n) => parseInt(n, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  const isSame = dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  return isSame ? s : null;
}

export function DateInputWithPicker({ id, value, placeholder = 'YYYY-MM-DD', onChange, className = '', label, ariaLabel, min }: DateInputWithPickerProps) {
  const hiddenDateRef = React.useRef<HTMLInputElement>(null);
  const [display, setDisplay] = React.useState<string>(value || '');

  React.useEffect(() => {
    setDisplay(value || '');
  }, [value]);

  const openPicker = () => {
    const el = hiddenDateRef.current;
    if (!el) return;
    try {
      const norm = normalizeValidDate(value);
      if (norm) el.value = norm;
      if (min) el.min = min;
      const anyEl = el as unknown as { showPicker?: () => void; click: () => void };
      if (typeof anyEl.showPicker === 'function') anyEl.showPicker();
      else el.click();
    } catch {
      el.click();
    }
  };

  const onHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setDisplay(v);
    onChange(v);
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);
    if (raw === '') {
      onChange('');
      return;
    }
    const norm = normalizeValidDate(raw);
    if (norm) onChange(norm);
  };

  return (
    <div className="relative inline-block">
      <input
        id={id}
        className={(
          "h-11 w-56 rounded-full border-2 border-black bg-white px-4 pr-11 font-mono shadow-sm " +
          "outline-none focus:outline-none focus-visible:outline-none " +
          className
        )}
        placeholder={placeholder}
        inputMode="numeric"
        pattern="\\d{4}-\\d{2}-\\d{2}"
        value={display}
        onChange={onTextChange}
        aria-label={ariaLabel || label}
      />
      <button
        type="button"
        onClick={openPicker}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-7 items-center justify-center rounded-full text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/30"
        aria-label={ariaLabel || label || 'Choose date'}
        title={label || 'Choose date'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      </button>
      {/* Hidden native date input to leverage system picker */}
      <input
        ref={hiddenDateRef}
        type="date"
        className="absolute opacity-0 pointer-events-none size-0"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onHiddenChange}
        min={min}
      />
    </div>
  );
}
