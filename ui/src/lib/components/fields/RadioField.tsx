"use client";
import * as React from 'react';
import { cn } from '../../utils/cn';
import { iconButtonClass } from './buttonStyles';

export type RadioFieldProps = {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
  className?: string;
};

/**
 * Radio styled to align with pill/icon button aesthetics (44px circle).
 * Keeps a native radio input for accessibility (visually hidden) and renders
 * a pill-styled control that shows a dot when selected.
 */
export function RadioField({ id, name, checked, onChange, ariaLabel, className }: RadioFieldProps) {
  return (
    <label htmlFor={id} className="inline-flex items-center justify-center">
      <input
        id={id}
        name={name}
        type="radio"
        checked={checked}
        onChange={onChange}
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
        {checked ? '●' : ''}
      </span>
    </label>
  );
}
