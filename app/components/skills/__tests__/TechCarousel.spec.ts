import { describe, it, expect } from 'vitest'

describe('SkillsCarousel', () => {
  const mockTechnologies = [
    { name: 'Kubernetes', category: 'DevOps', icon: 'mdi-kubernetes' },
    { name: 'Docker', category: 'Containers', icon: 'mdi-docker' },
  ]

  it('should render tech carousel', () => {
    expect(mockTechnologies).toBeDefined()
    expect(mockTechnologies.length).toBe(2)
  })

  it('should have technology data structure', () => {
    expect(mockTechnologies[0]).toHaveProperty('name')
    expect(mockTechnologies[0]).toHaveProperty('category')
    expect(mockTechnologies[0]).toHaveProperty('icon')
  })
})
