/**
 * Static navigation item configuration (T011).
 * NOTE: Labels will be converted to i18n keys in T021.
 */
export interface NavigationItem {
  id: string;
  labelKey: string; // i18n key (T021)
  route: string; // must start with /admin
  icon?: string; // icon mapping key (T022)
  order: number;
  roles?: string[]; // defaults to ['admin'] if omitted
  activeMatch?: string; // optional pattern (prefix or regex literal string)
}

const baseRole = ['admin'];

// Updated list and order per requirements
export const navItems: NavigationItem[] = [
  {
    id: 'submissions',
    labelKey: 'nav.submissions',
    route: '/admin/forms',
    icon: 'inbox',
    order: 1,
    roles: baseRole,
    activeMatch: '/admin/forms'
  },
  {
    id: 'companies',
    labelKey: 'nav.companies',
    route: '/admin/companies',
    icon: 'building',
    order: 2,
    roles: baseRole,
    activeMatch: '/admin/companies'
  },
  {
    id: 'reports',
    labelKey: 'nav.reports',
    route: '/admin/reports',
    icon: 'report',
    order: 3,
    roles: baseRole,
    activeMatch: '/admin/reports'
  }
];

/**
 * Returns the navigation items sorted by order (defensive copy).
 */
export function getSortedNavItems(): NavigationItem[] {
  return [...navItems].sort((a, b) => a.order - b.order);
}
