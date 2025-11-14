import { getInitialCollapsedState, persistCollapsedState, readCollapsedCookie, readCollapsedFromSession } from '../preference';

describe('collapse preference helpers (T043)', () => {
  beforeEach(() => {
    // Reset storages
    if (typeof window !== 'undefined') {
      window.sessionStorage.clear();
    }
    if (typeof document !== 'undefined') {
      // Clear cookie
      document.cookie = 'adminSidebarCollapsed=; Max-Age=0; path=/';
    }
  });

  it('initial state defaults to false when no storage present', () => {
    expect(getInitialCollapsedState()).toBe(false);
  });

  it('persistCollapsedState writes both session and cookie', () => {
    persistCollapsedState(true);
    expect(readCollapsedFromSession()).toBe(true);
    expect(readCollapsedCookie()).toBe(true);
  });
});
