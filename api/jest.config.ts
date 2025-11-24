export default {
  displayName: 'api',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/src/test-setup/globalSetup.ts',
  maxWorkers: 1,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/api',
};
