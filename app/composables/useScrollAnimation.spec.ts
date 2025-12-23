import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useScrollAnimation } from './useScrollAnimation'

describe('useScrollAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('animateElement', () => {
    it('should add animation classes to element after delay', async () => {
      const mockElement = document.createElement('div')
      mockElement.classList.add('animate-initial')

      const { animateElement } = useScrollAnimation()
      animateElement(mockElement, 'fadeUp', 0)

      await vi.runAllTimersAsync()

      expect(mockElement.classList.contains('animate-initial')).toBe(false)
      expect(mockElement.classList.contains('animate-visible')).toBe(true)
      expect(mockElement.classList.contains('animate-fadeUp')).toBe(true)
    })

    it('should use default animation type when not provided', async () => {
      const mockElement = document.createElement('div')

      const { animateElement } = useScrollAnimation()
      animateElement(mockElement)

      await vi.runAllTimersAsync()

      expect(mockElement.classList.contains('animate-fadeUp')).toBe(true)
    })

    it('should apply custom animation type', async () => {
      const mockElement = document.createElement('div')

      const { animateElement } = useScrollAnimation()
      animateElement(mockElement, 'slideLeft')

      await vi.runAllTimersAsync()

      expect(mockElement.classList.contains('animate-slideLeft')).toBe(true)
    })

    it('should respect delay parameter', async () => {
      const mockElement = document.createElement('div')
      mockElement.classList.add('animate-initial')

      const { animateElement } = useScrollAnimation()
      animateElement(mockElement, 'fadeUp', 300)

      // Verificar que ainda não animou
      expect(mockElement.classList.contains('animate-visible')).toBe(false)

      // Avançar 300ms
      await vi.advanceTimersByTimeAsync(300)

      expect(mockElement.classList.contains('animate-visible')).toBe(true)
    })

    it('should use zero delay as default', async () => {
      const mockElement = document.createElement('div')

      const { animateElement } = useScrollAnimation()
      animateElement(mockElement, 'fadeUp')

      await vi.advanceTimersByTimeAsync(0)

      expect(mockElement.classList.contains('animate-visible')).toBe(true)
    })
  })

  describe('animateSequence', () => {
    it('should animate elements in staggered sequence', async () => {
      const mockElements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ]

      mockElements.forEach(el => el.classList.add('animate-initial'))

      const { animateSequence } = useScrollAnimation()
      animateSequence(mockElements, 'fadeUp', 100)

      // Primeiro elemento deve ser animado imediatamente
      await vi.advanceTimersByTimeAsync(0)
      expect(mockElements[0].classList.contains('animate-visible')).toBe(true)
      expect(mockElements[1].classList.contains('animate-visible')).toBe(false)
      expect(mockElements[2].classList.contains('animate-visible')).toBe(false)

      // Segundo elemento após 100ms
      await vi.advanceTimersByTimeAsync(100)
      expect(mockElements[1].classList.contains('animate-visible')).toBe(true)
      expect(mockElements[2].classList.contains('animate-visible')).toBe(false)

      // Terceiro elemento após mais 100ms
      await vi.advanceTimersByTimeAsync(100)
      expect(mockElements[2].classList.contains('animate-visible')).toBe(true)
    })

    it('should work with NodeList', async () => {
      // Create a mock NodeList
      const mockElements = [document.createElement('div'), document.createElement('div')]

      Object.defineProperty(mockElements, 'length', {
        value: 2,
      })

      const { animateSequence } = useScrollAnimation()
      animateSequence(mockElements as any, 'fadeUp', 50)

      await vi.runAllTimersAsync()

      expect(mockElements[0].classList.contains('animate-visible')).toBe(true)
      expect(mockElements[1].classList.contains('animate-visible')).toBe(true)
    })

    it('should apply custom animation type to all elements', async () => {
      const mockElements = [document.createElement('div'), document.createElement('div')]

      const { animateSequence } = useScrollAnimation()
      animateSequence(mockElements, 'slideLeft', 50)

      await vi.runAllTimersAsync()

      expect(mockElements[0].classList.contains('animate-slideLeft')).toBe(true)
      expect(mockElements[1].classList.contains('animate-slideLeft')).toBe(true)
    })

    it('should use default stagger delay of 100ms', async () => {
      const mockElements = [document.createElement('div'), document.createElement('div')]

      const { animateSequence } = useScrollAnimation()
      animateSequence(mockElements, 'fadeUp')

      await vi.advanceTimersByTimeAsync(0)
      expect(mockElements[0].classList.contains('animate-visible')).toBe(true)
      expect(mockElements[1].classList.contains('animate-visible')).toBe(false)

      await vi.advanceTimersByTimeAsync(100)
      expect(mockElements[1].classList.contains('animate-visible')).toBe(true)
    })

    it('should handle empty arrays', async () => {
      const mockElements: HTMLElement[] = []

      const { animateSequence } = useScrollAnimation()

      expect(() => {
        animateSequence(mockElements, 'fadeUp', 100)
      }).not.toThrow()
    })
  })

  describe('observeElements', () => {
    it('should return a function', () => {
      const { observeElements } = useScrollAnimation()

      expect(typeof observeElements).toBe('function')
    })

    it('should accept optional configuration', () => {
      const { observeElements } = useScrollAnimation()

      expect(() => {
        observeElements({ threshold: 0.5, rootMargin: '10px' })
      }).not.toThrow()
    })

    it('should accept no arguments', () => {
      const { observeElements } = useScrollAnimation()

      expect(() => {
        observeElements()
      }).not.toThrow()
    })
  })

  describe('resetAnimations', () => {
    it('should return a function', () => {
      const { resetAnimations } = useScrollAnimation()

      expect(typeof resetAnimations).toBe('function')
    })

    it('should accept selector parameter', () => {
      const { resetAnimations } = useScrollAnimation()

      expect(() => {
        resetAnimations('.some-selector')
      }).not.toThrow()
    })

    it('should work with no parameters', () => {
      const { resetAnimations } = useScrollAnimation()

      expect(() => {
        resetAnimations()
      }).not.toThrow()
    })
  })

  describe('composable structure', () => {
    it('should return all expected methods', () => {
      const composable = useScrollAnimation()

      expect(composable).toHaveProperty('observeElements')
      expect(composable).toHaveProperty('animateElement')
      expect(composable).toHaveProperty('animateSequence')
      expect(composable).toHaveProperty('resetAnimations')
    })

    it('should return functions for all methods', () => {
      const { observeElements, animateElement, animateSequence, resetAnimations } =
        useScrollAnimation()

      expect(typeof observeElements).toBe('function')
      expect(typeof animateElement).toBe('function')
      expect(typeof animateSequence).toBe('function')
      expect(typeof resetAnimations).toBe('function')
    })
  })
})
