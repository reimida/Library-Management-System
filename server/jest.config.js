/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testMatch: ['<rootDir>/test/**/*.test.(ts|js)'],
  testTimeout: 60000,
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // If you are using absolute imports, adjust path if needed
  },
  globals: {
    NODE_ENV: 'test'
  }
}; 