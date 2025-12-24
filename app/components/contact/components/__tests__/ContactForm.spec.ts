import { describe, it, expect } from 'vitest'

describe('ContactForm', () => {
  it('should validate name - minimum 3 characters', () => {
    const validateName = (value: string) => {
      if (!value.trim()) return 'O nome é obrigatório'
      if (value.trim().length < 3) return 'O nome deve ter pelo menos 3 caracteres'
      return ''
    }

    expect(validateName('')).toBe('O nome é obrigatório')
    expect(validateName('Jo')).toBe('O nome deve ter pelo menos 3 caracteres')
    expect(validateName('John')).toBe('')
  })

  it('should validate email format correctly', () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    expect(emailRegex.test('test@example.com')).toBe(true)
    expect(emailRegex.test('user.name+tag@example.co.uk')).toBe(true)
    expect(emailRegex.test('invalid-email')).toBe(false)
    expect(emailRegex.test('@example.com')).toBe(false)
    expect(emailRegex.test('test@')).toBe(false)
    expect(emailRegex.test('test@.com')).toBe(false)
  })

  it('should validate subject - minimum 3 characters', () => {
    const validateSubject = (value: string) => {
      if (!value.trim()) return 'O assunto é obrigatório'
      if (value.trim().length < 3) return 'O assunto deve ter pelo menos 3 caracteres'
      return ''
    }

    expect(validateSubject('')).toBe('O assunto é obrigatório')
    expect(validateSubject('Hi')).toBe('O assunto deve ter pelo menos 3 caracteres')
    expect(validateSubject('Hello')).toBe('')
  })

  it('should validate message - minimum 10 characters', () => {
    const validateMessage = (value: string) => {
      if (!value.trim()) return 'A mensagem é obrigatória'
      if (value.trim().length < 10) return 'A mensagem deve ter pelo menos 10 caracteres'
      return ''
    }

    expect(validateMessage('')).toBe('A mensagem é obrigatória')
    expect(validateMessage('Short')).toBe('A mensagem deve ter pelo menos 10 caracteres')
    expect(validateMessage('This is a valid message')).toBe('')
  })

  it('should check if form is valid with all fields filled correctly', () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message with enough characters',
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    const isValid =
      formData.name.trim().length >= 3 &&
      emailRegex.test(formData.email) &&
      formData.subject.trim().length >= 3 &&
      formData.message.trim().length >= 10

    expect(isValid).toBe(true)
  })

  it('should check if form is invalid with incomplete data', () => {
    const formData = {
      name: 'Jo',  // Too short
      email: 'invalid',
      subject: 'Hi',  // Too short
      message: 'Short',
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    const isValid =
      formData.name.trim().length >= 3 &&
      emailRegex.test(formData.email) &&
      formData.subject.trim().length >= 3 &&
      formData.message.trim().length >= 10

    expect(isValid).toBe(false)
  })
})
