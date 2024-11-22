module.exports = {
  testEnvironment: 'jsdom',
  roots: ['./__tests__'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'jsx'],
  setupFilesAfterEnv: ['./__tests__/setupTests.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFiles: ['./jest.setup.js'],
};
