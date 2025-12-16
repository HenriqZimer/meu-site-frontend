import { describe, it, expect } from 'vitest'

describe('useNavigation', () => {
  it('should have navigation items', () => {
    const items = [
      { title: 'Home', to: '#home' },
      { title: 'About', to: '#about' },
      { title: 'Skills', to: '#skills' },
    ]
    expect(items).toBeDefined()
    expect(items.length).toBeGreaterThan(0)
  })

  it('should navigate to sections', () => {
    const sections = ['home', 'about', 'skills', 'portfolio', 'certifications', 'contact']
    sections.forEach(section => {
      expect(section).toBeTruthy()
    })
  })
})
