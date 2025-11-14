// Simple internal i18n helper for navigation (T021)
// In real integration this would delegate to the global i18n provider.

const dictionary: Record<string, string> = {
  'nav.companies': 'Companies',
  'nav.formsReports': 'Forms & Reports',
  'nav.submissionsExports': 'Submissions / Exports',
  'nav.settings': 'Settings'
};

export function translateNav(key: string): string {
  return dictionary[key] || key;
}
