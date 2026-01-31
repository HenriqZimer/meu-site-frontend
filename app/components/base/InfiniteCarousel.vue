<template>
  <div class="carousel-container" :class="[containerClass, { 'full-width': fullWidth }]">
    <div class="carousel-wrapper" :class="wrapperClass">
      <div class="carousel-track" :class="trackClass" :style="trackStyle">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  duration?: number
  gap?: string
  pauseOnHover?: boolean
  containerClass?: string
  wrapperClass?: string
  trackClass?: string
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 120,
  gap: '24px',
  pauseOnHover: true,
  fullWidth: false,
  containerClass: '',
  wrapperClass: '',
  trackClass: '',
})

const trackStyle = computed(() => ({
  gap: props.gap,
  animationDuration: `${props.duration}s`,
  animationPlayState: 'running',
}))
</script>

<style scoped>
.carousel-container {
  position: relative;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
}

.carousel-container.full-width {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.carousel-wrapper {
  width: 100%;
  position: relative;
  padding: 40px 0;
  margin: -40px 0;
  overflow-x: hidden;
}

.carousel-track {
  display: inline-flex;
  animation: scroll 120s linear infinite;
  will-change: transform;
  flex-wrap: nowrap;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.carousel-track.pause-on-hover:hover {
  animation-play-state: paused;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - 12px));
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
</style>
