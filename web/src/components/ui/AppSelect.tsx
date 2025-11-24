"use client";
import React from 'react';
interface AppSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id?: string;
  options: Array<{ value: string; label: string }>;
  placeholderOption?: string;
}

export function AppSelect({ label, id, options, placeholderOption, className = '', ...rest }: AppSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-800">{label}</label>}
      <div className="relative">
        <select
          id={id}
          className={"h-11 px-3 pr-9 rounded-full border-2 border-gray-300 bg-white text-base text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 " + className}
          {...rest}
        >
          {placeholderOption && <option value="">{placeholderOption}</option>}
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-xs">▾</span>
      </div>
    </div>
  );
}