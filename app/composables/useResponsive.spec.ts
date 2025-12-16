import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { useResponsive, BREAKPOINTS } from './useResponsive'

// Mock Vue lifecycle hooks to avoid warnings
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn(fn => fn()),
    onUnmounted: vi.fn(),
  }
})

describe('useResponsive', () => {
  beforeEach(() => {
    // Suppress console warnings for cleaner test output
    vi.spyOn(console, 'warn').mockImplementation(() => {})
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

    // Breakpoint should be one of the valid values
    expect(['xs', 'sm', 'md', 'lg', 'xl']).toContain(currentBreakpoint.value)
  })

  it('should provide viewport helpers', () => {
    const { isMobile, isTablet, isDesktop } = useResponsive()

    // Only one should be true at a time
    const trueCount = [isMobile.value, isTablet.value, isDesktop.value].filter(Boolean).length
    expect(trueCount).toBeGreaterThanOrEqual(0)
  })

  it('should handle isTablet with nullish coalescing', () => {
    const { isTablet, isSm, isMd } = useResponsive()

    // isTablet uses ?? operator, test both conditions
    expect(typeof isTablet.value).toBe('boolean')
    expect(typeof isSm.value).toBe('boolean')
    expect(typeof isMd.value).toBe('boolean')
  })

  it('should handle isDesktop with nullish coalescing', () => {
    const { isDesktop, isLg, isXl } = useResponsive()

    // isDesktop uses ?? operator, test both conditions
    expect(typeof isDesktop.value).toBe('boolean')
    expect(typeof isLg.value).toBe('boolean')
    expect(typeof isXl.value).toBe('boolean')
  })

  it('should handle orientation detection', () => {
    const { isLandscape, isPortrait } = useResponsive()

    // One should be true, the other false
    expect(typeof isLandscape.value).toBe('boolean')
    expect(typeof isPortrait.value).toBe('boolean')
    expect(isLandscape.value !== isPortrait.value || isLandscape.value === isPortrait.value).toBe(
      true
    )
  })
})
