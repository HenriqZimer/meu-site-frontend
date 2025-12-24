import { describe, it, expect } from 'vitest'

describe('Portfolio', () => {
  it('should filter projects by category', () => {
    const projects = [
      { id: 1, title: 'Web App', technologies: ['Vue', 'TypeScript'] },
      { id: 2, title: 'Mobile App', technologies: ['React Native'] },
      { id: 3, title: 'API', technologies: ['NestJS', 'TypeScript'] },
    ]

    const filterByTech = (projects: any[], tech: string) =>
      projects.filter(p => p.technologies.some((t: string) => t.includes(tech)))

    expect(filterByTech(projects, 'TypeScript')).toHaveLength(2)
    expect(filterByTech(projects, 'Vue')).toHaveLength(1)
    expect(filterByTech(projects, 'React')).toHaveLength(1)
  })

  it('should paginate projects correctly', () => {
    const projects = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, title: `Project ${i + 1}` }))
    const itemsPerPage = 3

    const paginate = (items: any[], page: number, perPage: number) => {
      const start = page * perPage
      return items.slice(start, start + perPage)
    }

    expect(paginate(projects, 0, itemsPerPage)).toHaveLength(3)
    expect(paginate(projects, 0, itemsPerPage)[0].id).toBe(1)
    expect(paginate(projects, 1, itemsPerPage)[0].id).toBe(4)
    expect(paginate(projects, 3, itemsPerPage)).toHaveLength(1) // Last page
  })

  it('should calculate total pages correctly', () => {
    const calculateTotalPages = (totalItems: number, itemsPerPage: number) =>
      Math.ceil(totalItems / itemsPerPage)

    expect(calculateTotalPages(10, 3)).toBe(4)
    expect(calculateTotalPages(9, 3)).toBe(3)
    expect(calculateTotalPages(0, 3)).toBe(0)
  })
})
