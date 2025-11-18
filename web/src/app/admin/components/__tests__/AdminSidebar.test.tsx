// Updated unit test after foundational implementation (replaces skeleton expectations)
import React from 'react';
jest.mock('next/navigation', () => ({
  // Mock only what we use
  usePathname: () => '/admin/forms'
}));
import { render, screen, fireEvent } from '@testing-library/react';
import AdminSidebar from '../AdminSidebar';
import { navItems } from '../../../../lib/navigation/navItems';
import { translateNav } from '../../../../lib/navigation/i18n';
import { LocaleProvider } from '../../../../i18n/LocaleProvider';

describe('AdminSidebar foundational', () => {
  beforeEach(() => {
    // Mock fetch for locale provider (CSRF + locale get/set) to avoid network in tests
    global.fetch = jest.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes('/api/csrf')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'test' }) } as Response);
      }
      if (url.includes('/api/i18n/locale') && init && init.method === 'POST') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response);
      }
      if (url.includes('/api/i18n/locale')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ locale: 'lt' }) } as Response);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response);
    });
  });
  it('renders navigation landmark and items', () => {
    render(
      <LocaleProvider>
        <AdminSidebar />
      </LocaleProvider>
    );
    const nav = screen.getByRole('navigation', { name: /admin navigation/i });
    expect(nav).toBeTruthy();
    // Ensure each configured translated label appears
    for (const item of navItems) {
      const label = translateNav(item.labelKey, 'lt'); // default locale in provider
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it('marks active item with aria-current (placeholder test)', () => {
    // Simulate being on /admin/forms via mocked usePathname
    render(
      <LocaleProvider>
        <AdminSidebar />
      </LocaleProvider>
    );
    const link = screen.getByRole('link', { name: /užpildytos formos|submissions/i });
    expect((link as HTMLElement).getAttribute('aria-current')).toBe('page');
    // Active class should be applied
    expect((link as HTMLElement).className).toMatch(/bg-blue-50/);
  });

  it('changes language when selecting English (T034)', async () => {
    render(
      <LocaleProvider>
        <AdminSidebar />
      </LocaleProvider>
    );
    const select = screen.getByTestId('admin-lang-select');
  expect((select as HTMLSelectElement).value).toBe('lt');
  fireEvent.change(select, { target: { value: 'en' } });
    // After change, one of the Lithuanian labels should now be English.
    const companiesEn = await screen.findByText(translateNav('nav.companies', 'en'));
    expect(companiesEn).toBeTruthy();
  });
});
