"use client";
import * as React from 'react';

// Lightweight UI provider to centralize theming; NextUI wiring will be added here.

export type UIProviderProps = {
  children: React.ReactNode;
};

export function UIProvider({ children }: UIProviderProps) {
  return <>{children}</>; // Placeholder until NextUI is wired
}
