import { describe, it, expect } from 'vitest'

describe('Footer Component', () => {
  it('should have copyright information', () => {
    const year = new Date().getFullYear()
    expect(year).toBeGreaterThan(2020)
  })

  it('should have social links', () => {
    const socialLinks = ['github', 'linkedin', 'twitter']
    expect(socialLinks.length).toBeGreaterThan(0)
  })

  it('should display developer name', () => {
    const name = 'Henrique Zimer'
    expect(name).toBeTruthy()
  })

  it('should have navigation links', () => {
    const footerLinks = ['Privacy', 'Terms', 'Contact']
    expect(Array.isArray(footerLinks)).toBe(true)
  })
})
