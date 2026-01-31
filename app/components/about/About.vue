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
    <AboutJourney />

    <!-- Stats Section -->
    <AboutStats />

    <!-- Values & Principles Section -->
    <AboutValues />
  </Section>
</template>

<script setup lang="ts">
import AboutJourney from './components/AboutJourney.vue'
import AboutStats from './components/AboutStats.vue'
import AboutValues from './components/AboutValues.vue'
import { useProjectsStore } from '~/stores/projects'
import { useCertificationsStore } from '~/stores/certifications'

const projectsStore = useProjectsStore()
const certificationsStore = useCertificationsStore()
const { observeElements } = useScrollAnimation()

onMounted(() => {
  projectsStore.fetchStats()
  certificationsStore.fetchStats()
  observeElements({ threshold: 0.15, once: true })

  const handleIntersection = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement
        const delay = element.getAttribute('data-delay')
        setTimeout(() => element.classList.add('is-visible'), delay ? parseInt(delay) : 0)
        observer.unobserve(element)
      }
    })
  }

  const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate]')
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px',
    })
    elements.forEach(el => observer.observe(el))
  }

  animateOnScroll()

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
</script>

<style scoped>
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
</style>
