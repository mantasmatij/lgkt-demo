import { isActive, getActiveItemId } from '../activeMatch';
import { NavigationItem } from '../navItems';

describe('activeMatch logic (T019)', () => {
  const items: NavigationItem[] = [
    { id: 'companies', labelKey: 'nav.companies', route: '/admin/companies', order: 1, activeMatch: '/admin/companies' },
    { id: 'forms', labelKey: 'nav.forms', route: '/admin/forms', order: 2, activeMatch: '/admin/forms' },
    { id: 'regex', labelKey: 'nav.reports', route: '/admin/reports', order: 3, activeMatch: '/^/admin/reports(/.*)?$/' }
  ];

  it('prefix match works', () => {
    expect(isActive('/admin/forms', items[1])).toBe(true);
    expect(isActive('/admin/forms/edit', items[1])).toBe(true);
    expect(isActive('/admin/form', items[1])).toBe(false);
  });

  it('regex literal match works', () => {
    expect(isActive('/admin/reports', items[2])).toBe(true);
    expect(isActive('/admin/reports/daily', items[2])).toBe(true);
    expect(isActive('/admin/report', items[2])).toBe(false);
  });

  it('getActiveItemId returns first matching id', () => {
    expect(getActiveItemId('/admin/reports/daily', items)).toBe('regex');
  });

  it('returns null when no match', () => {
    expect(getActiveItemId('/admin/unknown', items)).toBeNull();
  });
});
