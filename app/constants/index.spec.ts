import { describe, it, expect } from 'vitest'

describe('Constants', () => {
  it('should export menu items', async () => {
    const { MENU_ITEMS } = await import('./index')
    
    expect(MENU_ITEMS).toBeDefined()
    expect(Array.isArray(MENU_ITEMS)).toBe(true)
    expect(MENU_ITEMS.length).toBeGreaterThan(0)
  })

  it('should have valid menu item structure', async () => {
    const { MENU_ITEMS } = await import('./index')
    
    MENU_ITEMS.forEach(item => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('icon')
      expect(typeof item.id).toBe('string')
      expect(typeof item.label).toBe('string')
    })
  })

  it('should export quick links', async () => {
    const { QUICK_LINKS } = await import('./index')
    
    expect(QUICK_LINKS).toBeDefined()
    expect(Array.isArray(QUICK_LINKS)).toBe(true)
  })

  it('should export scroll config', async () => {
    const { SCROLL_CONFIG } = await import('./index')
    
    expect(SCROLL_CONFIG).toBeDefined()
    expect(SCROLL_CONFIG.HEADER_OFFSET).toBeDefined()
  })
})
