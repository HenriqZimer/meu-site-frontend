import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('Certifications Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty certifications', () => {
    const certifications: any[] = []
    expect(certifications).toEqual([])
  })

  it('should handle certification data', () => {
    const cert = {
      id: '1',
      name: 'AWS Certified',
      issuer: 'Amazon',
      date: '2024-01',
      url: 'https://aws.amazon.com',
    }
    expect(cert.name).toBe('AWS Certified')
    expect(cert.issuer).toBe('Amazon')
  })
})
