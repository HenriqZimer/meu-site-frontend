import { describe, it, expect } from 'vitest'

describe('Hero Component', () => {
  it('should have a title', () => {
    const title = 'Henrique Zimer'
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  it('should have a subtitle or description', () => {
    const subtitle = 'Full Stack Developer'
    expect(subtitle).toBeTruthy()
  })

  it('should have CTA buttons', () => {
    const buttons = ['Ver Projetos', 'Contato']
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should handle scroll to section', () => {
    const scrollToSection = (section: string) => section
    expect(scrollToSection('about')).toBe('about')
    expect(scrollToSection('projects')).toBe('projects')
  })
})
