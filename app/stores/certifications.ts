import { defineStore } from 'pinia'

interface Certification {
  name: string
  issuer: string
  image: string
  link: string
  date?: string
  skills?: number
}

interface CertificationStats {
  total: number
  byIssuer: Record<string, number>
}

export const useCertificationsStore = defineStore('certifications', {
  state: () => ({
    certifications: [] as Certification[],
    stats: null as CertificationStats | null,
    loading: false,
    error: null as string | null,
    lastFetch: null as number | null,
    lastStatsFetch: null as number | null,
  }),

  getters: {
    allCertifications: state => {
      // Ordena as certificações pela data mais recente primeiro
      return [...state.certifications].sort((a, b) => {
        if (!a.date || !b.date) return 0
        return b.date.localeCompare(a.date)
      })
    },
    certificationsCount: state => state.stats?.total || state.certifications.length,
    isLoaded: state => state.certifications.length > 0,
    needsRefresh: state => {
      if (!state.lastFetch) return true
      const fiveMinutes = 5 * 60 * 1000
      return Date.now() - state.lastFetch > fiveMinutes
    },
    statsNeedRefresh: state => {
      if (!state.lastStatsFetch) return true
      const fiveMinutes = 5 * 60 * 1000
      return Date.now() - state.lastStatsFetch > fiveMinutes
    },
  },

  actions: {
    async fetchCertifications() {
      // Evita requisições desnecessárias
      if (this.isLoaded && !this.needsRefresh) {
        return this.certifications
      }

      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        const fullUrl = `${apiUrl}/certifications`
        console.log('[Certifications Store] Fetching from:', fullUrl)

        const data = await $fetch<Certification[]>(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        console.log('[Certifications Store] Dados recebidos:', data.length, 'items')
        this.certifications = data
        this.lastFetch = Date.now()
        return data
      } catch (error: any) {
        const errorMsg = error?.data?.message || error?.message || 'Erro ao carregar certificações'
        this.error = errorMsg
        console.error('[Certifications Store] Erro ao carregar certificações:', {
          error,
          message: errorMsg,
          status: error?.status,
          statusText: error?.statusText,
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      // Evita requisições desnecessárias
      if (this.stats && !this.statsNeedRefresh) {
        return this.stats
      }

      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        const fullUrl = `${apiUrl}/certifications/stats`

        const data = await $fetch<CertificationStats>(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        this.stats = data
        this.lastStatsFetch = Date.now()
        return data
      } catch (error) {
        console.error('Erro ao carregar stats de certificações:', error)
        throw error
      }
    },

    clearCache() {
      this.certifications = []
      this.stats = null
      this.lastFetch = null
      this.lastStatsFetch = null
    },
  },
})
