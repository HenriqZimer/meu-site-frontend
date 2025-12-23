import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminCoursesStore } from './courses'

// Mock $fetch
const mockFetch = Object.assign(vi.fn(), {
  raw: vi.fn(),
  create: vi.fn(),
})

// Mock useRuntimeConfig
const mockUseRuntimeConfig = vi.fn(() => ({
  public: {
    apiUrl: 'http://localhost:3000/api',
  },
}))

vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)

describe('useAdminCoursesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should initialize with empty state', () => {
    const store = useAdminCoursesStore()

    expect(store.courses).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should fetch courses successfully', async () => {
    const mockCourses = [
      { _id: '1', name: 'Course 1', active: true, year: '2024' },
      { _id: '2', name: 'Course 2', active: false, year: '2023' },
    ]

    vi.mocked(mockFetch).mockResolvedValue(mockCourses)

    const store = useAdminCoursesStore()
    await store.fetchCourses()

    expect(store.courses).toEqual(mockCourses)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    vi.mocked(mockFetch).mockRejectedValue(new Error('Network error'))

    const store = useAdminCoursesStore()
    await expect(store.fetchCourses()).rejects.toThrow('Network error')

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Network error')
  })

  it('should calculate active count correctly', () => {
    const store = useAdminCoursesStore()
    store.courses = [
      { _id: '1', name: 'Course 1', active: true },
      { _id: '2', name: 'Course 2', active: false },
      { _id: '3', name: 'Course 3', active: true },
    ] as any

    expect(store.activeCount).toBe(2)
    expect(store.inactiveCount).toBe(1)
  })

  it('should calculate unique years correctly', () => {
    const store = useAdminCoursesStore()
    store.courses = [
      { _id: '1', name: 'Course 1', date: '2024-01' },
      { _id: '2', name: 'Course 2', date: '2023-01' },
      { _id: '3', name: 'Course 3', date: '2024-12' },
    ] as any

    expect(store.uniqueYears).toBe(2)
  })

  it('should create course', async () => {
    const newCourse = { name: 'New Course', active: true, year: '2024' }
    const createdCourse = { _id: '1', ...newCourse }

    vi.mocked(global.$fetch)
      .mockResolvedValueOnce(createdCourse)
      .mockResolvedValueOnce([createdCourse])

    const store = useAdminCoursesStore()
    await store.createCourse(newCourse as any)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should update course', async () => {
    const updatedCourse = { _id: '1', name: 'Updated', active: true }

    vi.mocked(global.$fetch)
      .mockResolvedValueOnce(updatedCourse)
      .mockResolvedValueOnce([updatedCourse])

    const store = useAdminCoursesStore()
    await store.updateCourse('1', updatedCourse as any)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should toggle active status', async () => {
    const course = { _id: '1', name: 'Course', active: true } as any
    const toggledCourse = { ...course, active: false }

    vi.mocked(global.$fetch)
      .mockResolvedValueOnce(toggledCourse)
      .mockResolvedValueOnce([toggledCourse])

    const store = useAdminCoursesStore()
    await store.toggleActive(course)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should delete course', async () => {
    vi.mocked(mockFetch).mockResolvedValueOnce(undefined).mockResolvedValueOnce([])

    const store = useAdminCoursesStore()
    await store.deleteCourse('1')

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should handle create error with error.data.message', async () => {
    const errorWithData = { data: { message: 'Validation error' } }
    vi.mocked(mockFetch).mockRejectedValue(errorWithData)

    const store = useAdminCoursesStore()
    await expect(store.createCourse({ name: 'Test' } as any)).rejects.toThrow('Validation error')
  })

  it('should handle create error without message', async () => {
    vi.mocked(mockFetch).mockRejectedValue({})

    const store = useAdminCoursesStore()
    await expect(store.createCourse({ name: 'Test' } as any)).rejects.toThrow('Erro ao criar curso')
  })

  it('should handle update error with error.data.message', async () => {
    const errorWithData = { data: { message: 'Not found' } }
    vi.mocked(mockFetch).mockRejectedValue(errorWithData)

    const store = useAdminCoursesStore()
    await expect(store.updateCourse('1', { name: 'Test' } as any)).rejects.toThrow('Not found')
  })

  it('should handle update error without message', async () => {
    vi.mocked(mockFetch).mockRejectedValue({})

    const store = useAdminCoursesStore()
    await expect(store.updateCourse('1', { name: 'Test' } as any)).rejects.toThrow(
      'Erro ao atualizar curso'
    )
  })

  it('should handle toggleActive error', async () => {
    const course = { _id: '1', name: 'Test', active: true } as any
    vi.mocked(mockFetch).mockRejectedValue(new Error('Toggle failed'))

    const store = useAdminCoursesStore()
    await expect(store.toggleActive(course)).rejects.toThrow('Toggle failed')
  })

  it('should handle delete error', async () => {
    vi.mocked(mockFetch).mockRejectedValue(new Error('Delete failed'))

    const store = useAdminCoursesStore()
    await expect(store.deleteCourse('1')).rejects.toThrow('Delete failed')
  })

  it('should handle create error with error.message but no error.data', async () => {
    const errorWithMessage = new Error('Direct message')
    vi.mocked(mockFetch).mockRejectedValue(errorWithMessage)

    const store = useAdminCoursesStore()
    await expect(store.createCourse({ name: 'Test' } as any)).rejects.toThrow('Direct message')
  })

  it('should handle update error with error.message but no error.data', async () => {
    const errorWithMessage = new Error('Update message')
    vi.mocked(mockFetch).mockRejectedValue(errorWithMessage)

    const store = useAdminCoursesStore()
    await expect(store.updateCourse('1', { name: 'Test' } as any)).rejects.toThrow('Update message')
  })

  it('should sort courses with undefined year values', async () => {
    const mockCourses = [
      { _id: '1', name: 'Course 1', year: undefined },
      { _id: '2', name: 'Course 2', year: 2024 },
    ]
    vi.mocked(mockFetch).mockResolvedValue(mockCourses)

    const store = useAdminCoursesStore()
    await store.fetchCourses()

    expect(store.courses).toBeDefined()
    expect(store.courses.length).toBe(2)
  })
})
