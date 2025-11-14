"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RetryButton } from '../../../../components/forms/RetryButton';

export default function CompanyError({ error }: { error: Error & { digest?: string } }) {
  const router = useRouter();
  useEffect(() => {
    console.error('[company-detail] route error', error);
  }, [error]);
  return (
    <main className="p-6">
      <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 rounded">
        <p>Failed to load company detail.</p>
        <div className="mt-2 flex items-center gap-2">
          <RetryButton />
          <button
            type="button"
            className="px-3 py-1 border rounded"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            Back
          </button>
        </div>
      </div>
    </main>
  );
}
