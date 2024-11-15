module.exports = {
  testEnvironment: 'jsdom',
  roots: ['./tests'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'jsx'],
  setupFilesAfterEnv: ['./tests/setupTests.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ['./tests/**/*.test.js'],
};
