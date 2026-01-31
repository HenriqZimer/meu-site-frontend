/**
 * Composable para navegação e scroll
 * Centraliza toda lógica de scroll suave e navegação entre seções
 * Usado em: Header, Footer, Hero, Portfolio
 */

import { SCROLL_CONFIG } from '~/constants'

export const useNavigation = () => {
  /**
   * Scroll suave para uma seção específica
   * @param id - ID da seção (sem #)
   */
  const scrollToSection = (id: string) => {
    // Caso especial: home/topo
    if (id === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      return
    }

    const element = document.getElementById(id)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - SCROLL_CONFIG.HEADER_OFFSET

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  /**
   * Scroll para o topo da página
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /**
   * Verifica se a página foi scrollada além do threshold
   */
  const isPageScrolled = (threshold: number = SCROLL_CONFIG.SCROLL_THRESHOLD) => {
    return window.scrollY > threshold
  }

  /**
   * Verifica se deve mostrar o botão de scroll to top
   */
  const shouldShowScrollTop = () => {
    return window.scrollY > SCROLL_CONFIG.SHOW_SCROLL_TOP_THRESHOLD
  }

  /**
   * Obtém a seção ativa baseada na posição do scroll
   * @param sections - Array de IDs das seções
   */
  const getActiveSection = (sections: string[]) => {
    let activeSection = 'home'

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (element) {
        const rect = element.getBoundingClientRect()
        // Seção está visível na viewport (com offset do header)
        if (
          rect.top <= SCROLL_CONFIG.HEADER_OFFSET + 100 &&
          rect.bottom >= SCROLL_CONFIG.HEADER_OFFSET + 100
        ) {
          activeSection = sectionId
        }
      }
    }

    return activeSection
  }

  return {
    scrollToSection,
    scrollToTop,
    isPageScrolled,
    shouldShowScrollTop,
    getActiveSection,
  }
}
