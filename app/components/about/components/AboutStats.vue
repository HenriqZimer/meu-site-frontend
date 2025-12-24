<template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import { useCertificationsStore } from '~/stores/certifications'
import type { Stat } from '~/components/base/StatsGrid.vue'

// Stores
const projectsStore = useProjectsStore()
const certificationsStore = useCertificationsStore()

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
</script>

<style scoped>
.stats-showcase {
  animation: fadeInUp 1s ease 0.4s both;
  margin-bottom: 64px;
}

.stats-showcase [data-animate='zoom-in'] {
  animation-fill-mode: both;
}

.stats-showcase .stat-card {
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

.stat-label {
  color: rgb(148, 163, 184);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

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

@keyframes breathe {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.005);
  }
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
