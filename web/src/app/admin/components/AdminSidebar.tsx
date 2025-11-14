"use client";
import React from 'react';
import { getSortedNavItems, getActiveItemId } from '../../../lib/navigation';
import AdminNavItem from './AdminNavItem';
import { usePathname } from 'next/navigation';

// Phase 2: Foundational wiring (T013, T014)
// - Renders static nav items
// - Adds semantic navigation landmarks & aria-label
// - Computes active item id using current pathname
// NOTE: Collapse, language switch, analytics added in later tasks.
export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const items = getSortedNavItems();
  const activeId = getActiveItemId(pathname || '', items);

  return (
    <aside
      className="w-64 p-4 border-l border-gray-200 hidden md:block bg-white"
      data-phase="foundation"
    >
      <nav role="navigation" aria-label="Admin Navigation" className="space-y-1">
        {items.map(item => (
          <AdminNavItem
            key={item.id}
            id={item.id}
            label={item.label}
            href={item.route}
            active={item.id === activeId}
          />
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
