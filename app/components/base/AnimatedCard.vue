<template>
  <v-card :class="cardClass" :width="width" :height="height" v-bind="$attrs">
    <v-card-text class="card-content">
      <div class="icon-container" :data-icon="iconDataAttr">
        <IconWrapper :icon="icon" :size="iconSize" />
      </div>

      <div class="card-details">
        <div class="card-title">
          {{ title }}
        </div>
        <div v-if="subtitle" class="card-subtitle">
          {{ subtitle }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  subtitle?: string
  icon: string
  iconDataAttr?: string
  width?: string | number
  height?: string | number
  iconSize?: string | number
  variant?: 'default' | 'elevated' | 'flat'
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  width: 180,
  height: 'auto',
  iconSize: 40,
  variant: 'default',
  iconDataAttr: '',
})

const cardClass = computed(() => {
  const classes = ['animated-card']
  if (props.variant === 'elevated') classes.push('animated-card--elevated')
  if (props.variant === 'flat') classes.push('animated-card--flat')
  return classes.join(' ')
})
</script>

<style scoped>
.animated-card {
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  background: rgba(30, 41, 59, 0.7) !important;
  border: 1px solid rgba(148, 163, 184, 0.1);
  flex: 0 0 auto;
}

.animated-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgb(96, 165, 250), transparent);
  transition: all 0.4s ease;
  z-index: 1;
}

.animated-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15));
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

.animated-card:hover::before {
  height: 4px;
  box-shadow: 0 0 20px currentColor;
}

.animated-card:hover::after {
  opacity: 1;
}

.animated-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 20px 40px rgba(59, 130, 246, 0.2),
    0 0 60px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  text-align: center;
}

.icon-container {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent);
  border-radius: 12px;
}

.icon-container::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 14px;
  background: radial-gradient(circle, transparent 30%, rgba(59, 130, 246, 0.15) 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.animated-card:hover .icon-container {
  transform: scale(1.2) rotate(5deg);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent);
}

.animated-card:hover .icon-container::before {
  opacity: 1;
  animation: iconGlow 2s ease-in-out infinite;
}

.icon-container :deep(.v-icon),
.icon-container :deep(svg),
.icon-container .custom-icon {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: filter 0.3s ease;
}

.animated-card:hover .icon-container :deep(.v-icon),
.animated-card:hover .icon-container :deep(svg),
.animated-card:hover .icon-container .custom-icon {
  filter: drop-shadow(0 4px 12px currentColor);
}

.card-details {
  width: 100%;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(241, 245, 249);
  transition: all 0.3s ease;
  position: relative;
}

.animated-card:hover .card-title {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: translateY(-2px);
}

.card-subtitle {
  font-size: 0.875rem;
  color: rgb(148, 163, 184);
  transition: color 0.3s ease;
  margin-top: 4px;
}

.animated-card:hover .card-subtitle {
  color: rgb(203, 213, 225);
}

@keyframes iconGlow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

/* Responsive */
@media (max-width: 960px) {
  .animated-card {
    min-width: 160px;
  }

  .icon-container {
    width: 56px;
    height: 56px;
  }
}

@media (max-width: 600px) {
  .animated-card {
    min-width: 140px;
  }

  .icon-container {
    width: 48px;
    height: 48px;
  }
}
</style>
