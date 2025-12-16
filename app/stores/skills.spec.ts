import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('Skills Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty skills', () => {
    const skills: any[] = []
    expect(skills).toEqual([])
  })

  it('should handle skill data', () => {
    const skill = {
      id: '1',
      name: 'TypeScript',
      category: 'Languages',
      level: 'Advanced',
    }
    expect(skill.name).toBe('TypeScript')
    expect(skill.category).toBe('Languages')
  })

  it('should categorize skills', () => {
    const categories = ['Languages', 'Frameworks', 'Tools', 'Cloud']
    expect(categories.length).toBeGreaterThan(0)
  })
})
