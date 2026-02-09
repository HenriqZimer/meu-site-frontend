/**
 * Constantes centralizadas do projeto
 * Todas as strings, URLs e configurações reutilizáveis
 */

// ===== MENU ITEMS =====
export const MENU_ITEMS = [
  { id: 'about', label: 'Sobre', icon: 'mdi-account-circle' },
  { id: 'projects', label: 'Projetos', icon: 'mdi-briefcase-variant' },
  { id: 'skills', label: 'Skills', icon: 'mdi-brain' },
  { id: 'certifications', label: 'Certificações', icon: 'mdi-certificate' },
  { id: 'courses', label: 'Cursos', icon: 'mdi-school' },
] as const

// ===== QUICK LINKS (FOOTER) =====
export const QUICK_LINKS = [
  { label: 'Sobre', href: 'about' },
  { label: 'Skills', href: 'skills' },
  { label: 'Projetos', href: 'projects' },
  { label: 'Cursos', href: 'courses' },
  { label: 'Certificações', href: 'certifications' },
  { label: 'Contato', href: 'contact' },
] as const

// ===== SCROLL CONSTANTS =====
export const SCROLL_CONFIG = {
  HEADER_OFFSET: 80,
  SHOW_SCROLL_TOP_THRESHOLD: 400,
  SCROLL_THRESHOLD: 20,
} as const

// ===== ANIMATION DELAYS =====
export const ANIMATION_DELAYS = {
  BADGE: 100,
  TITLE: 200,
  DESCRIPTION: 300,
  CONTENT: 400,
  STATS: 500,
  EXTRA: 600,
} as const

// ===== RESPONSIVE GRID LAYOUTS =====
export const GRID_LAYOUTS = {
  STATS: {
    cols: 6,
    sm: 3,
  },
  CERTIFICATIONS: {
    md: 6,
    lg: 6,
  },
  TWO_COLUMNS: {
    md: 6,
    lg: 6,
  },
} as const

// ===== CAROUSEL CONFIG =====
export const CAROUSEL_CONFIG = {
  ITEMS_PER_PAGE_DESKTOP: 3,
  ITEMS_PER_PAGE_TABLET: 2,
  ITEMS_PER_PAGE_MOBILE: 1,
} as const

// ===== IMAGE URLS =====
// TODO: Migrar para S3 após configurar domínio imagens.henriqzimer.com.br
export const IMAGE_URLS = {
  LOGO: 'https://imagens.henriqzimer.com.br/logo.png',
  PROFILE_PHOTO: 'https://imagens.henriqzimer.com.br/foto-perfil-profissional.jpg',
} as const

// ===== EXTERNAL URLS =====
export const getExternalUrls = (config: any) => ({
  GITHUB: config.public.githubUrl,
  LINKEDIN: config.public.linkedinUrl,
  EMAIL: `mailto:${config.public.email}`,
  WHATSAPP: `https://wa.me/5547992606276?text=Estou%20entrando%20em%20contato%20pelo%20seu%20site`,
})

// ===== TECHNOLOGY ICONS & CATEGORIES =====
export const TECH_CATEGORIES = {
  INFRASTRUCTURE: 'Infraestrutura',
  CONTAINERIZATION: 'Containerização',
  IAC: 'IaC',
  CLOUD: 'Cloud Provider',
  ORCHESTRATION: 'Orquestração',
  MONITORING: 'Monitoring',
  DATABASE: 'Database',
  CACHE: 'Cache',
  VERSION_CONTROL: 'Version Control',
  OS: 'Operating System',
} as const

// ===== SOCIAL LINKS BUILDER =====
export const buildSocialLinks = (config: any) => [
  {
    name: 'GitHub',
    icon: 'mdi-github',
    url: config.public.githubUrl,
    label: 'Visitar GitHub',
  },
  {
    name: 'LinkedIn',
    icon: 'mdi-linkedin',
    url: config.public.linkedinUrl,
    label: 'Visitar LinkedIn',
  },
  {
    name: 'Email',
    icon: 'mdi-email-outline',
    url: `mailto:${config.public.email}`,
    label: 'Enviar email',
  },
]

// ===== FOOTER SOCIAL LINKS =====
export const buildFooterSocialLinks = (config: any) => [
  { name: 'GitHub', icon: 'mdi-github', href: config.public.githubUrl },
  { name: 'LinkedIn', icon: 'mdi-linkedin', href: config.public.linkedinUrl },
  {
    name: 'Email',
    icon: 'mdi-email-outline',
    href: `mailto:${config.public.email}`,
  },
]

// ===== FILTER CONFIG =====
export const PROJECT_FILTERS = [
  { value: 'all', label: 'Todos', icon: 'mdi-apps' },
  { value: 'infrastructure', label: 'Infraestrutura', icon: 'mdi-server' },
  { value: 'containerization', label: 'Containers', icon: 'mdi-docker' },
  { value: 'automation', label: 'Automação', icon: 'mdi-robot' },
  { value: 'cloud', label: 'Cloud', icon: 'mdi-cloud' },
] as const

// ===== BUTTON TYPES =====
export const BUTTON_TYPES = {
  PRIMARY: {
    variant: 'flat',
    color: 'primary',
  },
  SECONDARY: {
    variant: 'outlined',
    color: 'primary',
  },
  SOCIAL: {
    variant: 'outlined',
    color: 'primary',
  },
} as const
