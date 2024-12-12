module.exports = {
  testEnvironment: 'jsdom',
  roots: ['./__tests__'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'jsx'],
  setupFilesAfterEnv: ['./__tests__/setupTests.js'],
  testTimeout: 10000,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFiles: [
    './jest.setup.js',
    'jest-canvas-mock',
    './__tests__/test-utils.js',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'html'],
};
