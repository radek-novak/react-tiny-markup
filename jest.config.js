module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist'],
  globals: {
    'ts-jest': {
      tsConfig: {
        target: 'es5',
        esModuleInterop: true,
        jsx: 'react'
      }
    }
  }
};
