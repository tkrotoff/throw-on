// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaults } = require('jest-config');

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['./jest.setup.ts'],

  // By default Jest allows for __tests__/*.js, *.spec.js and *.test.js
  // https://jestjs.io/docs/en/configuration#testregex-string-array-string
  // Let's be strict and use *.test.js only
  testRegex: '\\.test\\.tsx?$',

  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },

  coveragePathIgnorePatterns: [
    ...defaults.coveragePathIgnorePatterns,
    'test-util-format.js',
    'test-util-inspect.js'
  ]
};

module.exports = config;
