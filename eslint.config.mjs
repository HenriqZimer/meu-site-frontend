// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt()
  .append({
    rules: {
      // Permite nomes simples para componentes em projetos de portfolio
      'vue/multi-word-component-names': 'off',
      
      // Permite variáveis não utilizadas que começam com underscore
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      
      // Permite uso controlado de any em casos específicos
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  })
  .append({
    // Ignora arquivos específicos
    ignores: [
      'dist/**',
      '.output/**',
      '.nuxt/**',
      'node_modules/**'
    ]
  })
