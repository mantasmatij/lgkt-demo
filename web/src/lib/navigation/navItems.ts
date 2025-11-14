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

// initial list (order ascending). Settings is a placeholder for future expansion.
export const navItems: NavigationItem[] = [
  {
    id: 'companies',
    labelKey: 'nav.companies',
    route: '/admin/companies',
    icon: 'building',
    order: 1,
    roles: baseRole,
    activeMatch: '/admin/companies'
  },
  {
    id: 'forms-reports',
    labelKey: 'nav.formsReports',
    route: '/admin/forms',
    icon: 'forms',
    order: 2,
    roles: baseRole,
    activeMatch: '/admin/forms'
  },
  {
    id: 'submissions-exports',
    labelKey: 'nav.submissionsExports',
    route: '/admin/submissions',
    icon: 'inbox',
    order: 3,
    roles: baseRole,
    activeMatch: '/admin/submissions'
  },
  {
    id: 'settings',
    labelKey: 'nav.settings',
    route: '/admin/settings',
    icon: 'settings',
    order: 99,
    roles: baseRole,
    activeMatch: '/admin/settings'
  }
];

/**
 * Returns the navigation items sorted by order (defensive copy).
 */
export function getSortedNavItems(): NavigationItem[] {
  return [...navItems].sort((a, b) => a.order - b.order);
}
