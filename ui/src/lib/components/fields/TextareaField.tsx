"use client";
import * as React from 'react';
import { Textarea, type TextAreaProps } from '@heroui/react';
import { textareaClassNames } from './fieldStyles';
import { cn } from '../../utils/cn';

export type TextareaFieldProps = Omit<TextAreaProps, 'label'> & {
  id: string;
  name: string;
  label: string;
  required?: boolean;
};

export function TextareaField({ id, name, label, required, isRequired, classNames: userClassNames, ...rest }: TextareaFieldProps) {
  const req = required ?? isRequired ?? false;
  const mergedClassNames = {
    inputWrapper: cn(textareaClassNames.inputWrapper, userClassNames?.inputWrapper),
    input: cn(textareaClassNames.input, userClassNames?.input),
    label: cn(textareaClassNames.label, userClassNames?.label),
    mainWrapper: cn(textareaClassNames.mainWrapper, userClassNames?.mainWrapper),
  } as TextAreaProps['classNames'];
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-black font-medium mb-2">
        {label}{req ? ' *' : ''}
      </label>
      <Textarea
        id={id}
        name={name}
        variant="bordered"
        radius="full"
        size="md"
        aria-required={req ? 'true' : 'false'}
        classNames={mergedClassNames}
        {...rest}
      />
    </div>
  );
}
