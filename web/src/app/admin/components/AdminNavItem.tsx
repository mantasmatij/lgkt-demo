"use client";
import React from 'react';

export interface AdminNavItemProps {
  label: string;
  href: string;
}

// Basic item component placeholder (T002)
export const AdminNavItem: React.FC<AdminNavItemProps> = ({ label, href }) => {
  return (
    <a
      href={href}
      className="block py-2 px-3 rounded hover:bg-gray-50 text-sm text-gray-700"
      data-phase="setup"
    >
      {label}
    </a>
  );
};

export default AdminNavItem;
