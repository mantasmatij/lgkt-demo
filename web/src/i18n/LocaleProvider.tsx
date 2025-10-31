"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { dictionaries, type Locale } from './dictionaries';

type I18nContextValue = {
  locale: Locale;
  t: <K extends keyof (typeof dictionaries)['lt']>(
    ns: K
  ) => (key: keyof (typeof dictionaries)['lt'][K]) => string;
  setLocale: (locale: Locale) => Promise<void>;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: 'include', ...init });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function getCsrfToken(): Promise<string> {
  const data = await fetchJson<{ token: string }>('/api/csrf');
  return data.token;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('lt');

  // On mount, load from server session
  useEffect(() => {
    let mounted = true;
    fetchJson<{ locale: Locale }>('/api/i18n/locale')
      .then((data) => {
        if (mounted) setLocaleState(data.locale);
      })
      .catch(() => {
        /* ignore; keep default */
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Keep <html lang> in sync
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = async (next: Locale) => {
    const token = await getCsrfToken();
    const res = await fetch('/api/i18n/locale', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
      },
      body: JSON.stringify({ locale: next }),
    });
    if (!res.ok) throw new Error(`Failed to set locale: ${res.status}`);
    setLocaleState(next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (ns) => (key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dict = dictionaries[locale] as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const section = dict?.[ns as any] ?? {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return String(section?.[key as any] ?? String(key));
      },
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within LocaleProvider');
  return ctx;
}
