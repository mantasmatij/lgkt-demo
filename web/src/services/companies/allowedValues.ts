const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const API_INTERNAL_ORIGIN = process.env.API_INTERNAL_ORIGIN || 'http://localhost:3001';

export type CompaniesAllowedValues = {
  types: string[];
  registries: string[];
};

export async function fetchCompanyAllowedValues(init: RequestInit = {}): Promise<CompaniesAllowedValues> {
  const hdrs = {
    accept: 'application/json',
    ...(init.headers || {}),
  } as Record<string, string>;
  const primaryUrl = `${API_BASE}/api/admin/companies/allowed-values`;
  try {
    const res = await fetch(primaryUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (!res.ok) {
      const httpErr = new Error(`Failed to fetch allowed values: ${res.status}`) as Error & { status?: number; body?: unknown };
      httpErr.name = 'HTTPError';
      httpErr.status = res.status;
      try { httpErr.body = await res.json(); } catch { /* ignore */ }
      throw httpErr;
    }
    return res.json();
  } catch (e) {
    const isServer = typeof window === 'undefined';
    const usingRelative = (API_BASE ?? '') === '' || primaryUrl.startsWith('/');
    if (!isServer || !usingRelative) throw e;
    const fallbackUrl = `${API_INTERNAL_ORIGIN}/api/admin/companies/allowed-values`;
    const res2 = await fetch(fallbackUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (!res2.ok) {
      const httpErr = new Error(`Failed to fetch allowed values (fallback): ${res2.status}`) as Error & { status?: number; body?: unknown };
      httpErr.name = 'HTTPError';
      httpErr.status = res2.status;
      try { httpErr.body = await res2.json(); } catch { /* ignore */ }
      throw httpErr;
    }
    return res2.json();
  }
}
