import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const baseDirectory = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'src/assets/vendor/**',
      'caprover.tar',
    ],
  },
  ...compat.extends('./.eslintrc.json'),
];
