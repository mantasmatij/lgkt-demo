'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AuthGate() {
  const router = useRouter();
  useEffect(() => {
    async function check() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
        const res = await fetch(`${API_BASE}/api/admin/forms?page=1&pageSize=1`, { credentials: 'include' });
        if (res.status === 401) {
          router.push('/admin/sign-in');
          return;
        }
        if (res.status === 403) {
          // Authenticated but not admin; send to dashboard
          router.push('/admin/dashboard');
          return;
        }
      } catch {
        // ignore network errors for gate; page handles UI errors separately
      }
    }
    check();
  }, [router]);
  return null;
}
