module.exports = {
  extends: [
    'plugin:jsdoc/recommended',
    'plugin:markdown/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:import/warnings',
    'plugin:mocha/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'mocha', 'prettier', 'promise', 'jsdoc'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    es6: true,
    node: true,
  },
  root: true,
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
    node: {
      resolvePaths: ['node_modules/@types', 'src/@types'],
      tryExtensions: ['.js', '.json', '.node', '.ts', '.d.ts', '.md'],
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'no-empty': ['error', {allowEmptyCatch: true}],
  },
  overrides: [],
};
