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
      ],
      include: ['app/**/*.{ts,vue}'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
})
