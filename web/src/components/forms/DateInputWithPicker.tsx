"use client";
import { useEffect, useRef, useState } from 'react';

type Props = {
  id?: string;
  value: string;
  placeholder?: string;
  onChange: (next: string) => void;
  className?: string;
  label?: string;
  "aria-label"?: string;
};

// Normalize and validate date input.
// Accepts only YYYY-MM-DD; returns YYYY-MM-DD if valid, otherwise null.
function normalizeValidDate(v: string): string | null {
  const s = v.trim();
  if (!s) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map((n) => parseInt(n, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;
  // Validate using UTC to avoid timezone rollovers
  const dt = new Date(Date.UTC(y, m - 1, d));
  const isSame = dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  return isSame ? s : null;
}

export function DateInputWithPicker({ id, value, placeholder = "YYYY-MM-DD", onChange, className = "", label, ...rest }: Props) {
  const hiddenDateRef = useRef<HTMLInputElement>(null);
  const [display, setDisplay] = useState<string>(value);

  // Keep internal display in sync with parent value
  useEffect(() => {
    setDisplay(value || '');
  }, [value]);

  const openPicker = () => {
    const el = hiddenDateRef.current;
    if (!el) return;
    try {
      // Sync hidden input value from current value (normalize to yyyy-mm-dd)
      const norm = normalizeValidDate(value);
      if (norm) el.value = norm;
      // Prefer showPicker if supported (Chrome/WebKit), else click fallback
      const anyEl = el as unknown as { showPicker?: () => void; click: () => void };
      if (typeof anyEl.showPicker === 'function') {
        anyEl.showPicker();
      } else {
        el.click();
      }
    } catch {
      el.click();
    }
  };

  const onHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value; // always yyyy-mm-dd
    if (v) {
      setDisplay(v);
      onChange(v);
    }
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);
    if (raw === '') {
      // Clearing should remove the param
      onChange('');
      return;
    }
    const norm = normalizeValidDate(raw);
    // Only propagate when it's a real calendar date
    if (norm) onChange(norm);
  };

  return (
    <div className="relative inline-block">
      <input
        id={id}
        className={"border-2 rounded px-2 py-1 pr-10 font-mono w-56 " + className}
        placeholder={placeholder}
        inputMode="numeric"
        pattern="\\d{4}-\\d{2}-\\d{2}"
        value={display}
        onChange={onTextChange}
        {...rest}
      />
      <button
        type="button"
    onClick={openPicker}
    className="absolute right-1 inset-y-1 my-0.5 inline-flex items-center justify-center gap-1 px-2 rounded border-2 border-gray-300 text-gray-800 bg-white hover:bg-gray-100"
        aria-label={rest["aria-label"] || label || "Choose date"}
        title={label || "Choose date"}
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
      />
    </div>
  );
}
