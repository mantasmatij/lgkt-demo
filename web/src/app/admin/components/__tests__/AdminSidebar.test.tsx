// Updated unit test after foundational implementation (replaces skeleton expectations)
import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminSidebar from '../AdminSidebar';
import { navItems } from '../../../../lib/navigation/navItems';

describe('AdminSidebar foundational', () => {
  it('renders navigation landmark and items', () => {
    render(<AdminSidebar />);
    const nav = screen.getByRole('navigation', { name: /admin navigation/i });
    expect(nav).toBeTruthy();
    // Ensure each configured label appears
    for (const item of navItems) {
      expect(screen.getByText(item.label)).toBeTruthy();
    }
  });
});
