"use client";
import React, { KeyboardEvent, useCallback } from 'react';
import { trackNavClick } from '../../../lib/navigation/analytics';

export interface AdminNavItemProps {
  label: string; // translated label
  href: string;
  active?: boolean;
  id?: string; // internal id used for test selectors
  icon?: React.ReactNode;
  collapsed?: boolean; // future use when collapse implemented (T037)
}

// Phase 2 enhancements (T015, T016):
// - Keyboard activation via Enter/Space (anchors already handle Enter but Space is normalized)
// - Active state styling & aria-current
export const AdminNavItem: React.FC<AdminNavItemProps> = ({ label, href, active = false, id, icon, collapsed }) => {
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      (e.currentTarget as HTMLAnchorElement).click();
    }
  }, []);

  const onClick = useCallback(() => {
    // Use client-side navigation; default anchor will work but we capture analytics first.
    trackNavClick(id || href, href, !!collapsed);
  }, [href, id, collapsed]);

  return (
    <a
      id={id ? `nav-${id}` : undefined}
      href={href}
      onClick={onClick}
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
      <span className="inline-flex items-center gap-2">
        {icon && <span className="shrink-0" aria-hidden>{icon}</span>}
        <span>{label}</span>
      </span>
    </a>
  );
};

export default AdminNavItem;
