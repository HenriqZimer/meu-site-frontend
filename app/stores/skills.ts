import { defineStore } from 'pinia'

interface Technology {
  name: string
  category: string
  icon: string
  color: string
  bgColor?: string
}

export const useSkillsStore = defineStore('skills', {
  state: () => ({
    skills: [] as Technology[],
    loading: false,
    error: null as string | null,
    lastFetch: null as number | null
  }),

  getters: {
    allSkills: (state) => state.skills,
    skillsCount: (state) => state.skills.length,
    isLoaded: (state) => state.skills.length > 0,
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const fiveMinutes = 5 * 60 * 1000
      return Date.now() - state.lastFetch > fiveMinutes
    }
  },

  actions: {
    async fetchSkills() {
      // Evita requisições desnecessárias
      if (this.isLoaded && !this.needsRefresh) {
        console.log('[Skills Store] Usando cache')
        return this.skills
      }

      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        const fullUrl = `${apiUrl}/skills`
        // console.log('[Skills Store] Fetching from:', fullUrl)
        
        const data = await $fetch<Technology[]>(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        // console.log('[Skills Store] Dados recebidos:', data.length, 'items')
        this.skills = data
        this.lastFetch = Date.now()
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao carregar skills'
        console.error('Erro ao carregar skills:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearCache() {
      this.skills = []
      this.lastFetch = null
    }
  }
})
