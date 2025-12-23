import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectsStore } from './projects'

// Mock global $fetch
const mockFetch = vi.fn()
global.$fetch = mockFetch as any

// Mock global useRuntimeConfig
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiUrl: 'http://localhost:3001',
  },
}))

describe('useProjectsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with empty state', () => {
      const store = useProjectsStore()

      expect(store.projects).toEqual([])
      expect(store.stats).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.lastFetch).toBeNull()
      expect(store.lastStatsFetch).toBeNull()
    })
  })

  describe('getters', () => {
    it('allProjects should return all projects', () => {
      const store = useProjectsStore()
      const mockProjects = [
        { id: 1, title: 'Project1', description: 'Desc1', image: 'img1', category: 'Web', technologies: ['Vue'], demoUrl: 'demo1', githubUrl: 'github1' },
        { id: 2, title: 'Project2', description: 'Desc2', image: 'img2', category: 'Mobile', technologies: ['React'], demoUrl: 'demo2', githubUrl: 'github2' },
      ]
      store.projects = mockProjects

      expect(store.allProjects).toEqual(mockProjects)
    })

    it('projectsByCategory should filter projects by category', () => {
      const store = useProjectsStore()
      store.projects = [
        { id: 1, title: 'Web Project', description: 'Desc', image: 'img', category: 'Web', technologies: [], demoUrl: '', githubUrl: '' },
        { id: 2, title: 'Mobile Project', description: 'Desc', image: 'img', category: 'Mobile', technologies: [], demoUrl: '', githubUrl: '' },
        { id: 3, title: 'Another Web', description: 'Desc', image: 'img', category: 'Web', technologies: [], demoUrl: '', githubUrl: '' },
      ]

      const webProjects = store.projectsByCategory('Web')
      expect(webProjects).toHaveLength(2)
      expect(webProjects.every(p => p.category === 'Web')).toBe(true)
    })

    it('projectsCount should return stats total when available', () => {
      const store = useProjectsStore()
      store.stats = { total: 15, byCategory: {} }

      expect(store.projectsCount).toBe(15)
    })

    it('projectsCount should return projects length when stats not available', () => {
      const store = useProjectsStore()
      store.projects = [
        { id: 1, title: 'Project', description: 'Desc', image: 'img', category: 'Web', technologies: [], demoUrl: '', githubUrl: '' },
        { id: 2, title: 'Project2', description: 'Desc', image: 'img', category: 'Web', technologies: [], demoUrl: '', githubUrl: '' },
      ]

      expect(store.projectsCount).toBe(2)
    })

    it('isLoaded should return true when projects exist', () => {
      const store = useProjectsStore()
      
      expect(store.isLoaded).toBe(false)

      store.projects = [
        { id: 1, title: 'Project', description: 'Desc', image: 'img', category: 'Web', technologies: [], demoUrl: '', githubUrl: '' },
      ]

      expect(store.isLoaded).toBe(true)
    })

    it('needsRefresh should return true when lastFetch is null', () => {
      const store = useProjectsStore()
      
      expect(store.needsRefresh).toBe(true)
    })

    it('needsRefresh should return false when last fetch is recent', () => {
      const store = useProjectsStore()
      store.lastFetch = Date.now()
      
      expect(store.needsRefresh).toBe(false)
    })

    it('statsNeedRefresh should return true when lastStatsFetch is null', () => {
      const store = useProjectsStore()
      
      expect(store.statsNeedRefresh).toBe(true)
    })

    it('statsNeedRefresh should return false when last stats fetch is recent', () => {
      const store = useProjectsStore()
      store.lastStatsFetch = Date.now()
      
      expect(store.statsNeedRefresh).toBe(false)
    })
  })

  describe('actions', () => {
    describe('fetchProjects', () => {
      it('should fetch projects successfully', async () => {
        const store = useProjectsStore()
        const mockData = [
          { id: 1, title: 'Portfolio', description: 'My portfolio', image: 'img', category: 'Web', technologies: ['Vue', 'Nuxt'], demoUrl: 'demo', githubUrl: 'github' },
          { id: 2, title: 'App', description: 'Mobile app', image: 'img2', category: 'Mobile', technologies: ['React Native'], demoUrl: 'demo2', githubUrl: 'github2' },
        ]

        mockFetch.mockResolvedValueOnce(mockData)

        await store.fetchProjects()

        expect(store.projects).toEqual(mockData)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.lastFetch).toBeDefined()
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/projects',
          expect.objectContaining({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })

      it('should skip fetch if data is already loaded and fresh', async () => {
        const store = useProjectsStore()
        store.projects = [
          { id: 1, title: 'Project', description: 'Desc', image: 'img', category: 'Web', technologies: [], demoUrl: '', githubUrl: '' },
        ]
        store.lastFetch = Date.now()

        const result = await store.fetchProjects()

        expect(mockFetch).not.toHaveBeenCalled()
        expect(result).toEqual(store.projects)
      })

      it('should fetch if data needs refresh', async () => {
        const store = useProjectsStore()
        store.projects = [{ id: 1, title: 'Old', description: '', image: '', category: '', technologies: [], demoUrl: '', githubUrl: '' }]
        store.lastFetch = Date.now() - (6 * 60 * 1000)

        const mockData = [{ id: 2, title: 'New', description: '', image: '', category: '', technologies: [], demoUrl: '', githubUrl: '' }]
        mockFetch.mockResolvedValueOnce(mockData)

        await store.fetchProjects()

        expect(mockFetch).toHaveBeenCalled()
        expect(store.projects).toEqual(mockData)
      })

      it('should handle fetch errors', async () => {
        const store = useProjectsStore()
        const errorMessage = 'Network error'

        mockFetch.mockRejectedValueOnce(new Error(errorMessage))

        await expect(store.fetchProjects()).rejects.toThrow(errorMessage)

        expect(store.error).toBe(errorMessage)
        expect(store.loading).toBe(false)
      })

      it('should handle non-Error exceptions', async () => {
        const store = useProjectsStore()

        mockFetch.mockRejectedValueOnce('String error')

        await expect(store.fetchProjects()).rejects.toBe('String error')

        expect(store.error).toBe('Erro ao carregar projetos')
        expect(store.loading).toBe(false)
      })
    })

    describe('fetchStats', () => {
      it('should fetch stats successfully', async () => {
        const store = useProjectsStore()
        const mockStats = { total: 10, byCategory: { Web: 5, Mobile: 3, Desktop: 2 } }

        mockFetch.mockResolvedValueOnce(mockStats)

        await store.fetchStats()

        expect(store.stats).toEqual(mockStats)
        expect(store.lastStatsFetch).toBeDefined()
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/projects/stats',
          expect.objectContaining({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })

      it('should skip fetch if stats are fresh', async () => {
        const store = useProjectsStore()
        store.stats = { total: 10, byCategory: {} }
        store.lastStatsFetch = Date.now()

        const result = await store.fetchStats()

        expect(mockFetch).not.toHaveBeenCalled()
        expect(result).toEqual(store.stats)
      })

      it('should handle stats fetch errors', async () => {
        const store = useProjectsStore()

        mockFetch.mockRejectedValueOnce(new Error('Stats error'))

        await expect(store.fetchStats()).rejects.toThrow('Stats error')
      })
    })

    describe('clearCache', () => {
      it('should clear all cached data', () => {
        const store = useProjectsStore()
        store.projects = [{ id: 1, title: 'Project', description: 'Desc', image: 'img', category: 'Web', technologies: [], demoUrl: '', githubUrl: '' }]
        store.stats = { total: 10, byCategory: {} }
        store.lastFetch = Date.now()
        store.lastStatsFetch = Date.now()

        store.clearCache()

        expect(store.projects).toEqual([])
        expect(store.stats).toBeNull()
        expect(store.lastFetch).toBeNull()
        expect(store.lastStatsFetch).toBeNull()
      })
    })
  })
})
