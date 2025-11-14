const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const API_INTERNAL_ORIGIN = process.env.API_INTERNAL_ORIGIN || 'http://localhost:3001';

export type CompanyDetail = {
  id: string;
  name: string;
  code: string;
  type?: string | null;
  legalForm?: string | null;
  address?: string | null;
  registry?: string | null;
  eDeliveryAddress?: string | null;
};

export async function fetchCompanyDetail(companyId: string, init: RequestInit = {}): Promise<CompanyDetail> {
  const hdrs = {
    accept: 'application/json',
    ...(init.headers || {}),
  } as Record<string, string>;
  const primaryUrl = `${API_BASE}/api/admin/companies/${encodeURIComponent(companyId)}`;
  try {
    const res = await fetch(primaryUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (!res.ok) {
      const httpErr = new Error(`Failed to fetch company detail: ${res.status}`) as Error & { status?: number; body?: unknown };
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
    const fallbackUrl = `${API_INTERNAL_ORIGIN}/api/admin/companies/${encodeURIComponent(companyId)}`;
    const res2 = await fetch(fallbackUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (!res2.ok) {
      const httpErr = new Error(`Failed to fetch company detail (fallback): ${res2.status}`) as Error & { status?: number; body?: unknown };
      httpErr.name = 'HTTPError';
      httpErr.status = res2.status;
      try { httpErr.body = await res2.json(); } catch { /* ignore */ }
      throw httpErr;
    }
    return res2.json();
  }
}
