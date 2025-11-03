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
      // Brand color palette (replaces Bootstrap defaults)
      colors: {
        // Core tokens
        primary: '#292929',
        secondary: '#606060',
        success: '#00A87D',
        danger: '#F1754B',
        warning: '#F1BA3C',
        info: '#6599C1',
        light: '#EDEDE6',
        dark: '#292929',
        // Extended brand set for utility usage
        brand: {
          ink: '#292929',
          gray: '#606060',
          paper: '#EDEDE6',
          bronze: '#B99269',
          gold: '#F1BA3C',
          slate: '#4D5C71',
          mist: '#88A0A8',
          wine: '#773849',
          peach: '#FBBEAC',
          sky: '#6599C1',
          skyLight: '#AFC8DA',
          green: '#00A87D',
          orange: '#F1754B',
        },
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
              DEFAULT: '#292929',
              foreground: '#ffffff',
            },
            success: {
              DEFAULT: '#00A87D',
              foreground: '#ffffff',
            },
            danger: {
              DEFAULT: '#F1754B',
              foreground: '#ffffff',
            },
            warning: {
              DEFAULT: '#F1BA3C',
              foreground: '#212529',
            },
            focus: '#4D5C71',
          },
        },
      },
    }),
  ],
} satisfies Config;
