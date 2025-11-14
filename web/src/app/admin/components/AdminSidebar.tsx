"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getSortedNavItems, getActiveItemId } from '../../../lib/navigation';
import { translateNav } from '../../../lib/navigation/i18n';
import { getNavIcon } from '../../../lib/navigation/icons';
import AdminNavItem from './AdminNavItem';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../../i18n/LocaleProvider';
import { languageOptions } from '../../../lib/navigation/languageOptions';
import { trackLanguageChange, markPerfStart, markPerfEnd } from '../../../lib/navigation/analytics';

// Phase 2: Foundational wiring (T013, T014)
// - Renders static nav items
// - Adds semantic navigation landmarks & aria-label
// - Computes active item id using current pathname
// NOTE: Collapse, language switch, analytics added in later tasks.
export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const items = getSortedNavItems();
  const activeId = getActiveItemId(pathname || '', items);
  const { locale, setLocale, t } = useI18n();

  // Track language change timing (T031, T032)
  const changingRef = useRef<{ from: string; to: string; started: number } | null>(null);
  const [renderNonce, setRenderNonce] = useState(0); // Forces re-render timing measurement

  // After locale changes and component re-renders, measure duration
  useEffect(() => {
    const ctx = changingRef.current;
    if (ctx && ctx.to === locale) {
      const durationMs = performance.now() - ctx.started;
      trackLanguageChange(ctx.from, ctx.to, durationMs, true);
      markPerfEnd('lang-change-visible');
      changingRef.current = null;
    }
  }, [locale, renderNonce]);

  const onLanguageChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = e.target.value;
      if (next === locale) return;
      const from = locale;
      changingRef.current = { from, to: next, started: performance.now() };
      markPerfStart('lang-change-visible');
      try {
        await setLocale(next as typeof locale);
        // Trigger re-render hook measurement
        setRenderNonce(n => n + 1);
      } catch (err) {
        // Graceful fallback: log & analytics failure
        console.warn('[AdminSidebar] language change failed', err);
        trackLanguageChange(from, next, 0, false);
        changingRef.current = null;
      }
    },
    [locale, setLocale]
  );

  return (
    <aside
      className="w-64 p-4 border-l border-gray-200 hidden md:flex flex-col justify-between bg-white"
      data-phase="foundation+language"
    >
      <nav role="navigation" aria-label="Admin Navigation" className="space-y-1">
        {items.map(item => {
          const label = translateNav(item.labelKey, locale as 'en' | 'lt');
          const icon = getNavIcon(item, label);
          return (
            <AdminNavItem
              key={item.id}
              id={item.id}
              label={label}
              href={item.route}
              active={item.id === activeId}
              icon={icon}
            />
          );
        })}
      </nav>
      <div className="pt-4 border-t mt-4">
        <label htmlFor="admin-lang-select" className="block text-xs font-medium text-gray-500 mb-1">
          {t('common')('language')}
        </label>
        <select
          id="admin-lang-select"
          data-testid="admin-lang-select"
          className="w-full border rounded px-2 py-1 text-sm"
          value={locale}
          onChange={onLanguageChange}
        >
          {languageOptions.map(opt => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};

export default AdminSidebar;
