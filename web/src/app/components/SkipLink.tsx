"use client";

import React from 'react';
import { useI18n } from '../providers/i18n-provider';

export function SkipLink() {
  const { t } = useI18n();
  const label = t('common')('skip_to_main');
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg"
    >
      {label}
    </a>
  );
}

export default SkipLink;
