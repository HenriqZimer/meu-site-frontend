<template>
  <div
    :class="centered ? 'text-center' : 'text-left'"
    class="mb-10 mb-md-12"
    data-animate="fade-up"
  >
    <!-- Badge -->
    <v-chip
      v-if="badge"
      class="section-badge mb-4 mb-md-6"
      size="default"
      variant="flat"
      :style="badgeStyle"
      data-animate="fade-in"
      :data-delay="animationDelays.badge"
    >
      <v-icon v-if="icon" :icon="icon" start size="20" class="badge-icon" />
      <span class="badge-text">{{ badge }}</span>
    </v-chip>

    <!-- Title -->
    <h2
      class="text-h4 text-md-h3 mb-3 mb-md-4"
      style="
        color: rgb(241, 245, 249);
        letter-spacing: -0.025em;
        line-height: 1.2;
        font-weight: 900;
      "
      data-animate="fade-up"
      :data-delay="animationDelays.title"
    >
      <slot name="title">
        {{ titlePrefix }}
        <span class="text-gradient-primary d-inline-block">{{ titleHighlight }}</span>
      </slot>
    </h2>

    <!-- Description -->
    <p
      v-if="description || $slots.description"
      class="text-body-1 mx-auto"
      style="color: rgb(203, 213, 225); max-width: 600px; line-height: 1.6"
      data-animate="fade-up"
      :data-delay="animationDelays.description"
    >
      <slot name="description">{{ description }}</slot>
    </p>

    <!-- Slot para conteúdo adicional (ex: stats, progress bar) -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ANIMATION_DELAYS } from '~/constants'

interface Props {
  badge?: string
  icon?: string
  badgeColor?: string
  titlePrefix?: string
  titleHighlight?: string
  description?: string
  centered?: boolean
  theme?: 'default' | 'primary'
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  badge: '',
  icon: '',
  badgeColor: 'primary',
  titlePrefix: '',
  titleHighlight: '',
  description: '',
  centered: true,
  theme: 'default',
  customClass: '',
})

// Mapa de cores para os badges
const badgeColors: Record<string, { bg: string; color: string; border: string }> = {
  primary: {
    bg: 'rgba(59, 130, 246, 0.15)',
    color: 'rgb(147, 197, 253)',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  success: {
    bg: 'rgba(34, 197, 94, 0.15)',
    color: 'rgb(134, 239, 172)',
    border: 'rgba(34, 197, 94, 0.3)',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.15)',
    color: 'rgb(253, 224, 71)',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  error: {
    bg: 'rgba(239, 68, 68, 0.15)',
    color: 'rgb(252, 165, 165)',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  purple: {
    bg: 'rgba(168, 85, 247, 0.15)',
    color: 'rgb(216, 180, 254)',
    border: 'rgba(168, 85, 247, 0.3)',
  },
  cyan: {
    bg: 'rgba(6, 182, 212, 0.15)',
    color: 'rgb(103, 232, 249)',
    border: 'rgba(6, 182, 212, 0.3)',
  },
}

const badgeStyle = computed(() => {
  const colors = badgeColors[props.badgeColor] || badgeColors.primary
  if (!colors) {
    return {
      background: 'rgba(59, 130, 246, 0.15) !important',
      color: 'rgb(147, 197, 253) !important',
      borderColor: 'rgba(59, 130, 246, 0.3)',
    }
  }
  return {
    background: `${colors.bg} !important`,
    color: `${colors.color} !important`,
    borderColor: colors.border,
  }
})

const animationDelays = {
  badge: ANIMATION_DELAYS.BADGE,
  title: ANIMATION_DELAYS.TITLE,
  description: ANIMATION_DELAYS.DESCRIPTION,
}
</script>

<style scoped>
/* ===================================
   SECTION BADGE
   =================================== */
.section-badge {
  border: 1px solid;
  padding: 10px 20px !important;
  height: auto !important;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  font-size: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}

.section-badge:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.badge-icon {
  transition: transform 0.3s ease;
}

.section-badge:hover .badge-icon {
  transform: scale(1.1) rotate(-10deg);
}

.badge-text {
  font-weight: 600;
}
</style>
