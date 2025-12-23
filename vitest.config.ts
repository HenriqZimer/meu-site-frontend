import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
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
        'app/components/**/*.vue', // Components Vue não são bem contados pelo v8
        'app/pages/**/*.vue', // Pages Vue não são bem contados pelo v8
      ],
      include: [
        'app/composables/**/*.ts',
        'app/stores/**/*.ts',
        'app/utils/**/*.ts',
        'app/constants/**/*.ts',
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
})
