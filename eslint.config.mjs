import pluginJs from '@eslint/js'
import importHelpers from 'eslint-plugin-import-helpers'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    plugins: {
      'import-helpers': importHelpers,
    },
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['node_modules/**', 'build/**', 'coverage/**'],
    languageOptions: { globals: globals.browser },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      quotes: ['error', 'single'],
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            'module',
            '/^@/types/',
            '/^@/env/',
            '/^@/http/',
            '/^@/lib/',
            '/^@/repositories/',
            '/^@/shared/',
            '/^@/use-cases/',
            '/^@/utils/',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
