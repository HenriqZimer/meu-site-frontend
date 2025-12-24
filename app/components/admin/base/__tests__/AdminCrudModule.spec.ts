import { describe, it, expect} from 'vitest'

describe('AdminCrudModule', () => {
  it('should validate email correctly', () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    expect(emailRegex.test('test@example.com')).toBe(true)
    expect(emailRegex.test('user.name@domain.co.uk')).toBe(true)
    expect(emailRegex.test('invalid-email')).toBe(false)
    expect(emailRegex.test('@example.com')).toBe(false)
    expect(emailRegex.test('test@')).toBe(false)
  })

  it('should validate URL correctly', () => {
    const urlRegex = /^https?:\/\/.+/
    
    expect(urlRegex.test('https://example.com')).toBe(true)
    expect(urlRegex.test('http://example.com')).toBe(true)
    expect(urlRegex.test('ftp://example.com')).toBe(false)
    expect(urlRegex.test('example.com')).toBe(false)
  })

  it('should validate required field correctly', () => {
    const isRequired = (v: any) => !!v
    
    expect(isRequired('value')).toBe(true)
    expect(isRequired(' ')).toBe(true) // Spaces count
    expect(isRequired('')).toBe(false)
    expect(isRequired(null)).toBe(false)
    expect(isRequired(undefined)).toBe(false)
  })
})
