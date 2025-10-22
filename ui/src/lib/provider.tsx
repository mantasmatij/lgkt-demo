"use client";
import * as React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import '../styles/fontAndColour.css';

// Lightweight UI provider to centralize theming; NextUI wiring will be added here.

export type UIProviderProps = {
  children: React.ReactNode;
};

export function UIProvider({ children }: UIProviderProps) {
  // Wrap the app with NextUI provider; theme setup will be extended as needed.
  return <NextUIProvider>{children}</NextUIProvider>;
}
