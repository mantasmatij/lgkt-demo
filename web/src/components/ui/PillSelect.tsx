"use client";
import * as React from 'react';
import { Select, SelectItem } from '@heroui/react';
// Import through ui package barrel
import { cn } from 'ui';

const inputClassNames = {
  inputWrapper:
    "h-11 min-h-11 rounded-full border-2 border-black data-[hover=true]:border-black/80 px-2 flex items-center shadow-sm outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0 data-[focus=true]:!ring-0 data-[focus-visible=true]:!ring-0 data-[focus=true]:!border-black data-[focus-visible=true]:!border-black",
  input: "text-base leading-6 py-0 px-2 placeholder:text-gray-400 appearance-none outline-none focus:!outline-none focus-visible:!outline-none ring-0 focus:!ring-0 focus-visible:!ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0",
};

export interface PillSelectOption { value: string; label: string }
export interface PillSelectProps {
  id: string;
  label?: string;
  value: string | undefined;
  onChange: (val: string) => void;
  options: PillSelectOption[];
  placeholder?: string; // Shown when empty; NOT selectable
  disabled?: boolean;
  className?: string;
  maxVisible?: number; // default 5
  autoWidth?: boolean; // Width matches displayed text
}

// Reusable pill-style select matching public form SelectField styling.
// Shows a scrollable list if options exceed maxVisible.
export function PillSelect({ id, label, value, onChange, options, placeholder, disabled, className = '', maxVisible = 5, autoWidth = true }: PillSelectProps) {
  const selected = value ? [value] : [];
  const displayText = value ? (options.find(o => o.value === value)?.label || value) : (placeholder || '');
  // Widen default width baseline; cap at 52ch for readability.
  const approxCh = Math.min(52, Math.max(16, displayText.length + 4));
  const dynamicStyle = autoWidth ? { width: `${approxCh}ch`, minWidth: '20rem' } : { minWidth: '20rem' };
  return (
    <div className={cn('flex flex-col gap-1', className)} style={dynamicStyle}>
      {label && <label htmlFor={id} className="text-sm font-medium text-black">{label}</label>}
      <Select
        id={id}
        name={id}
        selectedKeys={selected as any}
        onSelectionChange={(keys) => {
          const k = Array.from(keys as Set<string>)[0];
          onChange(k || '');
        }}
        isDisabled={disabled}
        variant="bordered"
        radius="full"
        size="md"
        classNames={{
          trigger: cn(inputClassNames.inputWrapper, 'min-w-[20rem]'),
          value: inputClassNames.input,
          popoverContent: cn('border-2 border-black rounded-2xl bg-white overflow-hidden'),
          listbox: cn('p-0 bg-white overflow-y-auto'),
        }}
        listboxProps={{
          style: { maxHeight: `${maxVisible * 44}px` },
        }}
        popoverProps={{ className: 'border-0 shadow-none' }}
        aria-label={displayText || label || id}
        // Custom render value to show placeholder when empty
        renderValue={() => (
          <span className="text-base px-2">{displayText}</span>
        )}
      >
        {options.map(o => (
          <SelectItem key={o.value}>{o.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

export default PillSelect;