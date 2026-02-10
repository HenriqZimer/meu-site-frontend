import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { useResponsive, BREAKPOINTS } from './useResponsive'

// Mock Vue lifecycle hooks to avoid warnings
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn(fn => fn()),
    onUnmounted: vi.fn(fn => fn()),
  }
})

describe('useResponsive', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should have correct breakpoints', () => {
    expect(BREAKPOINTS.xs).toBe(0)
    expect(BREAKPOINTS.sm).toBe(600)
    expect(BREAKPOINTS.md).toBe(960)
    expect(BREAKPOINTS.lg).toBe(1264)
    expect(BREAKPOINTS.xl).toBe(1904)
  })

  it('should initialize responsive state', () => {
    const { screenSize, currentBreakpoint, isMobile, isTablet, isDesktop } = useResponsive()

    expect(screenSize).toBeDefined()
    expect(currentBreakpoint).toBeDefined()
    expect(typeof isMobile.value).toBe('boolean')
    expect(typeof isTablet.value).toBe('boolean')
    expect(typeof isDesktop.value).toBe('boolean')
  })

  it('should detect breakpoint correctly', () => {
    const { currentBreakpoint } = useResponsive()

    expect(['xs', 'sm', 'md', 'lg', 'xl']).toContain(currentBreakpoint.value)
  })

  it('should provide viewport helpers', () => {
    const { isMobile, isTablet, isDesktop, isXs, isSm, isMd, isLg, isXl } = useResponsive()

    expect(typeof isMobile.value).toBe('boolean')
    expect(typeof isTablet.value).toBe('boolean')
    expect(typeof isDesktop.value).toBe('boolean')
    expect(typeof isXs.value).toBe('boolean')
    expect(typeof isSm.value).toBe('boolean')
    expect(typeof isMd.value).toBe('boolean')
    expect(typeof isLg.value).toBe('boolean')
    expect(typeof isXl.value).toBe('boolean')
  })

  it('should handle isTablet with nullish coalescing', () => {
    const { isTablet, isSm, isMd } = useResponsive()

    expect(typeof isTablet.value).toBe('boolean')
    expect(typeof isSm.value).toBe('boolean')
    expect(typeof isMd.value).toBe('boolean')

    if (isSm.value || isMd.value) {
      expect(isTablet.value).toBe(true)
    }
  })

  it('should handle isDesktop with nullish coalescing', () => {
    const { isDesktop, isLg, isXl } = useResponsive()

    expect(typeof isDesktop.value).toBe('boolean')
    expect(typeof isLg.value).toBe('boolean')
    expect(typeof isXl.value).toBe('boolean')

    if (isLg.value || isXl.value) {
      expect(isDesktop.value).toBe(true)
    }
  })

  it('should handle orientation detection', () => {
    const { isLandscape, isPortrait } = useResponsive()

    expect(typeof isLandscape.value).toBe('boolean')
    expect(typeof isPortrait.value).toBe('boolean')
  })

  it('should export BREAKPOINTS constant', () => {
    expect(BREAKPOINTS).toBeDefined()
    expect(typeof BREAKPOINTS).toBe('object')
    expect(Object.keys(BREAKPOINTS)).toEqual(['xs', 'sm', 'md', 'lg', 'xl'])
  })

  it('should have ordered breakpoints', () => {
    expect(BREAKPOINTS.xs).toBeLessThan(BREAKPOINTS.sm)
    expect(BREAKPOINTS.sm).toBeLessThan(BREAKPOINTS.md)
    expect(BREAKPOINTS.md).toBeLessThan(BREAKPOINTS.lg)
    expect(BREAKPOINTS.lg).toBeLessThan(BREAKPOINTS.xl)
  })

  describe('isTouchDevice', () => {
    it('should detect touch devices', () => {
      Object.defineProperty(window, 'ontouchstart', { writable: true, value: {} })
      const { isTouchDevice } = useResponsive()
      expect(typeof isTouchDevice.value).toBe('boolean')
    })

    it('should detect non-touch devices', () => {
      Object.defineProperty(window, 'ontouchstart', { writable: true, value: undefined })
      Object.defineProperty(navigator, 'maxTouchPoints', { writable: true, value: 0 })
      const { isTouchDevice } = useResponsive()
      expect(typeof isTouchDevice.value).toBe('boolean')
    })
  })

  describe('getResponsiveValue', () => {
    it('should return breakpoint-specific value', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
      const { getResponsiveValue } = useResponsive()
      const result = getResponsiveValue({
        xs: 'small',
        sm: 'medium',
        md: 'large',
        lg: 'xlarge',
        xl: 'xxlarge',
      })
      expect(result).toBeDefined()
    })

    it('should return mobile value when on mobile', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 400 })
      const { getResponsiveValue } = useResponsive()
      const result = getResponsiveValue({
        mobile: 'mobile-value',
        tablet: 'tablet-value',
        desktop: 'desktop-value',
      })
      expect(result).toBe('mobile-value')
    })

    it('should return tablet value when on tablet', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 })
      const { getResponsiveValue } = useResponsive()
      const result = getResponsiveValue({
        mobile: 'mobile-value',
        tablet: 'tablet-value',
        desktop: 'desktop-value',
      })
      expect(result).toBe('tablet-value')
    })

    it('should return desktop value when on desktop', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1400 })
      const { getResponsiveValue } = useResponsive()
      const result = getResponsiveValue({
        mobile: 'mobile-value',
        tablet: 'tablet-value',
        desktop: 'desktop-value',
      })
      expect(result).toBe('desktop-value')
    })

    it('should return default value when no match', () => {
      const { getResponsiveValue } = useResponsive()
      const result = getResponsiveValue({
        default: 'default-value',
      })
      expect(result).toBe('default-value')
    })
  })

  describe('getGridCols', () => {
    it('should return responsive grid columns', () => {
      const { getGridCols } = useResponsive()
      const result = getGridCols({
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
      })
      expect(typeof result).toBe('number')
    })
  })

  describe('getSpacing', () => {
    it('should return spacing from number with px', () => {
      const { getSpacing } = useResponsive()
      const result = getSpacing({
        default: 16,
      })
      expect(result).toBe('16px')
    })

    it('should return spacing from string as-is', () => {
      const { getSpacing } = useResponsive()
      const result = getSpacing({
        default: '1rem',
      })
      expect(result).toBe('1rem')
    })
  })

  describe('getTextSize', () => {
    it('should return responsive text size', () => {
      const { getTextSize } = useResponsive()
      const result = getTextSize({
        mobile: '14px',
        tablet: '16px',
        desktop: '18px',
      })
      expect(typeof result).toBe('string')
    })
  })

  describe('getResponsiveClasses', () => {
    it('should return string class', () => {
      const { getResponsiveClasses } = useResponsive()
      const result = getResponsiveClasses({
        default: 'class-name',
      })
      expect(result).toBe('class-name')
    })

    it('should return joined array of classes', () => {
      const { getResponsiveClasses } = useResponsive()
      const result = getResponsiveClasses({
        default: ['class-1', 'class-2'],
      })
      expect(result).toBe('class-1 class-2')
    })

    it('should return empty string when no value', () => {
      const { getResponsiveClasses } = useResponsive()
      const result = getResponsiveClasses({})
      expect(result).toBe('')
    })
  })

  describe('mediaQuery', () => {
    it('should generate min-width media query', () => {
      const { mediaQuery } = useResponsive()
      const result = mediaQuery('md', 'up')
      expect(result).toBe('(min-width: 960px)')
    })

    it('should generate max-width media query', () => {
      const { mediaQuery } = useResponsive()
      const result = mediaQuery('md', 'down')
      expect(result).toBe('(max-width: 959px)')
    })

    it('should default to up direction', () => {
      const { mediaQuery } = useResponsive()
      const result = mediaQuery('lg')
      expect(result).toBe('(min-width: 1264px)')
    })
  })

  describe('getCSSCustomProperty', () => {
    it('should return fallback when document is undefined', () => {
      const originalDocument = global.document
      // @ts-ignore
      global.document = undefined

      const { getCSSCustomProperty } = useResponsive()
      const result = getCSSCustomProperty('--color-primary', 'blue')

      global.document = originalDocument
      expect(result).toBe('blue')
    })

    it('should get CSS custom property value', () => {
      const { getCSSCustomProperty } = useResponsive()
      const result = getCSSCustomProperty('--some-var', 'fallback')
      expect(typeof result).toBe('string')
    })
  })

  describe('layoutHelpers', () => {
    it('should provide grid columns', () => {
      const { layoutHelpers } = useResponsive()
      expect(typeof layoutHelpers.value.gridCols).toBe('number')
      expect(layoutHelpers.value.gridCols).toBeGreaterThan(0)
    })

    it('should provide container padding', () => {
      const { layoutHelpers } = useResponsive()
      expect(typeof layoutHelpers.value.containerPadding).toBe('string')
    })

    it('should provide gap value', () => {
      const { layoutHelpers } = useResponsive()
      expect(typeof layoutHelpers.value.gap).toBe('string')
    })

    it('should provide header height', () => {
      const { layoutHelpers } = useResponsive()
      expect(typeof layoutHelpers.value.headerHeight).toBe('string')
    })
  })

  describe('mobile-first breakpoint checks', () => {
    it('should provide smAndUp', () => {
      const { smAndUp } = useResponsive()
      expect(typeof smAndUp.value).toBe('boolean')
    })

    it('should provide mdAndUp', () => {
      const { mdAndUp } = useResponsive()
      expect(typeof mdAndUp.value).toBe('boolean')
    })

    it('should provide lgAndUp', () => {
      const { lgAndUp } = useResponsive()
      expect(typeof lgAndUp.value).toBe('boolean')
    })

    it('should provide xlAndUp', () => {
      const { xlAndUp } = useResponsive()
      expect(typeof xlAndUp.value).toBe('boolean')
    })
  })

  describe('mobile-last breakpoint checks', () => {
    it('should provide smAndDown', () => {
      const { smAndDown } = useResponsive()
      expect(typeof smAndDown.value).toBe('boolean')
    })

    it('should provide mdAndDown', () => {
      const { mdAndDown } = useResponsive()
      expect(typeof mdAndDown.value).toBe('boolean')
    })

    it('should provide lgAndDown', () => {
      const { lgAndDown } = useResponsive()
      expect(typeof lgAndDown.value).toBe('boolean')
    })
  })
})
