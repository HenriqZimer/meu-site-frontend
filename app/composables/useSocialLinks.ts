/**
 * Composable para social links
 * Centraliza configuração de redes sociais
 * Usado em: Hero, Footer, Contact
 */

export const useSocialLinks = () => {
  /**
   * Links sociais completos (com label para aria)
   */
  const socialLinks = [
    {
      name: 'GitHub',
      icon: 'mdi-github',
      url: 'https://github.com/henriqzimer',
      label: 'Visitar GitHub',
    },
    {
      name: 'LinkedIn',
      icon: 'mdi-linkedin',
      url: 'https://linkedin.com/in/henrique-zimermann',
      label: 'Visitar LinkedIn',
    },
    {
      name: 'Email',
      icon: 'mdi-email-outline',
      url: 'mailto:contato@henriqzimer.com.br',
      label: 'Enviar email',
    },
  ]

  /**
   * Links sociais para footer (com labels para acessibilidade)
   */
  const footerSocialLinks = [
    {
      name: 'GitHub',
      icon: 'mdi-github',
      href: 'https://github.com/henriqzimer',
      label: 'Visitar GitHub',
    },
    {
      name: 'LinkedIn',
      icon: 'mdi-linkedin',
      href: 'https://linkedin.com/in/henrique-zimermann',
      label: 'Visitar LinkedIn',
    },
    {
      name: 'Email',
      icon: 'mdi-email-outline',
      href: 'mailto:contato@henriqzimer.com.br',
      label: 'Enviar email',
    },
  ]

  /**
   * Informações de contato
   */
  const contactInfo = {
    email: 'contato@henriqzimer.com.br',
    phone: '+55 (47) 99260-6276',
    location: 'Balneário Piçarras - Santa Catarina, Brasil',
    whatsapp:
      'https://wa.me/5547992606276?text=Estou%20entrando%20em%20contato%20pelo%20seu%20site',
  }

  return {
    socialLinks,
    footerSocialLinks,
    contactInfo,
  }
}
