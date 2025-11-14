/**
 * Active route matching logic (T012).
 * Supports two modes:
 * 1. explicit activeMatch pattern (string)
 *    - if it looks like a regex literal (/.../) treat as RegExp
 *    - otherwise treat as prefix match
 * 2. fallback: prefix match using item.route
 */
import { NavigationItem } from './navItems';

const REGEX_LITERAL = /^\/(.*)\/([gimsuy]*)$/;

export interface ActiveMatchOptions {
  /** If true, matching ignores query string & hash fragments */
  stripQuery?: boolean;
  /** Case sensitivity toggle (default true) */
  caseSensitive?: boolean;
}

function normalizePath(path: string, stripQuery: boolean): string {
  if (stripQuery) {
    const idx = path.indexOf('?');
    const hashIdx = path.indexOf('#');
    let cut = path;
    if (idx >= 0) cut = cut.substring(0, idx);
    if (hashIdx >= 0) cut = cut.substring(0, hashIdx);
    return cut;
  }
  return path;
}

export function isActive(currentPath: string, item: NavigationItem, opts: ActiveMatchOptions = {}): boolean {
  const { stripQuery = true, caseSensitive = true } = opts;
  const path = normalizePath(currentPath, stripQuery);
  const candidate = item.activeMatch || item.route;

  // Regex literal detection
  const match = candidate.match(REGEX_LITERAL);
  if (match) {
    try {
      const pattern = match[1];
      const flags = match[2];
      const regex = new RegExp(pattern, flags);
      return regex.test(path);
    } catch {
      // Fallback to prefix if regex fails to compile
    }
  }

  if (!caseSensitive) {
    return path.toLowerCase().startsWith(candidate.toLowerCase());
  }
  return path.startsWith(candidate);
}

/**
 * Given a list of items returns the id of the first active one or null.
 */
export function getActiveItemId(currentPath: string, items: NavigationItem[], opts?: ActiveMatchOptions): string | null {
  for (const item of items) {
    if (isActive(currentPath, item, opts)) return item.id;
  }
  return null;
}
