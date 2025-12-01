import type { ListResponse } from 'validation';

const API_BASE = '' as const;
const API_INTERNAL_ORIGIN = process.env.API_INTERNAL_ORIGIN || 'http://localhost:3001';

export async function fetchForms(queryString: string, init: RequestInit = {}): Promise<ListResponse> {
  const hdrs = {
    accept: 'application/json',
    ...(init.headers || {}),
  } as Record<string, string>;
  const primaryUrl = `${API_BASE}/api/admin/forms${queryString}`;
  try {
    const res = await fetch(primaryUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (!res.ok) {
      const httpErr = new Error(`Failed to fetch forms: ${res.status}`) as Error & { status?: number; body?: unknown };
      httpErr.name = 'HTTPError';
      httpErr.status = res.status;
      try {
        httpErr.body = await res.json();
      } catch {
        // ignore body parse errors
      }
      throw httpErr;
    }
    return res.json();
  } catch (e) {
    // On the server, if the relative/rewritten request failed (e.g., dev proxy not available),
    // fallback to calling the API service directly via API_INTERNAL_ORIGIN.
    const isServer = typeof window === 'undefined';
    const usingRelative = (API_BASE ?? '') === '' || primaryUrl.startsWith('/');
    if (!isServer || !usingRelative) {
      throw e;
    }
    const fallbackUrl = `${API_INTERNAL_ORIGIN}/api/admin/forms${queryString}`;
    const res2 = await fetch(fallbackUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (!res2.ok) {
      const httpErr = new Error(`Failed to fetch forms (fallback): ${res2.status}`) as Error & { status?: number; body?: unknown };
      httpErr.name = 'HTTPError';
      httpErr.status = res2.status;
      try {
        httpErr.body = await res2.json();
      } catch {
        // ignore body parse errors
      }
      throw httpErr;
    }
    return res2.json();
  }
}

export async function fetchFormById(id: string, init: RequestInit = {}) {
  const hdrs = {
    accept: 'application/json',
    ...(init.headers || {}),
  } as Record<string, string>;
  const primaryUrl = `${API_BASE}/api/admin/forms/${encodeURIComponent(id)}`;
  try {
    const res = await fetch(primaryUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      const httpErr = new Error(`Failed to fetch form details: ${res.status}`) as Error & { status?: number; body?: unknown };
      httpErr.name = 'HTTPError';
      httpErr.status = res.status;
      try {
        httpErr.body = await res.json();
      } catch {
        // ignore body parse errors
      }
      throw httpErr;
    }
    return res.json();
  } catch (e) {
    const isServer = typeof window === 'undefined';
    const usingRelative = (API_BASE ?? '') === '' || primaryUrl.startsWith('/');
    if (!isServer || !usingRelative) throw e;
    const fallbackUrl = `${API_INTERNAL_ORIGIN}/api/admin/forms/${encodeURIComponent(id)}`;
    const res2 = await fetch(fallbackUrl, {
      credentials: 'include',
      headers: hdrs,
      cache: 'no-store',
      ...init,
    });
    if (res2.status === 404) return null;
    if (!res2.ok) {
      const httpErr = new Error(`Failed to fetch form details (fallback): ${res2.status}`) as Error & { status?: number; body?: unknown };
      httpErr.name = 'HTTPError';
      httpErr.status = res2.status;
      try {
        httpErr.body = await res2.json();
      } catch {
        // ignore body parse errors
      }
      throw httpErr;
    }
    return res2.json();
  }
}
