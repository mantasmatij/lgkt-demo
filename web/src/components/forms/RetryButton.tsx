"use client";
import { useRouter } from 'next/navigation';

export function RetryButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="ml-2 inline-flex items-center px-3 py-1 rounded border border-red-300 text-red-800 hover:bg-red-100"
      onClick={() => router.refresh()}
      aria-label="Retry loading"
    >
      Retry
    </button>
  );
}
