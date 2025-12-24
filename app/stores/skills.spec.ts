import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSkillsStore } from './skills'

// Mock global $fetch
const mockFetch = vi.fn()
global.$fetch = mockFetch as any

// Mock global useRuntimeConfig
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiUrl: 'http://localhost:3001',
  },
}))

describe('useSkillsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with empty state', () => {
      const store = useSkillsStore()

      expect(store.skills).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.lastFetch).toBeNull()
    })
  })

  describe('getters', () => {
    it('allSkills should return all skills', () => {
      const store = useSkillsStore()
      const mockSkills = [
        {
          name: 'TypeScript',
          category: 'Languages',
          icon: 'typescript',
          color: '#3178C6',
          bgColor: '#3178C610',
        },
        {
          name: 'Vue.js',
          category: 'Frameworks',
          icon: 'vue',
          color: '#42B883',
          bgColor: '#42B88310',
        },
      ]
      store.skills = mockSkills

      expect(store.allSkills).toEqual(mockSkills)
    })

    it('skillsCount should return the number of skills', () => {
      const store = useSkillsStore()

      expect(store.skillsCount).toBe(0)

      store.skills = [
        { name: 'TypeScript', category: 'Languages', icon: 'typescript', color: '#3178C6' },
        { name: 'Vue.js', category: 'Frameworks', icon: 'vue', color: '#42B883' },
      ]

      expect(store.skillsCount).toBe(2)
    })

    it('isLoaded should return true when skills exist', () => {
      const store = useSkillsStore()

      expect(store.isLoaded).toBe(false)

      store.skills = [
        { name: 'TypeScript', category: 'Languages', icon: 'typescript', color: '#3178C6' },
      ]

      expect(store.isLoaded).toBe(true)
    })

    it('needsRefresh should return true when lastFetch is null', () => {
      const store = useSkillsStore()

      expect(store.needsRefresh).toBe(true)
    })

    it('needsRefresh should return false when last fetch is recent', () => {
      const store = useSkillsStore()
      store.lastFetch = Date.now()

      expect(store.needsRefresh).toBe(false)
    })

    it('needsRefresh should return true when last fetch is older than 5 minutes', () => {
      const store = useSkillsStore()
      store.lastFetch = Date.now() - 6 * 60 * 1000 // 6 minutes ago

      expect(store.needsRefresh).toBe(true)
    })
  })

  describe('actions', () => {
    describe('fetchSkills', () => {
      it('should fetch skills successfully', async () => {
        const store = useSkillsStore()
        const mockData = [
          { name: 'TypeScript', category: 'Languages', icon: 'typescript', color: '#3178C6' },
          { name: 'Vue.js', category: 'Frameworks', icon: 'vue', color: '#42B883' },
        ]

        mockFetch.mockResolvedValueOnce(mockData)

        await store.fetchSkills()

        expect(store.skills).toEqual(mockData)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.lastFetch).toBeDefined()
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/skills',
          expect.objectContaining({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })

      it('should set loading state correctly', async () => {
        const store = useSkillsStore()
        const mockData = [
          { name: 'TypeScript', category: 'Languages', icon: 'typescript', color: '#3178C6' },
        ]

        mockFetch.mockImplementation(() => {
          expect(store.loading).toBe(true)
          return Promise.resolve(mockData)
        })

        await store.fetchSkills()

        expect(store.loading).toBe(false)
      })

      it('should skip fetch if data is already loaded and fresh', async () => {
        const store = useSkillsStore()
        store.skills = [
          { name: 'TypeScript', category: 'Languages', icon: 'typescript', color: '#3178C6' },
        ]
        store.lastFetch = Date.now()

        const result = await store.fetchSkills()

        expect(mockFetch).not.toHaveBeenCalled()
        expect(result).toEqual(store.skills)
      })

      it('should fetch if data needs refresh', async () => {
        const store = useSkillsStore()
        store.skills = [{ name: 'Old Skill', category: 'Languages', icon: 'old', color: '#000' }]
        store.lastFetch = Date.now() - 6 * 60 * 1000 // 6 minutes ago

        const mockData = [{ name: 'New Skill', category: 'Languages', icon: 'new', color: '#FFF' }]
        mockFetch.mockResolvedValueOnce(mockData)

        await store.fetchSkills()

        expect(mockFetch).toHaveBeenCalled()
        expect(store.skills).toEqual(mockData)
      })

      it('should handle fetch errors', async () => {
        const store = useSkillsStore()
        const errorMessage = 'Network error'

        mockFetch.mockRejectedValueOnce(new Error(errorMessage))

        await expect(store.fetchSkills()).rejects.toThrow(errorMessage)

        expect(store.error).toBe(errorMessage)
        expect(store.loading).toBe(false)
      })

      it('should handle non-Error exceptions', async () => {
        const store = useSkillsStore()

        mockFetch.mockRejectedValueOnce('String error')

        await expect(store.fetchSkills()).rejects.toBe('String error')

        expect(store.error).toBe('Erro ao carregar skills')
        expect(store.loading).toBe(false)
      })

      it('should handle error with message property', async () => {
        const store = useSkillsStore()
        const errorWithMessage = { message: 'Error message only' }

        mockFetch.mockRejectedValueOnce(errorWithMessage)

        await expect(store.fetchSkills()).rejects.toEqual(errorWithMessage)

        // Since it's not an Error instance, uses fallback
        expect(store.error).toBe('Erro ao carregar skills')
        expect(store.loading).toBe(false)
      })
    })

    describe('clearCache', () => {
      it('should clear all cached data', () => {
        const store = useSkillsStore()
        store.skills = [
          { name: 'TypeScript', category: 'Languages', icon: 'typescript', color: '#3178C6' },
        ]
        store.lastFetch = Date.now()

        store.clearCache()

        expect(store.skills).toEqual([])
        expect(store.lastFetch).toBeNull()
      })
    })
  })
})
