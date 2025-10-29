"use client";

import { Card } from '@heroui/react';
import Link from 'next/link';
import { pillButtonClass } from 'ui';
import { useI18n } from '../../providers/i18n-provider';

export default function FormSuccessPage() {
  const { t } = useI18n();
  const ts = t('success');
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card className="bg-green-50 border border-green-200 p-6 text-center">
        <div className="flex flex-col gap-3">
        <div className="mb-4">
          <svg
            className="mx-auto size-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {ts('title')}
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          {ts('body')}
        </p>
        <div className="space-y-4">
          <p className="text-gray-600">{ts('contact_prompt')}</p>
          <p className="text-gray-600 font-medium">
            {ts('contact_email_label')}: info@lgkt.lt
          </p>
        </div>
        
        <div>
          <Link href="/form" className={pillButtonClass}>
            {ts('submit_another')}
          </Link>
        </div>
        </div>
      </Card>
    </div>
  );
}
