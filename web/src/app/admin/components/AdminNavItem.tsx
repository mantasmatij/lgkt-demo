"use client";
import React, { KeyboardEvent, useCallback } from 'react';

export interface AdminNavItemProps {
  label: string;
  href: string;
  active?: boolean;
  /** internal id used for test selectors */
  id?: string;
}

// Phase 2 enhancements (T015, T016):
// - Keyboard activation via Enter/Space (anchors already handle Enter but Space is normalized)
// - Active state styling & aria-current
export const AdminNavItem: React.FC<AdminNavItemProps> = ({ label, href, active = false, id }) => {
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      (e.currentTarget as HTMLAnchorElement).click();
    }
  }, []);

  return (
    <a
      id={id ? `nav-${id}` : undefined}
      href={href}
      onKeyDown={onKeyDown}
      aria-current={active ? 'page' : undefined}
      className={[
        'block py-2 px-3 rounded text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500',
        active
          ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
          : 'text-gray-700 hover:bg-gray-50'
      ].join(' ')}
      data-active={active || undefined}
      data-phase={active ? 'foundation-active' : 'foundation'}
    >
      {label}
    </a>
  );
};

export default AdminNavItem;
