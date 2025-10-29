"use client";
import React from 'react';
import { useI18n } from '../i18n/LocaleProvider';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const label = t('common')('language');
  const ltLabel = t('common')('lithuanian');
  const enLabel = t('common')('english');

  return (
    <div className="flex items-center gap-2" aria-label={label} role="group">
      <button
        type="button"
        className={`px-3 py-1 rounded border ${
          locale === 'lt' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-900 border-gray-300'
        }`}
        onClick={() => setLocale('lt')}
        aria-pressed={locale === 'lt'}
      >
        {ltLabel}
      </button>
      <button
        type="button"
        className={`px-3 py-1 rounded border ${
          locale === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-900 border-gray-300'
        }`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        {enLabel}
      </button>
    </div>
  );
}

export default LanguageSwitcher;
