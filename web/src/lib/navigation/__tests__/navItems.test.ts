import { navItems, getSortedNavItems, NavigationItem } from '../navItems';

describe('navItems config (T019)', () => {
  it('all routes start with /admin/', () => {
    for (const item of navItems) {
      expect(item.route.startsWith('/admin/')).toBe(true);
    }
  });

  it('sorted order is ascending by order field', () => {
    const sorted = getSortedNavItems();
  const orders = sorted.map((i: NavigationItem) => i.order);
    const copy = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(copy);
  });

  it('ids are unique', () => {
  const ids = navItems.map((i: NavigationItem) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
