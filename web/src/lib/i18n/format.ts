import type { Locale } from '../../i18n/dictionaries';

export function formatDate(date: Date | number | string, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options ?? { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

export function formatNumber(n: number, locale: Locale, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, options).format(n);
}

export function formatCurrency(amount: number, currency: 'EUR' | 'USD', locale: Locale) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
