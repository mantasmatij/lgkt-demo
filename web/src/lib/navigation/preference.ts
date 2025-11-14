// Collapse state preference helpers (T037)
// Provides unified read/write operations with sessionStorage primary & cookie fallback for SSR hydration.

const SESSION_KEY = 'adminSidebarCollapsed';
const COOKIE_KEY = 'adminSidebarCollapsed';

export function readCollapsedFromSession(): boolean | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  return raw === null ? null : raw === 'true';
}

export function writeCollapsedToSession(collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(SESSION_KEY, String(collapsed));
}

export function readCollapsedCookie(): boolean | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|; )${COOKIE_KEY}=([^;]*)`));
  if (!match) return null;
  return decodeURIComponent(match[2]) === 'true';
}

export function writeCollapsedCookie(collapsed: boolean): void {
  if (typeof document === 'undefined') return;
  try {
    // Simple session cookie; adjust max-age if persistence beyond session desired.
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(String(collapsed))}; path=/; SameSite=Lax`;
  } catch {/* ignore */}
}

/** Determine initial collapsed state preferring sessionStorage then cookie. */
export function getInitialCollapsedState(): boolean {
  const session = readCollapsedFromSession();
  if (session != null) return session;
  const cookie = readCollapsedCookie();
  if (cookie != null) return cookie;
  return false; // default expanded
}

/** Persist collapsed state to both storages. */
export function persistCollapsedState(collapsed: boolean): void {
  writeCollapsedToSession(collapsed);
  writeCollapsedCookie(collapsed);
}

