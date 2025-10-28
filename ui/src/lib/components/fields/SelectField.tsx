"use client";
import * as React from 'react';
import { Select, type SelectProps } from '@heroui/react';
import { inputClassNames } from './fieldStyles';
import { cn } from '../../utils/cn';

export type SelectFieldProps = Omit<SelectProps, 'label'> & {
  id: string;
  name: string;
  label: string;
  required?: boolean;
};

export function SelectField({ id, name, label, required, isRequired, children, classNames: userClassNames, ...rest }: SelectFieldProps) {
  const req = required ?? isRequired ?? false;

  const mergedClassNames = {
    // Base pill wrapper, allow per-instance overrides (e.g., extra horizontal padding)
    trigger: cn(inputClassNames.inputWrapper, userClassNames?.trigger),
    // Inner value text
    value: cn(inputClassNames.input, userClassNames?.value),
    // External label slot (not used by us but kept consistent)
    label: cn(inputClassNames.label, userClassNames?.label),
    // Ensure wrapper height stays auto; allow overrides
    mainWrapper: cn(inputClassNames.mainWrapper, userClassNames?.mainWrapper),
    // Dropdown popover styling
    popoverContent: cn('border-2 border-black rounded-2xl overflow-hidden bg-white', userClassNames?.popoverContent),
    // Listbox styling
    listbox: cn('p-0 bg-white [&_[role=option]:hover]:bg-gray-100 [&_[role=option][data-hover=true]]:bg-gray-100', userClassNames?.listbox),
  } as SelectProps['classNames'];
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-black font-medium mb-2">
        {label}{req ? ' *' : ''}
      </label>
      <Select
        id={id}
        name={name}
        variant="bordered"
        radius="full"
        size="md"
        aria-required={req ? 'true' : 'false'}
        classNames={mergedClassNames}
        {...rest}
      >
        {children}
      </Select>
    </div>
  );
}
