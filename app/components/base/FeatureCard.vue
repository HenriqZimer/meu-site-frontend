<template>
  <v-card
    class="feature-card elevation-8 h-100"
    :class="[`card-${variant}`, customClass]"
    :style="{ animationDelay: `${animationDelay}s` }"
  >
    <v-card-text class="pa-8">
      <!-- Icon with glow -->
      <div class="feature-icon-wrapper mb-6">
        <div class="icon-bg" :class="`bg-${color}`" :style="gradientStyle" />
        <v-icon :icon="icon" :size="iconSize" :color="color" class="feature-icon" />
      </div>

      <!-- Content -->
      <h3 class="text-h5 font-weight-bold mb-4" style="color: rgb(241, 245, 249)">
        {{ title }}
      </h3>
      <p class="text-body-1" style="color: rgb(203, 213, 225); line-height: 1.7">
        {{ description }}
      </p>

      <!-- Decorative element -->
      <div class="card-decoration" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  color: string
  variant?: string
  gradient?: string
  iconSize?: number
  animationDelay?: number
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  gradient: '',
  iconSize: 48,
  animationDelay: 0,
  customClass: '',
})

const gradientStyle = computed(() => {
  if (props.gradient) {
    return { background: props.gradient }
  }
  return {}
})
</script>

<style scoped>
/* ===================================
   FEATURE CARD
   =================================== */
.feature-card {
  background: rgba(30, 41, 59, 0.6) !important;
  backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 24px !important;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeInUp 0.8s ease both;
  position: relative;
  overflow: hidden;
}

.feature-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(59, 130, 246, 0.15),
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.feature-card:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow:
    0 24px 64px rgba(59, 130, 246, 0.35),
    0 0 0 1px rgba(59, 130, 246, 0.2) !important;
  background: rgba(30, 41, 59, 0.8) !important;
}

.feature-card:hover::after {
  opacity: 1;
}

.feature-icon-wrapper {
  position: relative;
  display: inline-block;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feature-card:hover .feature-icon-wrapper {
  transform: scale(1.15) rotate(5deg);
}

.icon-bg {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(20px);
  animation: pulse 3s ease-in-out infinite;
  transition: all 0.5s ease;
}

.feature-card:hover .icon-bg {
  opacity: 0.4;
  inset: -15px;
  filter: blur(25px);
}

.bg-purple {
  background: rgb(168, 85, 247);
}

.bg-primary {
  background: rgb(59, 130, 246);
}

.bg-cyan {
  background: rgb(6, 182, 212);
}

.bg-success {
  background: rgb(34, 197, 94);
}

.bg-warning {
  background: rgb(245, 158, 11);
}

.bg-error {
  background: rgb(239, 68, 68);
}

.feature-icon {
  position: relative;
  z-index: 1;
  transition: all 0.4s ease;
}

.feature-card:hover .feature-icon {
  filter: drop-shadow(0 0 12px currentColor) brightness(1.2);
  animation: iconFloat 2s ease-in-out infinite;
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-5px);
  }
}

.card-decoration {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent);
  border-radius: 50%;
  pointer-events: none;
}

/* Card variants */
.card-past {
  border-top: 3px solid rgb(168, 85, 247);
}

.card-present {
  border-top: 3px solid rgb(59, 130, 246);
}

.card-future {
  border-top: 3px solid rgb(6, 182, 212);
}

.card-value {
  border-top: 3px solid transparent;
}

.card-value:hover {
  border-top-color: currentColor;
}

/* ===================================
   ANIMATIONS
   =================================== */
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
    opacity: 0.2;
    transform: scale(1);
  }

  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
}

/* ===================================
   RESPONSIVE
   =================================== */
@media (max-width: 600px) {
  .feature-icon-wrapper {
    width: 60px;
    height: 60px;
  }
}
</style>
