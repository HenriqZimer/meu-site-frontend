export default defineNuxtConfig({
  compatibilityDate: '2025-10-16',
  srcDir: 'app/',
  devServer: {
    host: 'localhost',
    port: 3000,
  },

  devtools: {
    enabled: true,
    timeline: { enabled: true },
  },

  runtimeConfig: {
    public: {
      apiUrl: '/api',
      siteName: 'Henrique Zimermann',
      siteUrl: 'https://henriqzimer.com.br',
    },
  },

  modules: ['vuetify-nuxt-module', '@artmizu/nuxt-prometheus', '@pinia/nuxt', '@nuxt/icon'],

  icon: {
    serverBundle: 'remote',
  },

  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: {
            dark: true,
            colors: {
              primary: '#3b82f6',
              secondary: '#64748b',
              accent: '#06b6d4',
              error: '#ef4444',
              warning: '#f59e0b',
              info: '#3b82f6',
              success: '#10b981',
              background: '#0f172a',
              surface: '#1e293b',
              'surface-bright': '#334155',
              'surface-light': '#475569',
              'surface-variant': '#334155',
              'on-surface-variant': '#cbd5e1',
            },
          },
        },
      },
    },
  },

  css: [
    '~/assets/css/design-tokens.css',
    '~/assets/css/critical.css',
    '~/assets/css/animations.css',
    '~/assets/css/sections.css',
    '~/assets/css/components.css',
    '~/assets/css/vuetify.css',
    '~/assets/css/global.css',
  ],

  components: {
    global: true,
    dirs: ['~/components', '~/components/base', '~/components/admin/base'],
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: false,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#3b82f6' },
      ],
      link: [{ rel: 'apple-touch-icon', href: '/favicon.ico', sizes: '180x180' }],
    },
  },
})
