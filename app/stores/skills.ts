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
    lastFetch: null as number | null,
  }),

  getters: {
    allSkills: state => state.skills,
    skillsCount: state => state.skills.length,
    isLoaded: state => state.skills.length > 0,
    needsRefresh: state => {
      if (!state.lastFetch) return true
      const fiveMinutes = 5 * 60 * 1000
      return Date.now() - state.lastFetch > fiveMinutes
    },
  },

  actions: {
    async fetchSkills() {
      // Evita requisições desnecessárias
      if (this.isLoaded && !this.needsRefresh) {
        return this.skills
      }

      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        const fullUrl = `${apiUrl}/skills`

        const data = await $fetch<Technology[]>(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        this.skills = data
        this.lastFetch = Date.now()
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao carregar skills'
        if (process.env.NODE_ENV !== 'test') {
          console.error('Erro ao carregar skills:', error)
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    clearCache() {
      this.skills = []
      this.lastFetch = null
    },
  },
})
