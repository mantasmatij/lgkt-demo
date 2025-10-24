"use client";
import * as React from 'react';
import { HeroUIProvider } from '@heroui/react';
import '../styles/fontAndColour.css';

// Lightweight UI provider to centralize theming; HeroUI wiring added here.

export type UIProviderProps = {
  children: React.ReactNode;
};

export function UIProvider({ children }: UIProviderProps) {
  // Wrap the app with HeroUI provider; theme setup will be extended as needed.
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
