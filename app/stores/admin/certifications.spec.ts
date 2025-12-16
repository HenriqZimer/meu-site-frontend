import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminCertificationsStore } from './certifications'

// Mock $fetch
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiUrl: 'http://localhost:3000/api',
    },
  }),
}))

global.$fetch = vi.fn()

describe('useAdminCertificationsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const store = useAdminCertificationsStore()

    expect(store.certifications).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should fetch certifications successfully', async () => {
    const mockCertifications = [
      { _id: '1', name: 'Cert 1', active: true, order: 1, skills: 5 },
      { _id: '2', name: 'Cert 2', active: false, order: 2, skills: 3 },
    ]

    vi.mocked(global.$fetch).mockResolvedValue(mockCertifications)

    const store = useAdminCertificationsStore()
    await store.fetchCertifications()

    expect(store.certifications).toEqual(mockCertifications)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    vi.mocked(global.$fetch).mockRejectedValue(new Error('Network error'))

    const store = useAdminCertificationsStore()
    await expect(store.fetchCertifications()).rejects.toThrow('Network error')

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Network error')
  })

  it('should calculate active count correctly', () => {
    const store = useAdminCertificationsStore()
    store.certifications = [
      { _id: '1', name: 'Cert 1', active: true, order: 1 },
      { _id: '2', name: 'Cert 2', active: false, order: 2 },
      { _id: '3', name: 'Cert 3', active: true, order: 3 },
    ] as any

    expect(store.activeCount).toBe(2)
    expect(store.inactiveCount).toBe(1)
  })

  it('should calculate total skills correctly', () => {
    const store = useAdminCertificationsStore()
    store.certifications = [
      { _id: '1', name: 'Cert 1', active: true, skills: 5 },
      { _id: '2', name: 'Cert 2', active: true, skills: 3 },
    ] as any

    expect(store.totalSkills).toBe(8)
  })

  it('should create certification', async () => {
    const newCert = { name: 'New Cert', active: true, order: 1 }
    const createdCert = { _id: '1', ...newCert }

    vi.mocked(global.$fetch).mockResolvedValueOnce(createdCert).mockResolvedValueOnce([createdCert])

    const store = useAdminCertificationsStore()
    await store.createCertification(newCert as any)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should update certification', async () => {
    const updatedCert = { _id: '1', name: 'Updated', active: true }

    vi.mocked(global.$fetch).mockResolvedValueOnce(updatedCert).mockResolvedValueOnce([updatedCert])

    const store = useAdminCertificationsStore()
    await store.updateCertification('1', updatedCert as any)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should toggle active status', async () => {
    const cert = { _id: '1', name: 'Cert', active: true } as any
    const toggledCert = { ...cert, active: false }

    vi.mocked(global.$fetch).mockResolvedValueOnce(toggledCert).mockResolvedValueOnce([toggledCert])

    const store = useAdminCertificationsStore()
    await store.toggleActive(cert)

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })

  it('should delete certification', async () => {
    vi.mocked(global.$fetch).mockResolvedValueOnce(undefined).mockResolvedValueOnce([])

    const store = useAdminCertificationsStore()
    await store.deleteCertification('1')

    expect(global.$fetch).toHaveBeenCalledTimes(2)
  })
})
