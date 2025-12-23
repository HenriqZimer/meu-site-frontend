import { describe, it, expect } from 'vitest'
import { useSocialLinks } from './useSocialLinks'

describe('useSocialLinks', () => {
  describe('socialLinks', () => {
    it('should return array of social links', () => {
      const { socialLinks } = useSocialLinks()
      expect(Array.isArray(socialLinks)).toBe(true)
      expect(socialLinks.length).toBeGreaterThan(0)
    })

    it('should have valid structure for each link', () => {
      const { socialLinks } = useSocialLinks()
      socialLinks.forEach(link => {
        expect(link).toHaveProperty('name')
        expect(link).toHaveProperty('icon')
        expect(link).toHaveProperty('url')
        expect(link).toHaveProperty('label')
        expect(link.icon).toContain('mdi-')
        expect(link.url).toMatch(/^https?:\/\/|^mailto:/)
      })
    })

    it('should include GitHub link', () => {
      const { socialLinks } = useSocialLinks()
      const github = socialLinks.find(link => link.name === 'GitHub')
      expect(github).toBeDefined()
      expect(github?.icon).toBe('mdi-github')
      expect(github?.url).toContain('github.com')
    })

    it('should include LinkedIn link', () => {
      const { socialLinks } = useSocialLinks()
      const linkedin = socialLinks.find(link => link.name === 'LinkedIn')
      expect(linkedin).toBeDefined()
      expect(linkedin?.icon).toBe('mdi-linkedin')
      expect(linkedin?.url).toContain('linkedin.com')
    })

    it('should include Email link', () => {
      const { socialLinks } = useSocialLinks()
      const email = socialLinks.find(link => link.name === 'Email')
      expect(email).toBeDefined()
      expect(email?.icon).toBe('mdi-email-outline')
      expect(email?.url).toContain('mailto:')
    })
  })

  describe('footerSocialLinks', () => {
    it('should return array of footer social links', () => {
      const { footerSocialLinks } = useSocialLinks()
      expect(Array.isArray(footerSocialLinks)).toBe(true)
      expect(footerSocialLinks.length).toBeGreaterThan(0)
    })

    it('should have href instead of url', () => {
      const { footerSocialLinks } = useSocialLinks()
      footerSocialLinks.forEach(link => {
        expect(link).toHaveProperty('href')
        expect(link).not.toHaveProperty('url')
      })
    })

    it('should have label for accessibility', () => {
      const { footerSocialLinks } = useSocialLinks()
      footerSocialLinks.forEach(link => {
        expect(link).toHaveProperty('label')
        expect(link.label).toBeTruthy()
      })
    })
  })
})
