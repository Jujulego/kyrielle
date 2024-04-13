// @ts-check
import eslint from '@eslint/js';
import vitest from 'eslint-plugin-vitest';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  {
    ignores: ['.pnp.*', '.yarn', 'coverage', 'dist']
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
      },
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-console': ['error', {
        allow: ['warn', 'error'],
      }]
    }
  },
  {
    files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'],
    plugins: {
      vitest
    },
    settings: {
      vitest: {
        typecheck: true
      }
    },
    rules: {
      ...vitest.configs.recommended.rules,
    }
  }
);
