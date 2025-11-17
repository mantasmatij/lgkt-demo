"use client";
import React, { KeyboardEvent, useCallback } from 'react';
import { trackNavClick } from '../../../lib/navigation/analytics';

export interface AdminNavItemProps {
  label: string;
  href: string;
  active?: boolean;
  id?: string;
  icon?: React.ReactNode;
  collapsed?: boolean;
}

export const AdminNavItem: React.FC<AdminNavItemProps> = ({ label, href, active = false, id, icon, collapsed }) => {
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      (e.currentTarget as HTMLAnchorElement).click();
    }
  }, []);

  const onClick = useCallback(() => {
    trackNavClick(id || href, href, !!collapsed);
  }, [href, id, collapsed]);

  return (
    <a
      id={id ? `nav-${id}` : undefined}
      href={href}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? label : undefined}
      className={[
        'block rounded text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500',
        collapsed ? 'py-2 px-2' : 'py-2 px-3',
        active ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200' : 'text-gray-700 hover:bg-gray-50'
      ].join(' ')}
      data-active={active || undefined}
      data-phase={active ? 'foundation-active' : 'foundation'}
    >
      <span className={[
        'inline-flex items-center w-full',
        collapsed ? 'justify-center gap-0' : 'gap-2'
      ].join(' ')}>
        {icon && <span className="inline-flex w-6 justify-center shrink-0" aria-hidden>{icon}</span>}
        <span className={collapsed ? 'sr-only' : undefined}>{label}</span>
      </span>
    </a>
  );
};

export default AdminNavItem;
