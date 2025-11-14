import React from 'react';
import { NavigationItem } from './navItems';

// Icon mapping placeholder (T022) - replace with HeroUI icons later.
const iconMap: Record<string, React.ReactNode> = {
  building: '🏢',
  forms: '📝',
  inbox: '📥',
  settings: '⚙️'
};

export function getNavIcon(item: NavigationItem, label: string): React.ReactNode {
  const icon = item.icon && iconMap[item.icon];
  if (icon) return icon;
  // Fallback: first two uppercase letters.
  const letters = label.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
  return <span className="inline-block w-6 text-center font-semibold" aria-hidden>{letters}</span>;
}
