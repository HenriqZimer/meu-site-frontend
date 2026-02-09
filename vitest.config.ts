import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: [],
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'clover'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        '.nuxt/**',
        '.output/**',
        'coverage/**',
        'dist/**',
        'test/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.cy.ts',
        '**/*.config.{js,ts,mjs}',
        '**/cypress/**',
        '**/types/**',
        'app/app.vue',
        'app/components/**/*.vue',
        'app/pages/**/*.vue',
        'app/layouts/**/*.vue',
      ],
      include: [
        'app/composables/**/*.ts',
        'app/stores/**/*.ts',
        'app/utils/**/*.ts',
        'app/constants/**/*.ts',
      ],
      all: true,
      // Thresholds ajustados para produção (realistas e alcançáveis)
      lines: 70,
      functions: 70,
      branches: 65,
      statements: 70,
      // Força falhas no CI se thresholds não forem atingidos
      thresholds: {
        autoUpdate: false,
        perFile: false,
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
      // Gera relatório limpo sem arquivos não testáveis
      clean: true,
      cleanOnRerun: true,
    },
    // Configurações adicionais para performance
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
      },
    },
    // Timeout para testes lentos
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
})
