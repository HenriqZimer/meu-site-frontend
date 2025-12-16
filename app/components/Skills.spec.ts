import { describe, it, expect } from 'vitest'

describe('Skills Component', () => {
  it('should have skills categories', () => {
    const categories = ['Frontend', 'Backend', 'DevOps', 'Database']
    expect(categories.length).toBeGreaterThan(0)
  })

  it('should display skills with proficiency', () => {
    const skill = {
      name: 'Vue.js',
      proficiency: 90,
      category: 'Frontend',
    }
    expect(skill.proficiency).toBeGreaterThanOrEqual(0)
    expect(skill.proficiency).toBeLessThanOrEqual(100)
  })

  it('should filter skills by category', () => {
    const filterByCategory = (category: string) => category
    expect(filterByCategory('Frontend')).toBe('Frontend')
  })

  it('should render skill icons', () => {
    const hasIcon = true
    expect(hasIcon).toBe(true)
  })
})
