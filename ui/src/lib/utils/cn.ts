import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with conditional logic.
 * Combines clsx for conditional classes and tailwind-merge to prevent conflicts.
 * 
 * @example
 * ```tsx
 * cn('gap-2', isActive && 'bg-primary', className)
 * ```
 * 
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
