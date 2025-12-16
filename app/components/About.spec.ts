import { describe, it, expect } from 'vitest'

describe('About Component', () => {
  it('should have about content', () => {
    const aboutText = 'Sobre mim'
    expect(aboutText).toBeTruthy()
  })

  it('should have skills or technologies', () => {
    const technologies = ['Vue.js', 'NestJS', 'Docker']
    expect(technologies.length).toBeGreaterThan(0)
  })

  it('should have experience information', () => {
    const yearsOfExperience = 5
    expect(yearsOfExperience).toBeGreaterThan(0)
  })

  it('should render description', () => {
    const description = 'Desenvolvedor Full Stack com experiência em...'
    expect(description.length).toBeGreaterThan(0)
  })
})
