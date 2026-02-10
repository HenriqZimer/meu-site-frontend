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

  describe('getExternalUrls', () => {
    it('should build external URLs from config', async () => {
      const { getExternalUrls } = await import('./index')
      const mockConfig = {
        public: {
          githubUrl: 'https://github.com/test',
          linkedinUrl: 'https://linkedin.com/in/test',
          email: 'test@example.com',
        },
      }

      const urls = getExternalUrls(mockConfig)

      expect(urls.GITHUB).toBe('https://github.com/test')
      expect(urls.LINKEDIN).toBe('https://linkedin.com/in/test')
      expect(urls.EMAIL).toBe('mailto:test@example.com')
      expect(urls.WHATSAPP).toContain('https://wa.me/')
    })
  })

  describe('buildSocialLinks', () => {
    it('should build social links array from config', async () => {
      const { buildSocialLinks } = await import('./index')
      const mockConfig = {
        public: {
          githubUrl: 'https://github.com/test',
          linkedinUrl: 'https://linkedin.com/in/test',
          email: 'test@example.com',
        },
      }

      const links = buildSocialLinks(mockConfig)

      expect(Array.isArray(links)).toBe(true)
      expect(links).toHaveLength(3)

      const github = links[0]
      expect(github.name).toBe('GitHub')
      expect(github.icon).toBe('mdi-github')
      expect(github.url).toBe('https://github.com/test')
      expect(github.label).toBe('Visitar GitHub')

      const linkedin = links[1]
      expect(linkedin.name).toBe('LinkedIn')
      expect(linkedin.icon).toBe('mdi-linkedin')
      expect(linkedin.url).toBe('https://linkedin.com/in/test')

      const email = links[2]
      expect(email.name).toBe('Email')
      expect(email.icon).toBe('mdi-email-outline')
      expect(email.url).toBe('mailto:test@example.com')
    })
  })

  describe('buildFooterSocialLinks', () => {
    it('should build footer social links array from config', async () => {
      const { buildFooterSocialLinks } = await import('./index')
      const mockConfig = {
        public: {
          githubUrl: 'https://github.com/test',
          linkedinUrl: 'https://linkedin.com/in/test',
          email: 'test@example.com',
        },
      }

      const links = buildFooterSocialLinks(mockConfig)

      expect(Array.isArray(links)).toBe(true)
      expect(links).toHaveLength(3)

      expect(links[0].name).toBe('GitHub')
      expect(links[0].icon).toBe('mdi-github')
      expect(links[0].href).toBe('https://github.com/test')

      expect(links[1].name).toBe('LinkedIn')
      expect(links[1].icon).toBe('mdi-linkedin')
      expect(links[1].href).toBe('https://linkedin.com/in/test')

      expect(links[2].name).toBe('Email')
      expect(links[2].icon).toBe('mdi-email-outline')
      expect(links[2].href).toBe('mailto:test@example.com')
    })
  })

  it('should export tech categories', async () => {
    const { TECH_CATEGORIES } = await import('./index')

    expect(TECH_CATEGORIES).toBeDefined()
    expect(TECH_CATEGORIES.INFRASTRUCTURE).toBe('Infraestrutura')
    expect(TECH_CATEGORIES.CLOUD).toBe('Cloud Provider')
  })

  it('should export animation delays', async () => {
    const { ANIMATION_DELAYS } = await import('./index')

    expect(ANIMATION_DELAYS).toBeDefined()
    expect(typeof ANIMATION_DELAYS.BADGE).toBe('number')
    expect(typeof ANIMATION_DELAYS.TITLE).toBe('number')
  })

  it('should export grid layouts', async () => {
    const { GRID_LAYOUTS } = await import('./index')

    expect(GRID_LAYOUTS).toBeDefined()
    expect(GRID_LAYOUTS.STATS).toBeDefined()
    expect(GRID_LAYOUTS.CERTIFICATIONS).toBeDefined()
  })

  it('should export carousel config', async () => {
    const { CAROUSEL_CONFIG } = await import('./index')

    expect(CAROUSEL_CONFIG).toBeDefined()
    expect(CAROUSEL_CONFIG.ITEMS_PER_PAGE_DESKTOP).toBe(3)
    expect(CAROUSEL_CONFIG.ITEMS_PER_PAGE_TABLET).toBe(2)
    expect(CAROUSEL_CONFIG.ITEMS_PER_PAGE_MOBILE).toBe(1)
  })

  it('should export image URLs', async () => {
    const { IMAGE_URLS } = await import('./index')

    expect(IMAGE_URLS).toBeDefined()
    expect(IMAGE_URLS.LOGO).toContain('https://')
    expect(IMAGE_URLS.PROFILE_PHOTO).toContain('https://')
  })

  it('should export project filters', async () => {
    const { PROJECT_FILTERS } = await import('./index')

    expect(PROJECT_FILTERS).toBeDefined()
    expect(Array.isArray(PROJECT_FILTERS)).toBe(true)
    expect(PROJECT_FILTERS.length).toBeGreaterThan(0)
  })

  it('should export button types', async () => {
    const { BUTTON_TYPES } = await import('./index')

    expect(BUTTON_TYPES).toBeDefined()
    expect(BUTTON_TYPES.PRIMARY).toBeDefined()
    expect(BUTTON_TYPES.SECONDARY).toBeDefined()
    expect(BUTTON_TYPES.SOCIAL).toBeDefined()
  })
})
