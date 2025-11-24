"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getSortedNavItems, getActiveItemId } from '../../../lib/navigation';
import { translateNav } from '../../../lib/navigation/i18n';
import { getNavIcon } from '../../../lib/navigation/icons';
import AdminNavItem from './AdminNavItem';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../../i18n/LocaleProvider';
import { languageOptions } from '../../../lib/navigation/languageOptions';
import { trackLanguageChange, markPerfStart, markPerfEnd, trackSidebarToggle } from '../../../lib/navigation/analytics';
import { getInitialCollapsedState, persistCollapsedState } from '../../../lib/navigation/preference';

// Phase 2: Foundational wiring (T013, T014)
// - Renders static nav items
// - Adds semantic navigation landmarks & aria-label
// - Computes active item id using current pathname
// NOTE: Collapse, language switch, analytics added in later tasks.
export const AdminSidebar: React.FC<{ defaultCollapsed?: boolean; mobileOpen?: boolean }> = ({ defaultCollapsed = false, mobileOpen = false }) => {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin/sign-in')) {
    return null;
  }
  const items = getSortedNavItems();
  const activeId = getActiveItemId(pathname || '', items);
  const { locale, setLocale, t } = useI18n();
  // Determine initial collapsed state before first paint to avoid flicker on navigation
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultCollapsed;
    let initial = getInitialCollapsedState();
    if (window.innerWidth < 480) initial = true; // force collapsed on very small screens
    return initial;
  });
  // Track hydration to avoid SSR/client mismatch visual flash
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const onToggleCollapse = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      persistCollapsedState(next);
      trackSidebarToggle(next, 'user');
      return next;
    });
  }, []);

  // Reflect collapsed state onto layout root for dynamic padding
  useEffect(() => {
    const root = document.querySelector("[data-layout='admin']");
    if (!root) return;
    root.classList.toggle('sidebar-collapsed', collapsed);
    root.classList.toggle('sidebar-expanded', !collapsed);
  }, [collapsed]);

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

  // Force expanded when mobile overlay is open
  const effectiveCollapsed = mobileOpen ? false : collapsed;
  // Reserve vertical space for the floating close button when mobileOpen
  const topPad = mobileOpen ? 'pt-20' : '';
  const asideClasses = [
    'fixed top-0 left-0 z-50',
    (mobileOpen ? 'flex' : 'hidden') + ' md:flex',
    'flex-col bg-white border-r border-gray-200 shadow-lg',
    'h-screen overflow-y-auto transition-all duration-200',
    effectiveCollapsed ? `w-16 p-2 ${topPad}` : `w-64 p-4 ${topPad}`,
    // Hide until hydrated to prevent expand-then-collapse flash when persisted state differs from SSR default
    hydrated ? 'opacity-100' : 'opacity-0'
  ].join(' ');

  return (
    <aside className={asideClasses} data-phase="foundation+language">
      <div className="flex flex-col gap-3 flex-1">
        {!mobileOpen && (
          <button
            type="button"
            id="admin-collapse-toggle"
            aria-expanded={!effectiveCollapsed}
            className={[
              'border text-sm transition-colors',
              effectiveCollapsed
                ? 'w-full flex items-center justify-center px-2 py-1 rounded-full'
                : 'w-full px-2 py-1 text-left flex items-center gap-2 rounded'
            ].join(' ')}
            onClick={onToggleCollapse}
            aria-label={effectiveCollapsed ? t('common')('expand_sidebar') : undefined}
          >
            {effectiveCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3 shrink-0 text-gray-700"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3 shrink-0 text-gray-700"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>{t('common')('collapse_sidebar')}</span>
              </>
            )}
          </button>
        )}
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
                collapsed={effectiveCollapsed}
              />
            );
          })}
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t flex flex-col gap-2">
        {!effectiveCollapsed ? (
          <>
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
          </>
        ) : (
          <button
            type="button"
            id="admin-lang-toggle"
            aria-label={t('common')('change_language')}
            className="w-full border rounded-full px-2 py-1 text-sm flex items-center justify-center"
            onClick={async () => {
              const next = locale === 'lt' ? 'en' : 'lt';
              const from = locale;
              changingRef.current = { from, to: next, started: performance.now() };
              markPerfStart('lang-change-visible');
              try {
                await setLocale(next as typeof locale);
                setRenderNonce(n => n + 1);
              } catch (err) {
                console.warn('[AdminSidebar] language toggle failed', err);
                trackLanguageChange(from, next, 0, false);
                changingRef.current = null;
              }
            }}
          >
            🌐 {locale.toUpperCase()}
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
