
import js from '@eslint/js';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off', // Disable 'no-explicit-any' rule
      // Add custom rules here
    },
    env: {
      node: true,
    },
  },
];
