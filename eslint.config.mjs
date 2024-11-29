import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import importHelpers from 'eslint-plugin-import-helpers'

export default [
  {
    plugins: {
      'import-helpers': importHelpers,
    },
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['node_modules/**', 'build/**', 'coverage/**'],
    languageOptions: { globals: globals.browser },
    rules: {
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
