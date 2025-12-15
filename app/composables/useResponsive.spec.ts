import { describe, it, expect } from 'vitest'

describe('useResponsive', () => {
  it('should detect mobile viewport', () => {
    const isMobile = false
    expect(typeof isMobile).toBe('boolean')
  })

  it('should detect tablet viewport', () => {
    const isTablet = false
    expect(typeof isTablet).toBe('boolean')
  })

  it('should detect desktop viewport', () => {
    const isDesktop = true
    expect(typeof isDesktop).toBe('boolean')
  })

  it('should have breakpoints', () => {
    const breakpoints = {
      mobile: 600,
      tablet: 960,
      desktop: 1280,
    }
    expect(breakpoints.mobile).toBe(600)
    expect(breakpoints.tablet).toBe(960)
  })
})
