<template>
  <div class="d-flex justify-center justify-md-start mb-8 mb-md-10 mb-4">
    <v-row class="hero-mini-stats" style="max-width: 500px">
      <v-col v-for="(stat, index) in stats" :key="index" cols="4" class="text-center">
        <div class="stat-card">
          <div class="stat-value" :class="stat.gradientClass">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface HeroStat {
  value: string
  label: string
  gradientClass: string
}

const props = withDefaults(
  defineProps<{
    projectCount?: number
    certificationCount?: number
  }>(),
  {
    projectCount: 0,
    certificationCount: 0,
  }
)

const stats = computed<HeroStat[]>(() => [
  {
    value: '3+',
    label: 'Anos',
    gradientClass: 'text-gradient-vibrant',
  },
  {
    value: `${props.projectCount}+`,
    label: 'Projetos',
    gradientClass: 'text-gradient-cyan',
  },
  {
    value: `${props.certificationCount}+`,
    label: 'Certificações',
    gradientClass: 'text-gradient-purple',
  },
])
</script>

<style scoped>
.hero-mini-stats {
  animation: fadeInUp 1s ease 1.4s both;
  width: 100%;
  margin: 0;
}

.stat-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  padding: 16px 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  color: rgb(148, 163, 184);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

@media (max-width: 960px) {
  .stat-card {
    padding: 12px 8px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }
}

@media (max-width: 600px) {
  .stat-card {
    padding: 10px 6px;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }
}
</style>
