// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt()
  .append({
    rules: {
      // ===== Vue Specific Rules =====
      // Permite nomes simples para componentes em projetos de portfolio
      'vue/multi-word-component-names': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-self-closing': 'off',

      // Enforce consistent attribute ordering
      'vue/attributes-order': [
        'warn',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        },
      ],

      // ===== TypeScript Rules =====
      '@typescript-eslint/no-explicit-any': 'off', // Desabilitado - frameworks dinâmicos requerem any em alguns casos
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Proíbe uso de console.log em produção (use logger adequado)
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Enforça uso de const quando variável não é reatribuída
      'prefer-const': 'error',

      // Proíbe var (use let/const)
      'no-var': 'error',

      // Exige === em vez de ==
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // Evita código morto
      'no-unreachable': 'error',
      'no-unused-expressions': 'warn',
    },
  })
  .append({
    // Ignora arquivos específicos
    ignores: [
      'dist/**',
      '.output/**',
      '.nuxt/**',
      'node_modules/**',
      '.cypress-cache/**',
      '**/cypress-cache/**',
      '**/*.spec.ts',
      '**/*.test.ts',
      'coverage/**',
    ],
  })
