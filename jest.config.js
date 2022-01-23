module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // default: [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ]
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
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
