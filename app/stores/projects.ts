import { defineStore } from 'pinia'

interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  demoUrl: string
  githubUrl: string
}

interface ProjectStats {
  total: number
  byCategory: Record<string, number>
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    stats: null as ProjectStats | null,
    loading: false,
    error: null as string | null,
    lastFetch: null as number | null,
    lastStatsFetch: null as number | null,
  }),

  getters: {
    allProjects: state => state.projects,
    projectsByCategory: state => (category: string) =>
      state.projects.filter(p => p.category === category),
    projectsCount: state => state.stats?.total || state.projects.length,
    isLoaded: state => state.projects.length > 0,
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
    async fetchProjects() {
      // Evita requisições desnecessárias
      if (this.isLoaded && !this.needsRefresh) {
        // console.log('[Projects Store] Usando cache')
        return this.projects
      }

      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        const fullUrl = `${apiUrl}/projects`

        const data = await $fetch<Project[]>(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        this.projects = data
        this.lastFetch = Date.now()
        return data
      } catch (error: any) {
        const errorMsg = error?.data?.message ?? error?.message ?? 'Erro ao carregar projetos'
        this.error = errorMsg
        if (process.env.NODE_ENV !== 'test') {
          console.error('Erro ao carregar projetos:', errorMsg)
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      // Evita requisições desnecessárias
      if (this.stats && !this.statsNeedRefresh) {
        // console.log('[Projects Store] Usando cache de stats')
        return this.stats
      }

      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        const fullUrl = `${apiUrl}/projects/stats`

        const data = await $fetch<ProjectStats>(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        this.stats = data
        this.lastStatsFetch = Date.now()
        return data
      } catch (error) {
        console.error('Erro ao carregar stats de projetos:', error)
        throw error
      }
    },

    clearCache() {
      this.projects = []
      this.stats = null
      this.lastFetch = null
      this.lastStatsFetch = null
    },
  },
})
