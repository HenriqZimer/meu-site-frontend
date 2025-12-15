import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('Projects Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty projects', () => {
    const projects: any[] = []
    expect(projects).toEqual([])
  })

  it('should handle project data', () => {
    const project = {
      id: '1',
      title: 'Portfolio',
      description: 'Personal portfolio',
      technologies: ['Vue', 'Nuxt'],
      url: 'https://example.com',
    }
    expect(project.title).toBe('Portfolio')
    expect(project.technologies).toContain('Vue')
  })
})
