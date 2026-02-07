import eslint from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintPrettier from 'eslint-plugin-prettier'
import importSort from 'eslint-plugin-simple-import-sort'
// const reactHooks = require('eslint-plugin-react-hooks')
// const reactRefresh = require('eslint-plugin-react-refresh')
// const eslintPrettier = require('eslint-plugin-prettier')
// const importSort = require('eslint-plugin-simple-import-sort')

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      prettier: eslintPrettier,
      'simple-import-sort': importSort,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': 'warn',
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
])
