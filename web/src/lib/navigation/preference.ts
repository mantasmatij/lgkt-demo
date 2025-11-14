// Preference helper placeholder (T005)
// Collapse state helpers will be implemented in later phases.

export function readCollapsedFromSession(): boolean | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem('adminSidebarCollapsed');
  return raw === null ? null : raw === 'true';
}

export function writeCollapsedToSession(collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem('adminSidebarCollapsed', String(collapsed));
}

export function readCollapsedCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(^|; )adminSidebarCollapsed=([^;]*)/);
  return match ? decodeURIComponent(match[2]) : null;
}
