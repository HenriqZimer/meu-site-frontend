import { vi } from 'vitest'
import { ref as vueRef, computed as vueComputed } from 'vue'

// Extend global types
declare global {
   
  var ref: typeof vueRef
   
  var computed: typeof vueComputed
   
  var useRuntimeConfig: () => {
    public: {
      apiUrl: string
    }
  }
   
  var $fetch: ReturnType<typeof vi.fn>
   
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
