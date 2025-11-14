/**
 * Language options configuration (T030).
 * Provides a lightweight list of selectable locales for the admin sidebar switch.
 */
export interface LanguageOption {
  code: 'lt' | 'en';
  label: string; // Human readable label (English for consistency in select; could be localized later)
}

export const languageOptions: LanguageOption[] = [
  { code: 'lt', label: 'Lietuvių' },
  { code: 'en', label: 'English' }
];
