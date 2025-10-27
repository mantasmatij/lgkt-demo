import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../ui/src/**/*.{js,ts,jsx,tsx}',
    // HeroUI theme tokens (monorepo-safe globs)
    './node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 8-point grid spacing scale (T020)
      spacing: {
        '1': '8px',   // 0.5rem
        '2': '16px',  // 1rem
        '3': '24px',  // 1.5rem
        '4': '32px',  // 2rem
        '5': '40px',  // 2.5rem
        '6': '48px',  // 3rem
        '8': '64px',  // 4rem
        '10': '80px', // 5rem
        '12': '96px', // 6rem
      },
      // Map fontAndColour.css color variables (T021)
      // These are available at runtime via CSS variables
      colors: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0',
        light: '#f8f9fa',
        dark: '#212529',
      },
      // Map fontAndColour.css font families (T022)
      fontFamily: {
        sans: 'var(--bs-body-font-family)',
        mono: 'var(--bs-font-monospace)',
      },
    },
  },
  // Configure HeroUI theme colors (T023)
  plugins: [
    // @ts-expect-error - HeroUI plugin type mismatch with Tailwind CSS types
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#0d6efd',
              foreground: '#ffffff',
            },
            success: {
              DEFAULT: '#198754',
              foreground: '#ffffff',
            },
            danger: {
              DEFAULT: '#dc3545',
              foreground: '#ffffff',
            },
            warning: {
              DEFAULT: '#ffc107',
              foreground: '#212529',
            },
            focus: '#0d6efd',
          },
        },
      },
    }),
  ],
} satisfies Config;
