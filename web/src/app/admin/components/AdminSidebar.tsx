"use client";
import React from 'react';
import { getSortedNavItems, getActiveItemId } from '../../../lib/navigation';
import { translateNav } from '../../../lib/navigation/i18n';
import { getNavIcon } from '../../../lib/navigation/icons';
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
        {items.map(item => {
          const label = translateNav(item.labelKey);
          const icon = getNavIcon(item, label);
          return (
            <AdminNavItem
              key={item.id}
              id={item.id}
              label={label}
              href={item.route}
              active={item.id === activeId}
              icon={icon}
            />
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
