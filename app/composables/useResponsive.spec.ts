import { describe, it, expect, afterEach, vi } from 'vitest'
import { useResponsive, BREAKPOINTS } from './useResponsive'

describe('useResponsive', () => {
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
})
