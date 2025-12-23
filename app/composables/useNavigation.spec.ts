import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNavigation } from './useNavigation'

describe('useNavigation', () => {
  beforeEach(() => {
    // Mock window methods
    global.window = {
      scrollTo: vi.fn(),
      scrollY: 0,
      pageYOffset: 0,
    } as any

    // Mock document methods
    global.document = {
      getElementById: vi.fn(),
    } as any
  })

  describe('scrollToSection', () => {
    it('should scroll to top when id is "home"', () => {
      const { scrollToSection } = useNavigation()
      scrollToSection('home')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      })
    })

    it('should scroll to element when it exists', () => {
      const mockElement = {
        getBoundingClientRect: vi.fn(() => ({ top: 100 })),
      }
      vi.mocked(document.getElementById).mockReturnValue(mockElement as any)

      const { scrollToSection } = useNavigation()
      scrollToSection('about')

      expect(document.getElementById).toHaveBeenCalledWith('about')
      expect(window.scrollTo).toHaveBeenCalled()
    })

    it('should not scroll when element does not exist', () => {
      vi.mocked(document.getElementById).mockReturnValue(null)

      const { scrollToSection } = useNavigation()
      scrollToSection('nonexistent')

      expect(document.getElementById).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('scrollToTop', () => {
    it('should scroll to top of page', () => {
      const { scrollToTop } = useNavigation()
      scrollToTop()

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      })
    })
  })

  describe('isPageScrolled', () => {
    it('should return true when scrolled beyond threshold', () => {
      global.window.scrollY = 100

      const { isPageScrolled } = useNavigation()
      expect(isPageScrolled(50)).toBe(true)
    })

    it('should return false when not scrolled beyond threshold', () => {
      global.window.scrollY = 30

      const { isPageScrolled } = useNavigation()
      expect(isPageScrolled(50)).toBe(false)
    })

    it('should use default threshold if not provided', () => {
      global.window.scrollY = 100

      const { isPageScrolled } = useNavigation()
      const result = isPageScrolled()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('shouldShowScrollTop', () => {
    it('should return true when scrolled beyond show threshold', () => {
      global.window.scrollY = 500

      const { shouldShowScrollTop } = useNavigation()
      expect(shouldShowScrollTop()).toBe(true)
    })

    it('should return false when not scrolled beyond show threshold', () => {
      global.window.scrollY = 100

      const { shouldShowScrollTop } = useNavigation()
      expect(shouldShowScrollTop()).toBe(false)
    })
  })

  describe('getActiveSection', () => {
    it('should return active section based on scroll position', () => {
      const sections = ['home', 'about', 'skills']
      const { getActiveSection } = useNavigation()
      const activeSection = getActiveSection(sections)
      expect(typeof activeSection).toBe('string')
    })

    it('should default to home when no section is active', () => {
      vi.mocked(document.getElementById).mockReturnValue(null)
      const sections = ['home', 'about']
      const { getActiveSection } = useNavigation()
      expect(getActiveSection(sections)).toBe('home')
    })
  })
})
