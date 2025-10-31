"use client";
import * as React from 'react';
import { Input, type InputProps } from '@heroui/react';
import { inputClassNames } from './fieldStyles';

export type InputFieldProps = Omit<InputProps, 'label'> & {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  labelClassName?: string;
};

export function InputField({ id, name, label, required, isRequired, labelClassName, ...rest }: InputFieldProps) {
  const req = required ?? isRequired ?? false;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={"text-black mb-2 " + (labelClassName ?? "font-medium")}>
        {label}{req ? ' *' : ''}
      </label>
      <Input
        id={id}
        name={name}
        variant="bordered"
        radius="full"
        size="md"
        aria-required={req ? 'true' : 'false'}
        classNames={inputClassNames}
        {...rest}
      />
    </div>
  );
}
