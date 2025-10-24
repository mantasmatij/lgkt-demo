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
      colors: {
        primary: 'var(--bs-primary)',
        secondary: 'var(--bs-secondary)',
        success: 'var(--bs-success)',
        danger: 'var(--bs-danger)',
        warning: 'var(--bs-warning)',
        info: 'var(--bs-info)',
        light: 'var(--bs-light)',
        dark: 'var(--bs-dark)',
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
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: 'var(--bs-primary)',
              foreground: 'var(--bs-white)',
            },
            success: {
              DEFAULT: 'var(--bs-success)',
              foreground: 'var(--bs-white)',
            },
            danger: {
              DEFAULT: 'var(--bs-danger)',
              foreground: 'var(--bs-white)',
            },
            warning: {
              DEFAULT: 'var(--bs-warning)',
              foreground: 'var(--bs-dark)',
            },
            focus: 'var(--bs-primary)',
          },
        },
      },
    }) as any,
  ],
} satisfies Config;
