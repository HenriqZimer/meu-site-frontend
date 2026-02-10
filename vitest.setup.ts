import { vi } from 'vitest'
import { ref as vueRef, computed as vueComputed } from 'vue'

// Extend global types
declare global {
  // eslint-disable-next-line no-var
  var ref: typeof vueRef
  // eslint-disable-next-line no-var
  var computed: typeof vueComputed
  // eslint-disable-next-line no-var
  var useRuntimeConfig: () => {
    public: {
      apiUrl: string
    }
  }
  // eslint-disable-next-line no-var
  var $fetch: ReturnType<typeof vi.fn>
  // eslint-disable-next-line no-var
  var useAdminApi: typeof import('./app/composables/useAdminApi').useAdminApi
}

// Mock Vue composables globally
global.ref = vueRef
global.computed = vueComputed

// Mock Nuxt composables
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiUrl: 'http://localhost:3000/api',
  },
}))

// Mock $fetch globally - this will be overridden by individual tests
global.$fetch = vi.fn()

// Import and expose useAdminApi globally
// This allows the composable to be auto-imported like in Nuxt
const { useAdminApi: adminApiComposable } = await import('./app/composables/useAdminApi')
global.useAdminApi = adminApiComposable

export {}
