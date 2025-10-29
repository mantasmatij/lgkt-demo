"use client";
import * as React from 'react';
import { cn } from '../../utils/cn';
import { iconButtonClass } from './buttonStyles';

export type CheckboxFieldProps = {
  id: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  className?: string;
};

/**
 * Checkbox styled to align with pill/icon button aesthetics (44px circle).
 * Keeps a native checkbox for accessibility (visually hidden) and renders
 * a pill-styled control that shows a checkmark when selected.
 */
export function CheckboxField({ id, name, checked, onChange, ariaLabel, className }: CheckboxFieldProps) {
  return (
    <label htmlFor={id} className="inline-flex items-center justify-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          iconButtonClass,
          // Unchecked state: invert to white background with dark text
          !checked && 'bg-white text-[#292929]',
          className
        )}
      >
        {checked ? '✓' : ''}
      </span>
    </label>
  );
}
