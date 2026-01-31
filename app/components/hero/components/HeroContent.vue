<template>
  <div class="hero-content" data-animate="fade-up">
    <!-- Status Badge -->
    <v-chip class="hero-badge mb-6 mb-md-8" variant="flat" size="default">
      <span class="status-dot" />
      <span class="ml-2">Disponível para novos projetos</span>
    </v-chip>

    <!-- Main Title -->
    <h1 class="hero-title mb-4 mb-md-6">
      <span class="title-greeting">Olá, eu sou</span>
      <span class="title-name text-gradient-vibrant">{{ name }}</span>
    </h1>

    <!-- Subtitle with Icon -->
    <div class="hero-subtitle-box mb-6 mb-md-8">
      <div class="d-inline-flex align-center ga-3 flex-wrap justify-center justify-md-start">
        <v-chip
          v-for="tag in tags"
          :key="tag.label"
          :color="tag.color"
          variant="flat"
          class="subtitle-chip high-contrast-chip"
        >
          <v-icon :icon="tag.icon" start size="20" />
          {{ tag.label }}
        </v-chip>
      </div>
    </div>

    <!-- Description -->
    <p class="hero-description text-body-1 text-md-h6 mb-8 mb-md-10 mx-auto mx-md-0">
      Resolvo problemas de infraestrutura com soluções automatizadas com
      <span class="text-highlight">CI/CD</span>, <span class="text-highlight">Kubernetes</span> e
      <span class="text-highlight">Cloud</span>.
    </p>

    <!-- CTA Buttons -->
    <div
      class="d-flex flex-column flex-sm-row align-center justify-center justify-md-start ga-4 mb-8 mb-md-12"
    >
      <v-btn
        size="x-large"
        color="primary"
        variant="flat"
        class="cta-btn-primary text-none rounded-xl px-10 font-weight-bold"
        elevation="8"
        @click="scrollToSection('contact')"
      >
        <v-icon icon="mdi-send" start />
        Entre em Contato
      </v-btn>

      <v-btn
        size="x-large"
        variant="outlined"
        color="primary"
        class="cta-btn-secondary text-none rounded-xl px-10 font-weight-bold"
        @click="scrollToSection('projects')"
      >
        <v-icon icon="mdi-briefcase-variant-outline" start />
        Ver Projetos
      </v-btn>
    </div>

    <!-- Mini Stats Slot -->
    <slot name="stats" />
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'

const { scrollToSection } = useNavigation()

interface Tag {
  label: string
  icon: string
  color: string
}

withDefaults(
  defineProps<{
    name?: string
    tags?: Tag[]
  }>(),
  {
    name: 'Henrique Zimermann',
    tags: () => [
      { label: 'DevOps', icon: 'mdi-infinity', color: 'primary' },
      { label: 'Cloud', icon: 'mdi-cloud-outline', color: 'blue-darken-2' },
      { label: 'Kubernetes', icon: 'mdi-kubernetes', color: 'blue-darken-2' },
    ],
  }
)
</script>

<style scoped>
/* Badge */
.hero-badge {
  background: rgba(59, 130, 246, 0.15) !important;
  border: 1px solid rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(10px);
  color: rgb(147, 197, 253) !important;
  font-weight: 600;
  padding: 10px 24px !important;
  height: auto !important;
  animation: fadeInUp 1s ease 0.2s both;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(34, 197, 94);
  animation: pulse 2s ease-in-out infinite;
}

/* Title */
.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  animation: fadeInUp 1s ease 0.4s both;
}

.title-greeting {
  color: rgb(203, 213, 225);
  font-weight: 500;
  font-size: 0.6em;
  display: block;
  margin-bottom: 8px;
}

.title-name {
  font-weight: 800;
}

/* Subtitle */
.hero-subtitle-box {
  animation: fadeInUp 1s ease 0.6s both;
}

.subtitle-chip {
  font-weight: 600 !important;
  padding: 10px 18px !important;
  height: auto !important;
}

.high-contrast-chip {
  color: #ffffff !important;
  background: linear-gradient(135deg, #1e40af, #1e3a8a) !important;
  border: 2px solid rgba(59, 130, 246, 0.3) !important;
}

/* Description */
.hero-description {
  color: rgb(203, 213, 225);
  max-width: 600px;
  line-height: 1.7;
  animation: fadeInUp 1s ease 0.8s both;
}

.text-highlight {
  color: rgb(147, 197, 253);
  font-weight: 600;
}

/* CTA Buttons */
.cta-btn-primary {
  background: linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235)) !important;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  animation: fadeInUp 1s ease 1s both;
}

.cta-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.6) !important;
}

.cta-btn-secondary {
  border-width: 2px !important;
  border-color: rgb(59, 130, 246) !important;
  color: rgb(147, 197, 253) !important;
  transition: all 0.3s ease !important;
  animation: fadeInUp 1s ease 1.2s both;
}

.cta-btn-secondary:hover {
  transform: translateY(-3px);
  background: rgba(59, 130, 246, 0.1) !important;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3) !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@media (max-width: 600px) {
  .hero-badge {
    padding: 8px 18px !important;
    font-size: 0.9rem;
  }
}
</style>
