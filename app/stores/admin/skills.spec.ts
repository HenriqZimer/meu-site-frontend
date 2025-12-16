import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminSkillsStore } from './skills'

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

describe('useAdminSkillsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should initialize with empty state', () => {
    const store = useAdminSkillsStore()

    expect(store.skills).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should fetch skills successfully', async () => {
    const mockSkills = [
      { _id: '1', name: 'JavaScript', active: true, order: 1, category: 'frontend' },
      { _id: '2', name: 'Python', active: false, order: 2, category: 'backend' },
    ]

    vi.mocked(mockFetch).mockResolvedValue(mockSkills)

    const store = useAdminSkillsStore()
    await store.fetchSkills()

    expect(store.skills).toEqual(mockSkills)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    vi.mocked(mockFetch).mockRejectedValue(new Error('Network error'))

    const store = useAdminSkillsStore()
    await expect(store.fetchSkills()).rejects.toThrow('Network error')

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Network error')
  })

  it('should calculate active count correctly', () => {
    const store = useAdminSkillsStore()
    store.skills = [
      { _id: '1', name: 'Skill 1', active: true },
      { _id: '2', name: 'Skill 2', active: false },
      { _id: '3', name: 'Skill 3', active: true },
    ] as any

    expect(store.activeCount).toBe(2)
    expect(store.inactiveCount).toBe(1)
  })

  it('should calculate categories count correctly', () => {
    const store = useAdminSkillsStore()
    store.skills = [
      { _id: '1', name: 'Skill 1', category: 'frontend' },
      { _id: '2', name: 'Skill 2', category: 'backend' },
      { _id: '3', name: 'Skill 3', category: 'frontend' },
    ] as any

    expect(store.categoriesCount).toBe(2)
  })

  it('should create skill', async () => {
    const newSkill = { name: 'New Skill', active: true, order: 1 }
    const createdSkill = { _id: '1', ...newSkill }

    vi.mocked(global.$fetch)
      .mockResolvedValueOnce(createdSkill)
      .mockResolvedValueOnce([createdSkill])

    const store = useAdminSkillsStore()
    await store.createSkill(newSkill as any)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should update skill', async () => {
    const updatedSkill = { _id: '1', name: 'Updated', active: true }

    vi.mocked(global.$fetch)
      .mockResolvedValueOnce(updatedSkill)
      .mockResolvedValueOnce([updatedSkill])

    const store = useAdminSkillsStore()
    await store.updateSkill('1', updatedSkill as any)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should toggle active status', async () => {
    const skill = { _id: '1', name: 'Skill', active: true } as any
    const toggledSkill = { ...skill, active: false }

    vi.mocked(global.$fetch)
      .mockResolvedValueOnce(toggledSkill)
      .mockResolvedValueOnce([toggledSkill])

    const store = useAdminSkillsStore()
    await store.toggleActive(skill)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should delete skill', async () => {
    vi.mocked(mockFetch).mockResolvedValueOnce(undefined).mockResolvedValueOnce([])

    const store = useAdminSkillsStore()
    await store.deleteSkill('1')

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should handle create error with error.data.message', async () => {
    const errorWithData = { data: { message: 'Validation error' } }
    vi.mocked(mockFetch).mockRejectedValue(errorWithData)

    const store = useAdminSkillsStore()
    await expect(store.createSkill({ name: 'Test' } as any)).rejects.toThrow('Validation error')
  })

  it('should handle create error without message', async () => {
    vi.mocked(mockFetch).mockRejectedValue({})

    const store = useAdminSkillsStore()
    await expect(store.createSkill({ name: 'Test' } as any)).rejects.toThrow('Erro ao criar skill')
  })

  it('should handle update error with error.data.message', async () => {
    const errorWithData = { data: { message: 'Not found' } }
    vi.mocked(mockFetch).mockRejectedValue(errorWithData)

    const store = useAdminSkillsStore()
    await expect(store.updateSkill('1', { name: 'Test' } as any)).rejects.toThrow('Not found')
  })

  it('should handle update error without message', async () => {
    vi.mocked(mockFetch).mockRejectedValue({})

    const store = useAdminSkillsStore()
    await expect(store.updateSkill('1', { name: 'Test' } as any)).rejects.toThrow(
      'Erro ao atualizar skill'
    )
  })

  it('should handle toggleActive error', async () => {
    const skill = { _id: '1', name: 'Test', active: true } as any
    vi.mocked(mockFetch).mockRejectedValue(new Error('Toggle failed'))

    const store = useAdminSkillsStore()
    await expect(store.toggleActive(skill)).rejects.toThrow('Toggle failed')
  })

  it('should handle delete error', async () => {
    vi.mocked(mockFetch).mockRejectedValue(new Error('Delete failed'))

    const store = useAdminSkillsStore()
    await expect(store.deleteSkill('1')).rejects.toThrow('Delete failed')
  })
})
