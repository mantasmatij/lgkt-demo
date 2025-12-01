const API_BASE = '' as const;
const API_INTERNAL_ORIGIN = process.env.API_INTERNAL_ORIGIN || 'http://localhost:3001';

export type CompanySubmission = {
  id: string;
  dateFrom?: string | null;
  dateTo?: string | null;
  womenPercent: number;
  menPercent: number;
  requirementsApplied: boolean;
  submitterEmail?: string | null;
  submittedAt: string;
};

export type CompanySubmissionsResponse = {
  items: CompanySubmission[];
  page: number;
  pageSize: number;
  total: number;
};

export async function fetchCompanySubmissions(companyId: string, query: string, init: RequestInit = {}): Promise<CompanySubmissionsResponse> {
  const hdrs = {
    accept: 'application/json',
    ...(init.headers || {}),
  } as Record<string, string>;
  const qs = query.startsWith('?') ? query : (query ? `?${query}` : '');
  const primaryUrl = `${API_BASE}/api/admin/companies/${encodeURIComponent(companyId)}/submissions${qs}`;
  try {
    const res = await fetch(primaryUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (!res.ok) {
      const httpErr = new Error(`Failed to fetch company submissions: ${res.status}`) as Error & { status?: number; body?: unknown };
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
    const fallbackUrl = `${API_INTERNAL_ORIGIN}/api/admin/companies/${encodeURIComponent(companyId)}/submissions${qs}`;
    const res2 = await fetch(fallbackUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (!res2.ok) {
      const httpErr = new Error(`Failed to fetch company submissions (fallback): ${res2.status}`) as Error & { status?: number; body?: unknown };
      httpErr.name = 'HTTPError';
      httpErr.status = res2.status;
      try { httpErr.body = await res2.json(); } catch { /* ignore */ }
      throw httpErr;
    }
    return res2.json();
  }
}
