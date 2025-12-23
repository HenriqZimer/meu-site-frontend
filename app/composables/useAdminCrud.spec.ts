import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAdminCrud } from './useAdminCrud'

describe('useAdminCrud', () => {
  let mockStore: any

  beforeEach(() => {
    mockStore = {
      allItems: [{ _id: '1', name: 'Item 1' }],
      loading: false,
      activeCount: 5,
      inactiveCount: 2,
      categoriesCount: 3,
      fetchItems: vi.fn().mockResolvedValue(undefined),
      createItem: vi.fn().mockResolvedValue({ _id: '2', name: 'New Item' }),
      updateItem: vi.fn().mockResolvedValue({ _id: '1', name: 'Updated' }),
      deleteItem: vi.fn().mockResolvedValue(undefined),
      toggleActive: vi.fn().mockResolvedValue(undefined),
    }
  })

  it('should compute items from store', () => {
    const crud = useAdminCrud(mockStore)
    expect(crud.items.value).toEqual([{ _id: '1', name: 'Item 1' }])
  })

  it('should fallback to empty array if no items', () => {
    mockStore.allItems = undefined
    mockStore.items = undefined
    const crud = useAdminCrud(mockStore)
    expect(crud.items.value).toEqual([])
  })

  it('should compute loading state', () => {
    const crud = useAdminCrud(mockStore)
    expect(crud.loading.value).toBe(false)
  })

  it('should compute stats correctly', () => {
    const crud = useAdminCrud(mockStore)
    expect(crud.stats.value).toEqual({
      total: 1,
      activeCount: 5,
      inactiveCount: 2,
      categoriesCount: 3,
    })
  })

  it('should call fetchItems on onFetch', async () => {
    const crud = useAdminCrud(mockStore)
    await crud.onFetch()
    expect(mockStore.fetchItems).toHaveBeenCalled()
  })

  it('should call createItem on onCreate', async () => {
    const crud = useAdminCrud(mockStore)
    const newItem = { name: 'New Item' }
    await crud.onCreate(newItem)
    expect(mockStore.createItem).toHaveBeenCalledWith(newItem)
  })

  it('should call updateItem on onUpdate', async () => {
    const crud = useAdminCrud(mockStore)
    const updates = { name: 'Updated' }
    await crud.onUpdate('1', updates)
    expect(mockStore.updateItem).toHaveBeenCalledWith('1', updates)
  })

  it('should call deleteItem on onDelete', async () => {
    const crud = useAdminCrud(mockStore)
    await crud.onDelete('1')
    expect(mockStore.deleteItem).toHaveBeenCalledWith('1')
  })

  it('should call toggleActive on onToggleActive', async () => {
    const crud = useAdminCrud(mockStore)
    const item = { _id: '1', active: true }
    await crud.onToggleActive(item)
    expect(mockStore.toggleActive).toHaveBeenCalledWith(item)
  })

  describe('store variations', () => {
    it('should work with projects store', () => {
      mockStore = {
        allProjects: [{ _id: '1', title: 'Project 1' }],
        loading: false,
        fetchProjects: vi.fn(),
      }
      const crud = useAdminCrud(mockStore)
      expect(crud.items.value).toEqual([{ _id: '1', title: 'Project 1' }])
    })

    it('should work with skills store', () => {
      mockStore = {
        allSkills: [{ _id: '1', name: 'Skill 1' }],
        loading: false,
        fetchSkills: vi.fn(),
      }
      const crud = useAdminCrud(mockStore)
      expect(crud.items.value).toEqual([{ _id: '1', name: 'Skill 1' }])
    })

    it('should work with certifications store', () => {
      mockStore = {
        allCertifications: [{ _id: '1', name: 'Cert 1' }],
        loading: false,
        fetchCertifications: vi.fn(),
      }
      const crud = useAdminCrud(mockStore)
      expect(crud.items.value).toEqual([{ _id: '1', name: 'Cert 1' }])
    })

    it('should work with courses store', () => {
      mockStore = {
        allCourses: [{ _id: '1', name: 'Course 1' }],
        loading: false,
        fetchCourses: vi.fn(),
      }
      const crud = useAdminCrud(mockStore)
      expect(crud.items.value).toEqual([{ _id: '1', name: 'Course 1' }])
    })

    it('should work with contacts store', () => {
      mockStore = {
        allContacts: [{ _id: '1', name: 'Contact 1' }],
        loading: false,
        fetchContacts: vi.fn(),
      }
      const crud = useAdminCrud(mockStore)
      expect(crud.items.value).toEqual([{ _id: '1', name: 'Contact 1' }])
    })
  })

  describe('fallback to Promise.resolve()', () => {
    beforeEach(() => {
      mockStore = {
        allItems: [],
        loading: false,
      }
    })

    it('should resolve onFetch when no method available', async () => {
      const crud = useAdminCrud(mockStore)
      await expect(crud.onFetch()).resolves.toBeUndefined()
    })

    it('should resolve onCreate when no method available', async () => {
      const crud = useAdminCrud(mockStore)
      await expect(crud.onCreate({})).resolves.toBeUndefined()
    })

    it('should resolve onUpdate when no method available', async () => {
      const crud = useAdminCrud(mockStore)
      await expect(crud.onUpdate('1', {})).resolves.toBeUndefined()
    })

    it('should resolve onDelete when no method available', async () => {
      const crud = useAdminCrud(mockStore)
      await expect(crud.onDelete('1')).resolves.toBeUndefined()
    })

    it('should resolve onToggleActive when no method available', async () => {
      const crud = useAdminCrud(mockStore)
      await expect(crud.onToggleActive({})).resolves.toBeUndefined()
    })
  })
})
