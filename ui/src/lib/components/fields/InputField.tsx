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
  // Inline error rendering to guarantee visibility with our external label layout
  // HeroUI also renders errorMessage internally; we mirror it below for consistency with our custom styles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inlineError = (rest as any).errorMessage as React.ReactNode | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isInvalid = Boolean((rest as any).isInvalid);
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
      {isInvalid && inlineError ? (
        <div className="text-sm text-red-600 mt-2" role="alert">{inlineError}</div>
      ) : null}
    </div>
  );
}
