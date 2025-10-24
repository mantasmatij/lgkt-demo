import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/theme';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../ui/src/**/*.{js,ts,jsx,tsx}',
    // NextUI theme tokens (monorepo-safe globs)
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
} satisfies Config;
