<template>
  <Section
    id="projects"
    badge="Projetos"
    badge-icon="mdi-briefcase-variant"
    badge-color="primary"
    title-prefix="Meus"
    title-highlight="Projetos"
    description="Alguns dos meus trabalhos recentes e soluções desenvolvidas"
    section-class="py-10 py-md-16"
    container-class="px-4 px-md-6"
  >
    <!-- Filtros -->
    <div
      class="d-flex flex-wrap justify-center ga-3 mb-10 mb-md-12"
      data-animate="fade-up"
      data-delay="400"
    >
      <v-chip
        v-for="filter in filters"
        :key="filter.value"
        :color="selectedFilter === filter.value ? 'primary' : 'default'"
        :variant="selectedFilter === filter.value ? 'flat' : 'outlined'"
        :class="{ 'filter-chip--active': selectedFilter === filter.value }"
        class="filter-chip"
        size="default"
        @click="setFilter(filter.value)"
      >
        <v-icon start size="18">{{ filter.icon }}</v-icon>
        {{ filter.label }}
        <v-badge
          v-if="filter.count > 0"
          :content="filter.count"
          :color="selectedFilter === filter.value ? 'white' : 'primary'"
          inline
          class="ml-2"
        />
      </v-chip>
    </div>

    <!-- Carrossel de Projetos -->
    <div class="position-relative">
      <div v-if="filteredProjects.length > 0" class="d-flex align-center ga-3 ga-md-4">
        <!-- Botão Anterior -->
        <v-btn
          icon
          class="carousel-nav flex-shrink-0"
          :disabled="currentPage === 0"
          aria-label="Projetos anteriores"
          size="large"
          elevation="2"
          @click="previousPage"
        >
          <v-icon icon="mdi-chevron-left" />
        </v-btn>

        <!-- Carrossel -->
        <div class="flex-grow-1 overflow-hidden carousel-wrapper">
          <div
            class="carousel-track d-flex"
            :style="{ transform: `translateX(-${currentPage * 100}%)` }"
          >
            <div
              v-for="(page, pageIndex) in paginatedProjects"
              :key="`page-${pageIndex}-${selectedFilter}-${_filterVersion}`"
              class="carousel-page"
            >
              <div class="carousel-grid">
                <div
                  v-for="(project, index) in page"
                  :key="project._id || project.id || index"
                  :data-animate="
                    index % 3 === 0 ? 'fade-up' : index % 3 === 1 ? 'zoom-in' : 'slide-in-up'
                  "
                  :data-delay="index * 150"
                  class="project-card-wrapper"
                >
                  <ProjectCard
                    :title="project.title"
                    :description="project.description"
                    :image="project.image"
                    :technologies="project.technologies"
                    :demo-url="project.demoUrl"
                    :github-url="project.githubUrl"
                    size="medium"
                    :lazy="pageIndex > 0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão Próximo -->
        <v-btn
          icon
          class="carousel-nav flex-shrink-0"
          :disabled="currentPage === totalPages - 1"
          aria-label="Próximos projetos"
          size="large"
          elevation="2"
          @click="nextPage"
        >
          <v-icon icon="mdi-chevron-right" />
        </v-btn>
      </div>

      <!-- Indicadores de Página -->
      <div v-if="totalPages > 1" class="d-flex justify-center align-center ga-2 mt-6">
        <button
          v-for="(page, index) in totalPages"
          :key="index"
          class="indicator"
          :class="{ 'indicator--active': currentPage === index }"
          :aria-label="`Ir para página ${index + 1}`"
          @click="goToPage(index)"
        ></button>
        <span class="text-body-2 ml-2" style="color: rgb(148, 163, 184)"
          >{{ currentPage + 1 }} / {{ totalPages }}</span
        >
      </div>

      <!-- Empty State -->
      <div v-if="filteredProjects.length === 0" class="text-center py-16">
        <v-icon size="64" class="mb-6" style="color: rgb(148, 163, 184); opacity: 0.5"
          >mdi-folder-open-outline</v-icon
        >
        <div class="text-h6 font-weight-medium mb-3" style="color: rgb(241, 245, 249)">
          Nenhum projeto encontrado
        </div>
        <p class="text-body-1" style="color: rgb(148, 163, 184); opacity: 0.8">
          Tente selecionar uma categoria diferente
        </p>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { PROJECT_FILTERS } from '~/constants'

// Scroll Animation
const { observeElements } = useScrollAnimation()

// Types
interface Project {
  _id?: string // MongoDB ID
  id?: number // ID opcional (legado)
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  demoUrl: string
  githubUrl: string
  featured?: boolean
  status?: string
}

interface Filter {
  value: string
  label: string
  icon: string
  count: number
}

// Store
const projectsStore = useProjectsStore()

// Reactive state
const selectedFilter = ref('all')
const _filterVersion = ref(0) // Usado para forçar recálculo

// Função para animar os cards - será chamada no mount e quando o filtro mudar
const animateProjectCards = () => {
  nextTick(() => {
    const elements = document.querySelectorAll('.project-card-wrapper[data-animate]')

    // Forçar visibilidade imediata para todos os cards no carrossel atual
    elements.forEach((el, index) => {
      const element = el as HTMLElement
      const delay = element.getAttribute('data-delay')

      setTimeout(
        () => {
          element.classList.add('is-visible')
        },
        delay ? parseInt(delay) : index * 100
      )
    })
  })
}

// Carregar projetos da API e inicializar animações
onMounted(async () => {
  await projectsStore.fetchProjects()

  // Atualizar itemsPerPage baseado na largura da tela
  updateItemsPerPage()

  // Registrar listener de resize
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateItemsPerPage)
  }

  // Inicializar scroll animations
  observeElements({
    threshold: 0.1,
    once: true,
  })

  // Animar cards iniciais
  setTimeout(animateProjectCards, 100)

  // Adicionar efeito parallax 3D nos project cards
  nextTick(() => {
    setTimeout(() => {
      const projectCards = document.querySelectorAll('.project-card-modern')

      projectCards.forEach(card => {
        card.addEventListener('mousemove', (e: Event) => {
          const mouseEvent = e as MouseEvent
          const element = card as HTMLElement
          const rect = element.getBoundingClientRect()
          const x = mouseEvent.clientX - rect.left
          const y = mouseEvent.clientY - rect.top

          const centerX = rect.width / 2
          const centerY = rect.height / 2

          const rotateXVal = ((y - centerY) / centerY) * -6
          const rotateYVal = ((x - centerX) / centerX) * 6

          element.style.transform =
            'perspective(1000px) rotateX(' +
            rotateXVal +
            'deg) rotateY(' +
            rotateYVal +
            'deg) translateY(-8px) scale(1.02)'
        })

        card.addEventListener('mouseleave', () => {
          ;(card as HTMLElement).style.transform = ''
        })
      })
    }, 300)
  })
})

// Computed do store
const projects = computed(() => projectsStore.allProjects)
// const loading = computed(() => projectsStore.loading)

// Other Technologies Data
// const otherTechnologies = [
//   {
//     name: 'Docker',
//     description: 'Containerização e deployment',
//     icon: 'mdi-docker',
//     color: '#0db7ed',
//     level: 85,
//   },
//   {
//     name: 'PostgreSQL',
//     description: 'Banco de dados relacional',
//     icon: 'mdi-database',
//     color: '#336791',
//     level: 80,
//   },
//   {
//     name: 'MongoDB',
//     description: 'Banco de dados NoSQL',
//     icon: 'mdi-leaf',
//     color: '#47A248',
//     level: 75,
//   },
//   {
//     name: 'Git',
//     description: 'Controle de versão',
//     icon: 'mdi-git',
//     color: '#F05032',
//     level: 90,
//   },
//   {
//     name: 'AWS',
//     description: 'Serviços de nuvem',
//     icon: 'mdi-aws',
//     color: '#FF9900',
//     level: 70,
//   },
//   {
//     name: 'Figma',
//     description: 'Design e prototipação',
//     icon: 'mdi-figma',
//     color: '#F24E1E',
//     level: 85,
//   },
// ]

// Computed filters with counts - using constants base
const filters = computed<Filter[]>(() =>
  PROJECT_FILTERS.map(filter => ({
    ...filter,
    count:
      filter.value === 'all'
        ? projects.value.length
        : projects.value.filter(p => p.category === filter.value).length,
  }))
)

// Computed filtered projects - usando função getter para garantir reatividade
const filteredProjects = computed(() => {
  // Incluir filterVersion para forçar recálculo
  // const version = filterVersion.value
  const allProjects = projects.value
  const currentFilter = selectedFilter.value

  // Retorna todos os projetos quando filtro é 'all' ou vazio
  if (!currentFilter || currentFilter === 'all') {
    const result = allProjects.slice() // Cria nova cópia do array
    return result
  }

  const filtered = allProjects.filter(project => project.category === currentFilter)
  return filtered
})

// Carousel state
const currentPage = ref(0)
const itemsPerPage = ref(3) // Valor default para desktop

// Update items per page based on window width - será chamado no onMounted
const updateItemsPerPage = () => {
  if (typeof window === 'undefined') return

  const width = window.innerWidth
  let newValue = 3 // Desktop default

  if (width <= 600) {
    newValue = 1 // Mobile: 1 card por página
  } else if (width <= 960) {
    newValue = 2 // Tablet: 2 cards por página
  }

  itemsPerPage.value = newValue
}

// Computed carousel - força recálculo a cada mudança
const paginatedProjects = computed(() => {
  const projectsList = filteredProjects.value
  const perPage = itemsPerPage.value
  const pages: Project[][] = []

  for (let i = 0; i < projectsList.length; i += perPage) {
    pages.push(projectsList.slice(i, i + perPage))
  }
  return pages
})

const totalPages = computed(() => paginatedProjects.value.length)

// Carousel methods
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// Reset page when filter changes and force recalculation
// watch(selectedFilter, newFilter => {
//   currentPage.value = 0

//   // Força o Vue a recalcular e depois anima os novos cards
//   nextTick(() => {
//     // Re-animar os cards após a mudança de filtro
//     animateProjectCards()
//   })
// })

// Reset page when itemsPerPage changes (ex: resize)
// watch(itemsPerPage, (newValue) => {
//   // Se a página atual ficou fora do range, voltar para a página 0
//   if (currentPage.value >= totalPages.value) {
//     currentPage.value = 0
//   }
// })

// Keyboard navigation
if (typeof window !== 'undefined') {
  const handleKeyboard = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      previousPage()
    } else if (event.key === 'ArrowRight') {
      nextPage()
    }
  }

  window.addEventListener('keydown', handleKeyboard)
}

// Methods
const setFilter = (value: string) => {
  selectedFilter.value = value
  _filterVersion.value++ // Força recálculo das computeds
}

// const scrollToContact = () => {
//   const element = document.getElementById('contact')
//   if (element) {
//     element.scrollIntoView({ behavior: 'smooth' })
//   }
// }

// Cleanup - remover listeners quando o componente for desmontado
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateItemsPerPage)
  }
})
</script>

<style scoped>
/* === FILTERS === */
.filter-chip {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px !important;
  backdrop-filter: blur(8px);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.filter-chip::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.filter-chip:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
}

.filter-chip:hover::before {
  opacity: 1;
}

.filter-chip--active {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

/* === CAROUSEL NAVIGATION === */
.carousel-nav {
  background: rgba(30, 41, 59, 0.8) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 48px !important;
  min-height: 48px !important;
}

.carousel-nav:not(:disabled):hover {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.2) !important;
  border-color: rgba(59, 130, 246, 0.4);
}

.carousel-nav:not(:disabled):active {
  transform: scale(1.05);
}

.carousel-nav:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

/* === CAROUSEL WRAPPER === */
.carousel-wrapper {
  position: relative;
  padding: 30px 0;
  margin: -30px 0;
}

.carousel-track {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.carousel-page {
  flex: 0 0 100%;
  min-width: 0;
}

.carousel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  gap: 24px;
  max-width: 100%;
  justify-items: center;
  place-items: center;
}

.carousel-grid > * {
  min-width: 0;
  width: 100%;
  max-width: 400px;
}

/* === CAROUSEL INDICATORS === */
.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.25);
  border: 2px solid rgba(148, 163, 184, 0.4);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  position: relative;
}

.indicator::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.indicator:hover {
  background: rgba(59, 130, 246, 0.6);
  border-color: rgba(59, 130, 246, 0.8);
  transform: scale(1.3);
}

.indicator:hover::before {
  opacity: 1;
}

.indicator--active {
  width: 32px;
  border-radius: 5px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
  animation: indicatorPulse 2s ease-in-out infinite;
}

/* === ANIMATIONS === */
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 6px 24px rgba(59, 130, 246, 0.4);
  }

  50% {
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.6);
  }
}

@keyframes indicatorPulse {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
    transform: scaleX(1);
  }

  50% {
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.7);
    transform: scaleX(1.05);
  }
}

/* Scroll Reveal Animations */
.project-card-wrapper {
  height: 100%;
}

.project-card-wrapper :deep(.project-card-modern) {
  transform-style: preserve-3d;
  will-change: transform;
  opacity: 1 !important;
}

.project-card-wrapper[data-animate] {
  opacity: 0;
}

.project-card-wrapper[data-animate='fade-up'] {
  transform: translateY(50px);
  transition:
    opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card-wrapper[data-animate='zoom-in'] {
  transform: scale(0.85);
  transition:
    opacity 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.project-card-wrapper[data-animate='slide-in-up'] {
  transform: translateY(60px) scale(0.95);
  transition:
    opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.project-card-wrapper[data-animate].is-visible {
  opacity: 1;
  transform: translateX(0) translateY(0) scale(1) !important;
}

/* Responsive */
@media (max-width: 960px) {
  .carousel-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .carousel-grid > * {
    max-width: 500px;
  }

  .carousel-nav {
    min-width: 40px !important;
    min-height: 40px !important;
    width: 40px !important;
    height: 40px !important;
  }

  .carousel-nav .v-icon {
    font-size: 20px !important;
  }
}

@media (max-width: 600px) {
  .carousel-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .carousel-nav {
    min-width: 36px !important;
    min-height: 36px !important;
    width: 36px !important;
    height: 36px !important;
  }

  .carousel-nav .v-icon {
    font-size: 18px !important;
  }

  .d-flex.align-center.ga-3.ga-md-4 {
    gap: 8px !important;
  }

  .indicator {
    width: 8px;
    height: 8px;
  }

  .indicator--active {
    width: 24px;
  }
}
</style>
