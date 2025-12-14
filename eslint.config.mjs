// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt()
  .append({
    rules: {
      // Permite nomes simples para componentes em projetos de portfolio
      'vue/multi-word-component-names': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-self-closing': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Permite variáveis não utilizadas que começam com underscore
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  })
  .append({
    // Ignora arquivos específicos
    ignores: ['dist/**', '.output/**', '.nuxt/**', 'node_modules/**'],
  })
