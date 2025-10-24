import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  displayName: 'web',
  preset: '../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../coverage/web',
  testEnvironment: 'jsdom',
  // Exclude E2E tests - they should only run via Playwright
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
  // Ensure Jest exits cleanly; useful when Next.js or JSDOM leaves handles open in simple tests
  forceExit: true,
};

export default createJestConfig(config);
