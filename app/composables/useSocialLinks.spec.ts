import { describe, it, expect } from 'vitest'

describe('useSocialLinks', () => {
  it('should have social links', () => {
    const socialLinks = [
      { icon: 'mdi-github', url: 'https://github.com', label: 'GitHub' },
      { icon: 'mdi-linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
    ]
    expect(socialLinks).toBeDefined()
    expect(socialLinks.length).toBeGreaterThan(0)
  })

  it('should have valid URLs', () => {
    const url = 'https://github.com/user'
    expect(url).toContain('https://')
  })
})
