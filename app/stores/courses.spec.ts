import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCoursesStore } from './courses'

// Mock global $fetch
const mockFetch = vi.fn()
global.$fetch = mockFetch as any

// Mock global useRuntimeConfig
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiUrl: 'http://localhost:3001',
  },
}))

describe('useCoursesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with empty state', () => {
      const store = useCoursesStore()

      expect(store.courses).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.lastFetch).toBeNull()
    })
  })

  describe('getters', () => {
    it('allCourses should return all courses', () => {
      const store = useCoursesStore()
      const mockCourses = [
        { name: 'Course1', platform: 'Udemy', link: 'link1' },
        { name: 'Course2', platform: 'Coursera', link: 'link2' },
      ]
      store.courses = mockCourses

      expect(store.allCourses).toEqual(mockCourses)
    })

    it('completedCourses should filter out planned courses', () => {
      const store = useCoursesStore()
      store.courses = [
        { name: 'Completed', platform: 'Udemy', link: 'link', year: '2024' },
        { name: 'Planned', platform: 'Coursera', link: 'link2', year: 'Planejados' },
      ]

      expect(store.completedCourses).toHaveLength(1)
      expect(store.completedCourses[0].name).toBe('Completed')
    })

    it('plannedCourses should return only planned courses', () => {
      const store = useCoursesStore()
      store.courses = [
        { name: 'Completed', platform: 'Udemy', link: 'link', year: '2024' },
        { name: 'Planned', platform: 'Coursera', link: 'link2', year: 'Planejados' },
      ]

      expect(store.plannedCourses).toHaveLength(1)
      expect(store.plannedCourses[0].name).toBe('Planned')
    })

    it('coursesByYear should group courses by year', () => {
      const store = useCoursesStore()
      store.courses = [
        { name: 'Course1', platform: 'Udemy', link: 'link1', year: '2024' },
        { name: 'Course2', platform: 'Coursera', link: 'link2', year: '2024' },
        { name: 'Course3', platform: 'Udemy', link: 'link3', year: '2023' },
        { name: 'Planned', platform: 'Coursera', link: 'link4', year: 'Planejados' },
      ]

      const grouped = store.coursesByYear

      expect(grouped).toHaveLength(3)
      expect(grouped[0].year).toBe('2024')
      expect(grouped[0].courses).toHaveLength(2)
      expect(grouped[2].year).toBe('Planejados') // Planejados should be last
    })

    it('coursesByYear should handle courses without year', () => {
      const store = useCoursesStore()
      store.courses = [{ name: 'Course1', platform: 'Udemy', link: 'link1' }]

      const grouped = store.coursesByYear

      expect(grouped).toHaveLength(1)
      expect(grouped[0].year).toBe('Outros')
    })

    it('totalHours should calculate total duration excluding planned', () => {
      const store = useCoursesStore()
      store.courses = [
        { name: 'Course1', platform: 'Udemy', link: 'link1', duration: '10h', year: '2024' },
        { name: 'Course2', platform: 'Coursera', link: 'link2', duration: '15.5h', year: '2023' },
        { name: 'Planned', platform: 'Udemy', link: 'link3', duration: '20h', year: 'Planejados' },
      ]

      expect(store.totalHours).toBe(25.5)
    })

    it('totalHours should handle courses without duration', () => {
      const store = useCoursesStore()
      store.courses = [{ name: 'Course1', platform: 'Udemy', link: 'link1', year: '2024' }]

      expect(store.totalHours).toBe(0)
    })

    it('coursesCount should return the number of courses', () => {
      const store = useCoursesStore()

      expect(store.coursesCount).toBe(0)

      store.courses = [
        { name: 'Course1', platform: 'Udemy', link: 'link1' },
        { name: 'Course2', platform: 'Coursera', link: 'link2' },
      ]

      expect(store.coursesCount).toBe(2)
    })

    it('isLoaded should return true when courses exist', () => {
      const store = useCoursesStore()

      expect(store.isLoaded).toBe(false)

      store.courses = [{ name: 'Course1', platform: 'Udemy', link: 'link1' }]

      expect(store.isLoaded).toBe(true)
    })

    it('needsRefresh should return true when lastFetch is null', () => {
      const store = useCoursesStore()

      expect(store.needsRefresh).toBe(true)
    })

    it('needsRefresh should return false when last fetch is recent', () => {
      const store = useCoursesStore()
      store.lastFetch = Date.now()

      expect(store.needsRefresh).toBe(false)
    })
  })

  describe('actions', () => {
    describe('fetchCourses', () => {
      it('should fetch courses successfully', async () => {
        const store = useCoursesStore()
        const mockData = [
          { name: 'Vue Mastery', platform: 'Udemy', link: 'link1' },
          { name: 'React Course', platform: 'Coursera', link: 'link2' },
        ]

        mockFetch.mockResolvedValueOnce(mockData)

        await store.fetchCourses()

        expect(store.courses).toEqual(mockData)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.lastFetch).toBeDefined()
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/courses',
          expect.objectContaining({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })

      it('should skip fetch if data is already loaded and fresh', async () => {
        const store = useCoursesStore()
        store.courses = [{ name: 'Course', platform: 'Udemy', link: 'link' }]
        store.lastFetch = Date.now()

        const result = await store.fetchCourses()

        expect(mockFetch).not.toHaveBeenCalled()
        expect(result).toEqual(store.courses)
      })

      it('should fetch if data needs refresh', async () => {
        const store = useCoursesStore()
        store.courses = [{ name: 'Old', platform: 'Old', link: 'old' }]
        store.lastFetch = Date.now() - 6 * 60 * 1000

        const mockData = [{ name: 'New', platform: 'New', link: 'new' }]
        mockFetch.mockResolvedValueOnce(mockData)

        await store.fetchCourses()

        expect(mockFetch).toHaveBeenCalled()
        expect(store.courses).toEqual(mockData)
      })

      it('should handle fetch errors', async () => {
        const store = useCoursesStore()
        const errorMessage = 'Network error'

        mockFetch.mockRejectedValueOnce(new Error(errorMessage))

        await expect(store.fetchCourses()).rejects.toThrow(errorMessage)

        expect(store.error).toBe(errorMessage)
        expect(store.loading).toBe(false)
      })

      it('should handle non-Error exceptions', async () => {
        const store = useCoursesStore()

        mockFetch.mockRejectedValueOnce('String error')

        await expect(store.fetchCourses()).rejects.toBe('String error')

        expect(store.error).toBe('Erro ao carregar cursos')
        expect(store.loading).toBe(false)
      })

      it('should handle error with data.message', async () => {
        const store = useCoursesStore()
        const errorWithData = {
          data: { message: 'API error message' },
          message: 'Generic error',
        }

        mockFetch.mockRejectedValueOnce(errorWithData)

        await expect(store.fetchCourses()).rejects.toEqual(errorWithData)

        // Since it's not an Error instance, uses fallback
        expect(store.error).toBe('Erro ao carregar cursos')
        expect(store.loading).toBe(false)
      })

      it('should handle error with only message property', async () => {
        const store = useCoursesStore()
        const errorWithMessage = { message: 'Error message only' }

        mockFetch.mockRejectedValueOnce(errorWithMessage)

        await expect(store.fetchCourses()).rejects.toEqual(errorWithMessage)

        // Since it's not an Error instance, uses fallback
        expect(store.error).toBe('Erro ao carregar cursos')
        expect(store.loading).toBe(false)
      })
    })

    describe('clearCache', () => {
      it('should clear all cached data', () => {
        const store = useCoursesStore()
        store.courses = [{ name: 'Course', platform: 'Udemy', link: 'link' }]
        store.lastFetch = Date.now()

        store.clearCache()

        expect(store.courses).toEqual([])
        expect(store.lastFetch).toBeNull()
      })
    })
  })
})
