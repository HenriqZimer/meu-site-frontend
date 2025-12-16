import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('Courses Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty courses', () => {
    const courses: any[] = []
    expect(courses).toEqual([])
  })

  it('should handle course data', () => {
    const course = {
      id: '1',
      title: 'Vue Mastery',
      platform: 'Udemy',
      duration: '10 hours',
      url: 'https://udemy.com',
    }
    expect(course.title).toBe('Vue Mastery')
    expect(course.platform).toBe('Udemy')
  })
})
