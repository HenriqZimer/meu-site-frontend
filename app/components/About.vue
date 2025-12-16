<template>
  <Section
    id="about"
    badge="Sobre Mim"
    badge-icon="mdi-account-circle"
    badge-color="purple"
    title-prefix="Conhecendo minha"
    title-highlight="jornada"
    description="Uma trajetória em constante evolução no mundo da tecnologia"
    section-class="py-16 py-md-20"
  >
    <!-- Journey Timeline -->
    <div class="journey-timeline mb-16 mb-md-20">
      <v-row>
        <v-col
          v-for="(item, index) in storyItems"
          :key="index"
          cols="12"
          md="4"
          class="timeline-item"
          :data-animate="index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'"
          :data-delay="index * 150"
        >
          <FeatureCard
            :icon="item.icon"
            :title="item.title"
            :description="item.description"
            :color="item.color"
            :variant="item.variant"
            :animation-delay="index * 0.2"
          />
        </v-col>
      </v-row>

      <!-- Connecting Line -->
      <div class="timeline-line d-none d-md-block" />
    </div>

    <!-- Stats Section - Enhanced -->
    <div class="stats-showcase">
      <v-row>
        <v-col
          v-for="(stat, index) in stats"
          :key="index"
          cols="6"
          md="3"
          data-animate="zoom-in"
          :data-delay="index * 100"
        >
          <v-card
            class="stat-card elevation-4 text-center"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <v-card-text class="pa-6 pa-md-8">
              <!-- Icon -->
              <div class="stat-icon-wrapper mb-4">
                <v-icon :icon="stat.icon" size="40" :color="stat.color" />
              </div>

              <!-- Value with gradient -->
              <div
                class="stat-value text-h3 font-weight-bold mb-2"
                :class="`text-gradient-${stat.color}`"
              >
                {{ stat.value }}
              </div>

              <!-- Label -->
              <div class="stat-label text-body-2 font-weight-medium">
                {{ stat.label }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Values & Principles Section -->
    <div class="mt-16 mt-md-20">
      <div class="text-center mb-8 mb-md-12">
        <h3 class="text-h4 text-md-h3" style="color: rgb(241, 245, 249); font-weight: 900">
          O que me <span class="text-gradient-error">move</span>
        </h3>
        <p
          class="text-body-1 mt-4"
          style="color: rgb(148, 163, 184); max-width: 600px; margin-left: auto; margin-right: auto"
        >
          Princípios que guiam minha jornada profissional
        </p>
      </div>

      <v-row>
        <v-col
          v-for="(value, index) in valuesData"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          data-animate="fade-up"
          :data-delay="index * 120"
        >
          <FeatureCard
            :icon="value.icon"
            :title="value.title"
            :description="value.description"
            color="error"
            variant="value"
            :gradient="value.gradient"
            :icon-size="40"
            :animation-delay="index * 0.1"
            custom-class="value-card"
          />
        </v-col>
      </v-row>
    </div>
  </Section>
</template>

<script setup lang="ts">
import type { Stat } from '~/components/base/StatsGrid.vue'
import { useProjectsStore } from '~/stores/projects'
import { useCertificationsStore } from '~/stores/certifications'

interface StoryItem {
  icon: string
  title: string
  description: string
  color: string
  variant: string
}

// Stores
const projectsStore = useProjectsStore()
const certificationsStore = useCertificationsStore()

// Scroll Animation
const { observeElements } = useScrollAnimation()

onMounted(() => {
  // Fetch stats from backend
  projectsStore.fetchStats()
  certificationsStore.fetchStats()

  observeElements({
    threshold: 0.15,
    once: true,
  })

  // Adicionar observer para animações de scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate]')

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            const delay = element.getAttribute('data-delay')

            setTimeout(
              () => {
                element.classList.add('is-visible')
              },
              delay ? parseInt(delay) : 0
            )

            observer.unobserve(element)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    elements.forEach(el => observer.observe(el))
  }

  animateOnScroll()

  // Adicionar parallax suave nos cards ao mover o mouse
  const addCardParallax = () => {
    const cards = document.querySelectorAll('.stat-card, .feature-card, .value-card')

    cards.forEach(card => {
      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = mouseEvent.clientX - rect.left
        const y = mouseEvent.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -5
        const rotateY = ((x - centerX) / centerX) * 5

        ;(card as HTMLElement).style.transform =
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`
      })

      card.addEventListener('mouseleave', () => {
        ;(card as HTMLElement).style.transform = ''
      })
    })
  }

  setTimeout(addCardParallax, 1000)
})

// Story items
const storyItems: StoryItem[] = [
  {
    icon: 'mdi-history',
    title: 'Minha História',
    description:
      'Mais de 6 anos de experiência em atendimento ao público, onde desenvolvi habilidades essenciais como paciência, resolução de problemas e comunicação efetiva.',
    color: 'purple',
    variant: 'past',
  },
  {
    icon: 'mdi-cogs',
    title: 'Presente',
    description:
      'Atualmente focado em infraestrutura de TI, trabalhando com redes, ferramentas Microsoft, virtualização e automação. Apaixonado por soluções práticas.',
    color: 'primary',
    variant: 'present',
  },
  {
    icon: 'mdi-rocket-launch',
    title: 'Futuro',
    description:
      'Estudando DevOps intensivamente, explorando containers, automação e cloud computing para criar soluções mais inteligentes e eficientes.',
    color: 'cyan',
    variant: 'future',
  },
]

// Stats items - dynamic from stores
const stats = computed<Stat[]>(() => [
  {
    icon: 'mdi-briefcase',
    value: '3+',
    label: 'Anos de Experiência',
    color: 'primary',
  },
  {
    icon: 'mdi-code-braces',
    value: `${projectsStore.projectsCount}+`,
    label: 'Projetos Realizados',
    color: 'success',
  },
  {
    icon: 'mdi-certificate',
    value: `${certificationsStore.certificationsCount}+`,
    label: 'Certificações',
    color: 'warning',
  },
  {
    icon: 'mdi-rocket',
    value: '100%',
    label: 'Dedicação',
    color: 'error',
  },
])

const _values = [
  'Estudo Contínuo',
  'Qualidade',
  'Inovação',
  'Colaboração',
  'Performance',
  'Comprometimento',
]

const valuesData = [
  {
    title: 'Estudo Contínuo',
    description: 'Sempre em busca de novos conhecimentos e tecnologias para me manter atualizado',
    icon: 'mdi-school',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  },
  {
    title: 'Qualidade',
    description: 'Compromisso com a excelência em cada linha de código e processo implementado',
    icon: 'mdi-shield-check',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
  {
    title: 'Inovação',
    description: 'Busco soluções criativas e modernas para resolver problemas complexos',
    icon: 'mdi-rocket-launch',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
  },
  {
    title: 'Colaboração',
    description: 'Trabalho em equipe e comunicação efetiva são fundamentais para o sucesso',
    icon: 'mdi-account-group',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #3730a3 100%)',
  },
  {
    title: 'Performance',
    description: 'Otimização e eficiência são prioridades em todas as soluções que desenvolvo',
    icon: 'mdi-lightning-bolt',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #4338ca 100%)',
  },
  {
    title: 'Comprometimento',
    description: 'Dedicação total para entregar resultados que superem as expectativas',
    icon: 'mdi-target',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #312e81 100%)',
  },
]

const _getValueIcon = (value: string) => {
  const iconMap: Record<string, string> = {
    'Estudo Contínuo': 'mdi-school',
    Qualidade: 'mdi-shield-check',
    Inovação: 'mdi-rocket-launch',
    Colaboração: 'mdi-account-group',
    Performance: 'mdi-lightning-bolt',
    Comprometimento: 'mdi-target',
  }
  return iconMap[value] || 'mdi-circle'
}

const _getValueColor = (index: number) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  return colors[index % colors.length]
}
</script>

<style scoped>
/* ===================================
   ABOUT SECTION
   =================================== */
.about-section {
  position: relative;
  background: rgb(15, 23, 42);
  overflow: hidden;
}

.about-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
}

/* ===================================
   JOURNEY TIMELINE
   =================================== */
.journey-timeline {
  position: relative;
  padding: 40px 0;
}

.timeline-item {
  will-change: transform, opacity;
}

.timeline-item:nth-child(1) {
  transition-delay: 0ms;
}

.timeline-item:nth-child(2) {
  transition-delay: 150ms;
}

.timeline-item:nth-child(3) {
  transition-delay: 300ms;
}

.timeline-line {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 60%;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(168, 85, 247, 0.5),
    rgba(59, 130, 246, 0.5),
    rgba(6, 182, 212, 0.5)
  );
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-line::before,
.timeline-line::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgb(59, 130, 246);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}

.timeline-line::before {
  left: 0;
  transform: translateX(-50%);
}

.timeline-line::after {
  right: 0;
  transform: translateX(50%);
}

/* Cards agora usam FeatureCard component */

/* ===================================
   STATS SHOWCASE
   =================================== */
.stats-showcase {
  animation: fadeInUp 1s ease 0.4s both;
}

.stats-showcase [data-animate=\"zoom-in\"] {
  animation-fill-mode: both;
}

.stats-showcase .stat-card,
.journey-timeline .feature-card,
.value-card {
  transform-style: preserve-3d;
  transition: transform 0.3s ease-out !important;
}

.stat-card {
  background: rgba(30, 41, 59, 0.6) !important;
  backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 24px !important;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation:
    fadeInUp 0.6s ease both,
    breathe 4s ease-in-out infinite 1s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6);
  opacity: 0;
  transition: opacity 0.4s ease;
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.6);
}

.stat-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.5),
    rgba(6, 182, 212, 0.5),
    rgba(139, 92, 246, 0.5)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.stat-card:hover {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow:
    0 24px 48px rgba(59, 130, 246, 0.35),
    0 0 0 1px rgba(59, 130, 246, 0.3) !important;
  background: rgba(30, 41, 59, 0.8) !important;
  animation-play-state: paused;
}

.stat-card:hover::before {
  opacity: 1;
  animation: shimmerFlow 2s ease-in-out infinite;
}

.stat-card:hover::after {
  opacity: 1;
}

.stat-icon-wrapper {
  width: 70px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(30, 41, 59, 0.8);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.stat-icon-wrapper::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
  animation: spin 3s linear infinite;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.2) rotate(15deg);
  background: rgba(59, 130, 246, 0.2);
  box-shadow:
    0 8px 24px rgba(59, 130, 246, 0.4),
    inset 0 0 20px rgba(59, 130, 246, 0.15);
}

.stat-card:hover .stat-icon-wrapper::before {
  opacity: 1;
}

.stat-card:hover .stat-icon-wrapper .v-icon {
  animation: bounce 0.6s ease;
  filter: drop-shadow(0 0 8px currentColor);
}

.stat-value {
  line-height: 1;
}

.text-gradient-primary {
  background: linear-gradient(135deg, rgb(96, 165, 250), rgb(59, 130, 246));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-success {
  background: linear-gradient(135deg, rgb(74, 222, 128), rgb(34, 197, 94));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-warning {
  background: linear-gradient(135deg, rgb(251, 191, 36), rgb(245, 158, 11));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-error {
  background: linear-gradient(135deg, rgb(248, 113, 113), rgb(239, 68, 68));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  color: rgb(148, 163, 184);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Value cards customization */
.value-card {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.value-card:hover {
  border-color: rgba(239, 68, 68, 0.4);
  box-shadow: 0 24px 64px rgba(239, 68, 68, 0.3) !important;
  transform: translateY(-10px) scale(1.03);
}

.value-card:hover :deep(.feature-icon) {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 8px currentColor);
  }

  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 16px currentColor);
  }
}

@keyframes breathe {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-3px) scale(1.005);
  }
}

/* Animations moved to FeatureCard component */

/* ===================================
   ANIMATIONS
   =================================== */
@keyframes shimmerFlow {
  0% {
    background-position: 0% 50%;
    background-size: 200% 200%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-8px) scale(1.1);
  }
}

/* Scroll reveal animations */
[data-animate] {
  opacity: 0;
}

[data-animate='slide-in-left'] {
  transform: translateX(-60px);
  transition:
    opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-animate='slide-in-right'] {
  transform: translateX(60px);
  transition:
    opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-animate='zoom-in'] {
  transform: scale(0.8);
  transition:
    opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-animate='fade-up'] {
  transform: translateY(40px);
  transition:
    opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-animate].is-visible {
  opacity: 1;
  transform: translateX(0) translateY(0) scale(1) !important;
}

/* ===================================
   RESPONSIVE
   =================================== */
@media (max-width: 960px) {
  .timeline-line {
    display: none !important;
  }

  .journey-card {
    margin-bottom: 20px;
  }
}

@media (max-width: 600px) {
  .stat-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .stat-value {
    font-size: 2rem !important;
  }
}
</style>
