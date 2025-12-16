import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminCertificationsStore } from './certifications'

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

describe('useAdminCertificationsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
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

    vi.mocked(mockFetch).mockResolvedValue(mockCertifications)

    const store = useAdminCertificationsStore()
    await store.fetchCertifications()

    expect(store.certifications).toEqual(mockCertifications)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    vi.mocked(mockFetch).mockRejectedValue(new Error('Network error'))

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

    vi.mocked(mockFetch).mockResolvedValueOnce(createdCert).mockResolvedValueOnce([createdCert])

    const store = useAdminCertificationsStore()
    await store.createCertification(newCert as any)

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should update certification', async () => {
    const updatedCert = { _id: '1', name: 'Updated', active: true }

    vi.mocked(mockFetch).mockResolvedValueOnce(updatedCert).mockResolvedValueOnce([updatedCert])

    const store = useAdminCertificationsStore()
    await store.updateCertification('1', updatedCert as any)

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should toggle active status', async () => {
    const cert = { _id: '1', name: 'Cert', active: true } as any
    const toggledCert = { ...cert, active: false }

    vi.mocked(mockFetch).mockResolvedValueOnce(toggledCert).mockResolvedValueOnce([toggledCert])

    const store = useAdminCertificationsStore()
    await store.toggleActive(cert)

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should delete certification', async () => {
    vi.mocked(mockFetch).mockResolvedValueOnce(undefined).mockResolvedValueOnce([])

    const store = useAdminCertificationsStore()
    await store.deleteCertification('1')

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should handle create error with error.data.message', async () => {
    const errorWithData = { data: { message: 'Validation error' } }
    vi.mocked(mockFetch).mockRejectedValue(errorWithData)

    const store = useAdminCertificationsStore()
    await expect(store.createCertification({ name: 'Test' } as any)).rejects.toThrow(
      'Validation error'
    )
  })

  it('should handle create error without message', async () => {
    vi.mocked(mockFetch).mockRejectedValue({})

    const store = useAdminCertificationsStore()
    await expect(store.createCertification({ name: 'Test' } as any)).rejects.toThrow(
      'Erro ao criar certificação'
    )
  })

  it('should handle update error with error.data.message', async () => {
    const errorWithData = { data: { message: 'Not found' } }
    vi.mocked(mockFetch).mockRejectedValue(errorWithData)

    const store = useAdminCertificationsStore()
    await expect(store.updateCertification('1', { name: 'Test' } as any)).rejects.toThrow(
      'Not found'
    )
  })

  it('should handle update error without message', async () => {
    vi.mocked(mockFetch).mockRejectedValue({})

    const store = useAdminCertificationsStore()
    await expect(store.updateCertification('1', { name: 'Test' } as any)).rejects.toThrow(
      'Erro ao atualizar certificação'
    )
  })
})
