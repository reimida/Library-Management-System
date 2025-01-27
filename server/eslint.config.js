module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    // Add or override rules here if needed.
    // For example, to explicitly require function return types (as per your project rules):
    '@typescript-eslint/explicit-function-return-type': 'warn',
  },
  ignorePatterns: ['dist', 'node_modules'], //  Exclude build and dependency folders.
}; 