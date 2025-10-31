export function reportMissingServer(ns: string, key: string, locale: string) {
  if (process.env.NODE_ENV === 'production') return;
  console.warn(`[i18n][server] Missing translation: ns="${ns}" key="${key}" locale="${locale}"`);
}
