import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Server-only modules must never be pulled into client bundles.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'razorpay',
              message: 'Import Razorpay only via @/server/billing/razorpay (server-only).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/server/billing/razorpay.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
]);
