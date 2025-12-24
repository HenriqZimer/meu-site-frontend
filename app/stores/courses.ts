import { defineStore } from 'pinia'

interface Course {
  name: string
  platform: string
  instructor?: string
  duration?: string
  image?: string
  link: string
  year?: string
}

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [] as Course[],
    loading: false,
    error: null as string | null,
    lastFetch: null as number | null,
  }),

  getters: {
    allCourses: state => state.courses,
    completedCourses: state => state.courses.filter(c => c.year !== 'Planejados'),
    plannedCourses: state => state.courses.filter(c => c.year === 'Planejados'),
    coursesByYear: state => {
      const grouped: Record<string, Course[]> = {}
      state.courses.forEach(course => {
        const year = course.year || 'Outros'
        grouped[year] ??= [];
        grouped[year].push(course)
      })

      return Object.entries(grouped)
        .map(([year, courses]) => ({ year, courses }))
        .sort((a, b) => {
          if (a.year === 'Planejados') return 1
          if (b.year === 'Planejados') return -1
          return parseInt(b.year) - parseInt(a.year)
        })
    },
    totalHours: state => {
      return state.courses
        .filter(c => c.year !== 'Planejados')
        .reduce((acc, course) => {
          const hours = parseFloat(course.duration?.replace(/[^0-9.]/g, '') || '0')
          return acc + hours
        }, 0)
    },
    coursesCount: state => state.courses.length,
    isLoaded: state => state.courses.length > 0,
    needsRefresh: state => {
      if (!state.lastFetch) return true
      const fiveMinutes = 5 * 60 * 1000
      return Date.now() - state.lastFetch > fiveMinutes
    },
  },

  actions: {
    async fetchCourses() {
      // Evita requisições desnecessárias
      if (this.isLoaded && !this.needsRefresh) {
        return this.courses
      }

      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        const fullUrl = `${apiUrl}/courses`
        // console.log('[Courses Store] Fetching from:', fullUrl)

        const data = await $fetch<Course[]>(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        // console.log('[Courses Store] Dados recebidos:', data.length, 'items')
        this.courses = data
        this.lastFetch = Date.now()
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro ao carregar cursos'
        if (process.env.NODE_ENV !== 'test') {
          console.error('Erro ao carregar cursos:', error)
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    clearCache() {
      this.courses = []
      this.lastFetch = null
    },
  },
})
