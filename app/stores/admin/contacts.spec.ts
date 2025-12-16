import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminContactsStore } from './contacts'

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

describe('useAdminContactsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const store = useAdminContactsStore()

    expect(store.contacts).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should fetch contacts successfully', async () => {
    const mockContacts = [
      {
        _id: '1',
        name: 'John',
        email: 'john@test.com',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '2',
        name: 'Jane',
        email: 'jane@test.com',
        read: true,
        createdAt: new Date().toISOString(),
      },
    ]

    vi.mocked(mockFetch).mockResolvedValue({ data: mockContacts, count: 2 })

    const store = useAdminContactsStore()
    await store.fetchContacts()

    expect(store.contacts).toEqual(mockContacts)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    vi.mocked(mockFetch).mockRejectedValue(new Error('Network error'))

    const store = useAdminContactsStore()
    await expect(store.fetchContacts()).rejects.toThrow('Network error')

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Network error')
  })

  it('should calculate unread count correctly', () => {
    const store = useAdminContactsStore()
    store.contacts = [
      { _id: '1', name: 'John', read: false },
      { _id: '2', name: 'Jane', read: true },
      { _id: '3', name: 'Bob', read: false },
    ] as any

    expect(store.unreadCount).toBe(2)
    expect(store.readCount).toBe(1)
  })

  it('should calculate today count correctly', () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const store = useAdminContactsStore()
    store.contacts = [
      { _id: '1', name: 'John', createdAt: today.toISOString() },
      { _id: '2', name: 'Jane', createdAt: yesterday.toISOString() },
    ] as any

    expect(store.todayCount).toBe(1)
  })

  it('should toggle read status', async () => {
    const contact = { _id: '1', name: 'John', read: false }
    const toggledContact = { ...contact, read: true }

    vi.mocked(mockFetch).mockResolvedValue({ data: toggledContact, message: 'Success' })

    const store = useAdminContactsStore()
    store.contacts = [contact] as any

    await store.toggleRead('1')

    expect(store.contacts[0]?.read).toBe(true)
  })

  it('should delete contact', async () => {
    vi.mocked(mockFetch)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ data: [], count: 0 })

    const store = useAdminContactsStore()
    await store.deleteContact('1')

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should delete all read contacts', async () => {
    const store = useAdminContactsStore()
    store.contacts = [
      { _id: '1', name: 'John', read: true },
      { _id: '2', name: 'Jane', read: false },
      { _id: '3', name: 'Bob', read: true },
    ] as any

    vi.mocked(mockFetch).mockResolvedValue({ data: [], count: 0 })

    await store.deleteAllRead()

    expect(mockFetch).toHaveBeenCalled()
  })
})
