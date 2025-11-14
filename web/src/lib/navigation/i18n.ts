// Internal navigation i18n helper (T021, extended for US2 language switch)
// Supports multiple locales independently of global provider namespaces.

export type NavLocale = 'en' | 'lt';

const navDictionaries: Record<NavLocale, Record<string, string>> = {
  en: {
    'nav.companies': 'Companies',
    'nav.formsReports': 'Forms & Reports',
    'nav.submissionsExports': 'Submissions / Exports',
    'nav.settings': 'Settings'
  },
  lt: {
    'nav.companies': 'Įmonės',
    'nav.formsReports': 'Formos ir Ataskaitos',
    'nav.submissionsExports': 'Pateikimai / Eksportai',
    'nav.settings': 'Nustatymai'
  }
};

/** Translate a navigation key for given locale (fallback to 'en'). */
export function translateNav(key: string, locale: NavLocale = 'en'): string {
  const dict = navDictionaries[locale] || navDictionaries.en;
  return dict[key] || navDictionaries.en[key] || key;
}

/** List of supported locales for navigation (kept small & explicit). */
export const supportedNavLocales: NavLocale[] = ['lt', 'en'];

