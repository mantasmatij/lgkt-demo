/**
 * Unified analytics instrumentation (T017).
 * Provides helper functions for admin navigation related events and lightweight performance marks.
 * Implementation uses a pluggable dispatcher so integration layer can override.
 */

export type AdminAnalyticsEventName =
  | 'admin_nav_click'
  | 'admin_language_change'
  | 'admin_sidebar_toggle'
  | 'admin_perf_mark';

export interface BaseAdminEvent<T extends AdminAnalyticsEventName, P extends object> {
  name: T;
  payload: P;
  ts: number; // epoch ms
}

export interface NavClickPayload {
  itemId: string;
  route: string;
  collapsed: boolean;
}

export interface LanguageChangePayload {
  from: string;
  to: string;
  durationMs: number; // time until visible labels updated
  success: boolean;
}

export interface SidebarTogglePayload {
  collapsed: boolean;
  source: 'user' | 'auto' | 'hydrate';
}

export interface PerfMarkPayload {
  label: string;
  durationMs: number;
}

export type AdminAnalyticsEvent =
  | BaseAdminEvent<'admin_nav_click', NavClickPayload>
  | BaseAdminEvent<'admin_language_change', LanguageChangePayload>
  | BaseAdminEvent<'admin_sidebar_toggle', SidebarTogglePayload>
  | BaseAdminEvent<'admin_perf_mark', PerfMarkPayload>;

/**
 * Dispatcher signature. Allows host application to override delivery (e.g., dataLayer push, network call).
 */
export type AdminAnalyticsDispatcher = (event: AdminAnalyticsEvent) => void;

let dispatcher: AdminAnalyticsDispatcher | null = null;

export function setAdminAnalyticsDispatcher(fn: AdminAnalyticsDispatcher) {
  dispatcher = fn;
}

function deliver(event: AdminAnalyticsEvent) {
  if (typeof window === 'undefined') return; // SSR no-op
  if (dispatcher) {
    try {
      dispatcher(event);
      return;
    } catch (err) {
      // fall through to console for visibility
  console.warn('[admin-analytics] dispatcher error', err);
    }
  }
  // default console fallback
  console.log('[admin-analytics]', event.name, event.payload);
  // Fire a CustomEvent for optional listeners
  try {
    window.dispatchEvent(new CustomEvent(event.name, { detail: event.payload }));
  } catch {/* ignore */}
}

export function trackNavClick(itemId: string, route: string, collapsed: boolean) {
  deliver({ name: 'admin_nav_click', ts: Date.now(), payload: { itemId, route, collapsed } });
}

export function trackLanguageChange(from: string, to: string, durationMs: number, success: boolean) {
  deliver({ name: 'admin_language_change', ts: Date.now(), payload: { from, to, durationMs, success } });
}

export function trackSidebarToggle(collapsed: boolean, source: SidebarTogglePayload['source']) {
  deliver({ name: 'admin_sidebar_toggle', ts: Date.now(), payload: { collapsed, source } });
}

// Performance mark helpers ----------------------------------------------------
const perfStarts: Record<string, number> = {};

export function markPerfStart(label: string) {
  perfStarts[label] = performance.now();
}

export function markPerfEnd(label: string) {
  const start = perfStarts[label];
  if (start == null) return;
  const durationMs = performance.now() - start;
  delete perfStarts[label];
  deliver({ name: 'admin_perf_mark', ts: Date.now(), payload: { label, durationMs } });
}
