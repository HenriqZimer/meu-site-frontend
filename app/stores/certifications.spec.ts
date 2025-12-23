import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCertificationsStore } from './certifications'

// Mock global $fetch
const mockFetch = vi.fn()
global.$fetch = mockFetch as any

// Mock global useRuntimeConfig
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiUrl: 'http://localhost:3001',
  },
}))

describe('useCertificationsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with empty state', () => {
      const store = useCertificationsStore()

      expect(store.certifications).toEqual([])
      expect(store.stats).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.lastFetch).toBeNull()
      expect(store.lastStatsFetch).toBeNull()
    })
  })

  describe('getters', () => {
    it('allCertifications should return sorted certifications by date', () => {
      const store = useCertificationsStore()
      const mockCerts = [
        { name: 'Cert1', issuer: 'Issuer1', image: 'img1', link: 'link1', date: '2023-01' },
        { name: 'Cert2', issuer: 'Issuer2', image: 'img2', link: 'link2', date: '2024-01' },
        { name: 'Cert3', issuer: 'Issuer3', image: 'img3', link: 'link3', date: '2023-06' },
      ]
      store.certifications = mockCerts

      const sorted = store.allCertifications
      expect(sorted[0].date).toBe('2024-01')
      expect(sorted[1].date).toBe('2023-06')
      expect(sorted[2].date).toBe('2023-01')
    })

    it('allCertifications should handle certifications without dates', () => {
      const store = useCertificationsStore()
      const mockCerts = [
        { name: 'Cert1', issuer: 'Issuer1', image: 'img1', link: 'link1' },
        { name: 'Cert2', issuer: 'Issuer2', image: 'img2', link: 'link2', date: '2024-01' },
      ]
      store.certifications = mockCerts

      expect(() => store.allCertifications).not.toThrow()
    })

    it('certificationsCount should return stats total when available', () => {
      const store = useCertificationsStore()
      store.stats = { total: 10, byIssuer: {} }

      expect(store.certificationsCount).toBe(10)
    })

    it('certificationsCount should return certifications length when stats not available', () => {
      const store = useCertificationsStore()
      store.certifications = [
        { name: 'Cert1', issuer: 'Issuer1', image: 'img1', link: 'link1' },
        { name: 'Cert2', issuer: 'Issuer2', image: 'img2', link: 'link2' },
      ]

      expect(store.certificationsCount).toBe(2)
    })

    it('isLoaded should return true when certifications exist', () => {
      const store = useCertificationsStore()

      expect(store.isLoaded).toBe(false)

      store.certifications = [{ name: 'Cert1', issuer: 'Issuer1', image: 'img1', link: 'link1' }]

      expect(store.isLoaded).toBe(true)
    })

    it('needsRefresh should return true when lastFetch is null', () => {
      const store = useCertificationsStore()

      expect(store.needsRefresh).toBe(true)
    })

    it('needsRefresh should return false when last fetch is recent', () => {
      const store = useCertificationsStore()
      store.lastFetch = Date.now()

      expect(store.needsRefresh).toBe(false)
    })

    it('needsRefresh should return true when last fetch is older than 5 minutes', () => {
      const store = useCertificationsStore()
      store.lastFetch = Date.now() - 6 * 60 * 1000

      expect(store.needsRefresh).toBe(true)
    })

    it('statsNeedRefresh should return true when lastStatsFetch is null', () => {
      const store = useCertificationsStore()

      expect(store.statsNeedRefresh).toBe(true)
    })

    it('statsNeedRefresh should return false when last stats fetch is recent', () => {
      const store = useCertificationsStore()
      store.lastStatsFetch = Date.now()

      expect(store.statsNeedRefresh).toBe(false)
    })
  })

  describe('actions', () => {
    describe('fetchCertifications', () => {
      it('should fetch certifications successfully', async () => {
        const store = useCertificationsStore()
        const mockData = [
          { name: 'AWS Cert', issuer: 'Amazon', image: 'img', link: 'link' },
          { name: 'Azure Cert', issuer: 'Microsoft', image: 'img2', link: 'link2' },
        ]

        mockFetch.mockResolvedValueOnce(mockData)

        await store.fetchCertifications()

        expect(store.certifications).toEqual(mockData)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.lastFetch).toBeDefined()
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/certifications',
          expect.objectContaining({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })

      it('should skip fetch if data is already loaded and fresh', async () => {
        const store = useCertificationsStore()
        store.certifications = [{ name: 'Cert', issuer: 'Issuer', image: 'img', link: 'link' }]
        store.lastFetch = Date.now()

        const result = await store.fetchCertifications()

        expect(mockFetch).not.toHaveBeenCalled()
        expect(result).toEqual(store.certifications)
      })

      it('should fetch if data needs refresh', async () => {
        const store = useCertificationsStore()
        store.certifications = [{ name: 'Old', issuer: 'Old', image: 'old', link: 'old' }]
        store.lastFetch = Date.now() - 6 * 60 * 1000

        const mockData = [{ name: 'New', issuer: 'New', image: 'new', link: 'new' }]
        mockFetch.mockResolvedValueOnce(mockData)

        await store.fetchCertifications()

        expect(mockFetch).toHaveBeenCalled()
        expect(store.certifications).toEqual(mockData)
      })

      it('should handle fetch errors', async () => {
        const store = useCertificationsStore()
        const errorMessage = 'Network error'

        mockFetch.mockRejectedValueOnce(new Error(errorMessage))

        await expect(store.fetchCertifications()).rejects.toThrow(errorMessage)

        expect(store.error).toBe(errorMessage)
        expect(store.loading).toBe(false)
      })

      it('should handle non-Error exceptions', async () => {
        const store = useCertificationsStore()

        mockFetch.mockRejectedValueOnce('String error')

        await expect(store.fetchCertifications()).rejects.toBe('String error')

        expect(store.error).toBe('Erro ao carregar certificações')
        expect(store.loading).toBe(false)
      })
    })

    describe('fetchStats', () => {
      it('should fetch stats successfully', async () => {
        const store = useCertificationsStore()
        const mockStats = { total: 10, byIssuer: { AWS: 3, Azure: 2 } }

        mockFetch.mockResolvedValueOnce(mockStats)

        await store.fetchStats()

        expect(store.stats).toEqual(mockStats)
        expect(store.lastStatsFetch).toBeDefined()
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/certifications/stats',
          expect.objectContaining({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })

      it('should skip fetch if stats are fresh', async () => {
        const store = useCertificationsStore()
        store.stats = { total: 10, byIssuer: {} }
        store.lastStatsFetch = Date.now()

        const result = await store.fetchStats()

        expect(mockFetch).not.toHaveBeenCalled()
        expect(result).toEqual(store.stats)
      })

      it('should handle stats fetch errors', async () => {
        const store = useCertificationsStore()

        mockFetch.mockRejectedValueOnce(new Error('Stats error'))

        await expect(store.fetchStats()).rejects.toThrow('Stats error')
      })
    })

    describe('clearCache', () => {
      it('should clear all cached data', () => {
        const store = useCertificationsStore()
        store.certifications = [{ name: 'Cert', issuer: 'Issuer', image: 'img', link: 'link' }]
        store.stats = { total: 10, byIssuer: {} }
        store.lastFetch = Date.now()
        store.lastStatsFetch = Date.now()

        store.clearCache()

        expect(store.certifications).toEqual([])
        expect(store.stats).toBeNull()
        expect(store.lastFetch).toBeNull()
        expect(store.lastStatsFetch).toBeNull()
      })
    })
  })
})
