const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-config-prettier');
const globals = require('globals');
const importHelpers = require('eslint-plugin-import-helpers');

module.exports =  [
  js.configs.recommended,
  {
    ignores: [
      'dist/**/*',
      'node_modules/',
      'coverage/',
      '**/*.js',
      'test/**/*.spec.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.jest, // Добавляем глобальные переменные Jest
        Express: true,
      },
    },
    settings: {
      node: true,
      jest: true,
    },
    plugins: {
      '@typescript-eslint': typescript,
      'import-helpers': importHelpers,
    },
    rules: {
      ...typescript.configs['recommended'].rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Import helpers
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',
          groups: [
            ['/^@nestjs//'],
            ['module'],
            ['/^@\//'],
            ['parent', 'sibling', 'index']
          ],
          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],
    },
  },
  prettier,
];
