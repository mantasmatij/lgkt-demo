"use client";
import React from 'react';
import { LocaleProvider } from '../../i18n/LocaleProvider';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}

export { useI18n } from '../../i18n/LocaleProvider';
