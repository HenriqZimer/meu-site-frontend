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
      apiUrl: process.env.NODE_ENV === 'production' ? 'https://api.henriqzimer.com.br/api' : '/api',
      siteName: 'Henrique Zimermann',
      siteUrl: 'https://henriqzimer.com.br',
      siteFirstName: 'Henrique',
      email: 'contato@henriqzimer.com.br',
      githubUrl: 'https://github.com/henriqzimer',
      linkedinUrl: 'https://linkedin.com/in/henriqzimer',
    },
    frontendApiUrl: process.env.FRONTEND_API_URL || 'http://localhost:5000/api',
  },

  routeRules: {
    '/api/**': {
      proxy: {
        to: `${process.env.FRONTEND_API_URL}/**`,
      },
    },
    // Cache estático para páginas públicas
    '/': { prerender: true },
    // CSR para área admin
    '/admin/**': { ssr: false },
  },

  modules: [
    'vuetify-nuxt-module',
    '@artmizu/nuxt-prometheus',
    '@pinia/nuxt',
    '@nuxt/icon',
    'nuxt-security',
  ],

  security: {
    headers: {
      // Content Security Policy - Mais restritivo em produção
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' && process.env.DEPLOY_ENV === 'production'
          ? {
              'default-src': ["'self'"],
              'script-src': ["'self'", "'wasm-unsafe-eval'"],
              'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
              'img-src': ["'self'", 'data:', 'https:', 'https://imagens.henriqzimer.com.br'],
              'font-src': ["'self'", 'https://cdn.jsdelivr.net'],
              'connect-src': [
                "'self'",
                'https://api.henriqzimer.com.br',
                'https://henriqzimer.com.br',
              ],
              'frame-ancestors': ["'none'"],
              'base-uri': ["'self'"],
              'form-action': ["'self'"],
              'upgrade-insecure-requests': true,  // Apenas em produção real
            }
          : {
              'default-src': ["'self'"],
              'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'wasm-unsafe-eval'"],
              'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
              'img-src': ["'self'", 'data:', 'https:', 'http:', 'https://imagens.henriqzimer.com.br'],
              'font-src': ["'self'", 'https://cdn.jsdelivr.net'],
              'connect-src': ["'self'", 'http:', 'https:', 'ws:', 'wss:'],
              'frame-ancestors': ["'none'"],
              'base-uri': ["'self'"],
              'form-action': ["'self'"],
              // NÃO force HTTPS em desenvolvimento/Docker local
            },

      // Strict Transport Security - APENAS em produção real
      strictTransportSecurity:
        process.env.DEPLOY_ENV === 'production'
          ? {
              maxAge: 31536000, // 1 ano
              includeSubdomains: true,
              preload: true,
            }
          : false,

      // X-Frame-Options
      xFrameOptions: 'DENY',

      // X-Content-Type-Options
      xContentTypeOptions: 'nosniff',

      // Referrer Policy
      referrerPolicy: 'strict-origin-when-cross-origin',

      // Permissions Policy
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: [],
        usb: [],
      },

      // Cross-Origin-Embedder-Policy - APENAS em produção real
      crossOriginEmbedderPolicy: process.env.DEPLOY_ENV === 'production' ? 'require-corp' : false,

      // Cross-Origin-Opener-Policy - APENAS em produção real
      crossOriginOpenerPolicy: process.env.DEPLOY_ENV === 'production' ? 'same-origin' : false,

      // Cross-Origin-Resource-Policy
      crossOriginResourcePolicy: process.env.DEPLOY_ENV === 'production' ? 'same-origin' : false,
    },

    // Rate Limiting
    rateLimiter: {
      tokensPerInterval: 150, // Aumentado um pouco para melhor UX
      interval: 60000, // 1 minuto
      headers: true,
      driver: {
        name: 'lruCache', // Mais performático para aplicações pequenas
      },
    },

    // CORS - Apenas em produção com domínios específicos
    corsHandler:
      process.env.NODE_ENV === 'production'
        ? {
            origin: ['https://henriqzimer.com.br', 'https://www.henriqzimer.com.br'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
          }
        : false, // Desabilitado em dev para evitar conflitos com proxy
  },

  icon: {
    provider: 'iconify',
    serverBundle: 'local',
    fallbackToApi: true,
    clientBundle: {
      scan: true,
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
    '~/assets/css/admin-components.css',
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
        '@iconify-json/simple-icons',
        '@iconify-json/mdi',
      ],
    },
    build: {
      // Minificação agressiva em produção
      minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
      // Sourcemaps apenas em dev
      sourcemap: process.env.NODE_ENV !== 'production',
      // Chunking inteligente para melhor cache
      rollupOptions: {
        output: {
          manualChunks: {
            vuetify: ['vuetify'],
            icons: ['@iconify/vue'],
          },
        },
      },
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: false,
    },
    // Compressão em produção
    compressPublicAssets: true,
    minify: process.env.NODE_ENV === 'production',
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
