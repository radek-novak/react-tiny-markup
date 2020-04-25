module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

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
