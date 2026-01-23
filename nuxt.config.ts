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

  routeRules: {
    '/api/**': { 
      proxy: { 
        to: `${process.env.FRONTEND_API_URL}/**`
      } 
    },
  },

  modules: ['vuetify-nuxt-module', '@artmizu/nuxt-prometheus', '@pinia/nuxt', '@nuxt/icon'],

  icon: {
    provider: 'iconify',
    fallbackToApi: true,
    clientBundle: {
      scan: true,
      icons: [
        // Adicionar ícones comuns manualmente no bundle
        'devicon:nodejs', 'devicon:docker', 'devicon:kubernetes', 'devicon:postgresql',
        'devicon:redis', 'devicon:git', 'devicon:github', 'devicon:terraform', 
        'devicon:argocd', 'devicon:grafana', 'devicon:helm', 'devicon:linux',
        'devicon:amazonwebservices',
        'material-icon-theme:jenkins',
      ],
      sizeLimitKb: 512,
    },
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

  build: {
    transpile: ['@iconify/vue'],
  },

  vite: {
    optimizeDeps: {
      include: [
        '@iconify/vue',
        '@iconify-json/devicon',
        '@iconify-json/logos', 
        '@iconify-json/skill-icons',
        '@iconify-json/simple-icons'
      ]
    }
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
      link: [
        // Adicione esta linha para navegadores padrão
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Esta linha é para dispositivos Apple/Mobile
        { rel: 'apple-touch-icon', href: '/favicon.ico', sizes: '180x180' },
      ],
    },
  },
})
