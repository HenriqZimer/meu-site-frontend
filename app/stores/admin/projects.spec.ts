import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminProjectsStore } from './projects'

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

describe('useAdminProjectsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should initialize with empty state', () => {
    const store = useAdminProjectsStore()

    expect(store.projects).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should fetch projects successfully', async () => {
    const mockProjects = [
      { _id: '1', name: 'Project 1', active: true, order: 1, category: 'web' },
      { _id: '2', name: 'Project 2', active: false, order: 2, category: 'mobile' },
    ]

    vi.mocked(mockFetch).mockResolvedValue(mockProjects)

    const store = useAdminProjectsStore()
    await store.fetchProjects()

    expect(store.projects).toEqual(mockProjects)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    vi.mocked(mockFetch).mockRejectedValue(new Error('Network error'))

    const store = useAdminProjectsStore()
    await expect(store.fetchProjects()).rejects.toThrow('Network error')

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Network error')
  })

  it('should calculate active count correctly', () => {
    const store = useAdminProjectsStore()
    store.projects = [
      { _id: '1', name: 'Project 1', active: true },
      { _id: '2', name: 'Project 2', active: false },
      { _id: '3', name: 'Project 3', active: true },
    ] as any

    expect(store.activeCount).toBe(2)
    expect(store.inactiveCount).toBe(1)
  })

  it('should calculate categories count correctly', () => {
    const store = useAdminProjectsStore()
    store.projects = [
      { _id: '1', name: 'Project 1', category: 'web' },
      { _id: '2', name: 'Project 2', category: 'mobile' },
      { _id: '3', name: 'Project 3', category: 'web' },
    ] as any

    expect(store.categoriesCount).toBe(2)
  })

  it('should create project', async () => {
    const newProject = { name: 'New Project', active: true, order: 1 }
    const createdProject = { _id: '1', ...newProject }

    vi.mocked(global.$fetch)
      .mockResolvedValueOnce(createdProject)
      .mockResolvedValueOnce([createdProject])

    const store = useAdminProjectsStore()
    await store.createProject(newProject as any)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should update project', async () => {
    const updatedProject = { _id: '1', name: 'Updated', active: true }

    vi.mocked(global.$fetch)
      .mockResolvedValueOnce(updatedProject)
      .mockResolvedValueOnce([updatedProject])

    const store = useAdminProjectsStore()
    await store.updateProject('1', updatedProject as any)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should toggle active status', async () => {
    const project = { _id: '1', name: 'Project', active: true } as any
    const toggledProject = { ...project, active: false }

    vi.mocked(global.$fetch)
      .mockResolvedValueOnce(toggledProject)
      .mockResolvedValueOnce([toggledProject])

    const store = useAdminProjectsStore()
    await store.toggleActive(project)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should delete project', async () => {
    vi.mocked(mockFetch).mockResolvedValueOnce(undefined).mockResolvedValueOnce([])

    const store = useAdminProjectsStore()
    await store.deleteProject('1')

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should handle create error with error.data.message', async () => {
    const errorWithData = { data: { message: 'Validation error' } }
    vi.mocked(mockFetch).mockRejectedValue(errorWithData)

    const store = useAdminProjectsStore()
    await expect(store.createProject({ name: 'Test' } as any)).rejects.toThrow('Validation error')
  })

  it('should handle create error without message', async () => {
    vi.mocked(mockFetch).mockRejectedValue({})

    const store = useAdminProjectsStore()
    await expect(store.createProject({ name: 'Test' } as any)).rejects.toThrow(
      'Erro ao criar projeto'
    )
  })

  it('should handle update error with error.data.message', async () => {
    const errorWithData = { data: { message: 'Not found' } }
    vi.mocked(mockFetch).mockRejectedValue(errorWithData)

    const store = useAdminProjectsStore()
    await expect(store.updateProject('1', { name: 'Test' } as any)).rejects.toThrow('Not found')
  })

  it('should handle update error without message', async () => {
    vi.mocked(mockFetch).mockRejectedValue({})

    const store = useAdminProjectsStore()
    await expect(store.updateProject('1', { name: 'Test' } as any)).rejects.toThrow(
      'Erro ao atualizar projeto'
    )
  })

  it('should handle toggleActive error', async () => {
    const project = { _id: '1', name: 'Test', active: true } as any
    vi.mocked(mockFetch).mockRejectedValue(new Error('Toggle failed'))

    const store = useAdminProjectsStore()
    await expect(store.toggleActive(project)).rejects.toThrow('Toggle failed')
  })

  it('should handle delete error', async () => {
    vi.mocked(mockFetch).mockRejectedValue(new Error('Delete failed'))

    const store = useAdminProjectsStore()
    await expect(store.deleteProject('1')).rejects.toThrow('Delete failed')
  })

  it('should handle create error with error.message but no error.data', async () => {
    const errorWithMessage = new Error('Direct message')
    vi.mocked(mockFetch).mockRejectedValue(errorWithMessage)

    const store = useAdminProjectsStore()
    await expect(store.createProject({ title: 'Test' } as any)).rejects.toThrow('Direct message')
  })

  it('should handle update error with error.message but no error.data', async () => {
    const errorWithMessage = new Error('Update message')
    vi.mocked(mockFetch).mockRejectedValue(errorWithMessage)

    const store = useAdminProjectsStore()
    await expect(store.updateProject('1', { title: 'Test' } as any)).rejects.toThrow('Update message')
  })

  it('should sort projects with undefined order values', async () => {
    const mockProjects = [
      { _id: '1', title: 'Project 1', order: undefined },
      { _id: '2', title: 'Project 2', order: 5 },
    ]
    vi.mocked(mockFetch).mockResolvedValue(mockProjects)

    const store = useAdminProjectsStore()
    await store.fetchProjects()

    expect(store.projects).toBeDefined()
    expect(store.projects.length).toBe(2)
  })
})
