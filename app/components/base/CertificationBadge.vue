<template>
  <a :href="link" target="_blank" rel="noopener noreferrer" class="certification-card" :aria-label="`Ver certificado ${name}`"
    @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
    <!-- Left Border Indicator -->
    <div class="card-border-indicator" />

    <!-- Image Container -->
    <div class="image-container">
      <div class="image-wrapper">
        <img :src="image" :alt="name" :loading="lazy ? 'lazy' : 'eager'" class="certification-image" />
      </div>
    </div>

    <!-- Content -->
    <div class="card-content">
      <div class="card-header">
        <h3 class="certification-name">{{ name }}</h3>
        <p class="certification-issuer">
          <v-icon icon="mdi-school-outline" size="14" />
          {{ issuer }}
        </p>
      </div>

      <div v-if="date || skills" class="card-meta">
        <span v-if="date" class="meta-item">
          <v-icon icon="mdi-calendar-check" size="14" />
          {{ date }}
        </span>
        <span v-if="skills" class="meta-item">
          <v-icon icon="mdi-star-circle" size="14" />
          {{ skills }} habilidades
        </span>
      </div>


    </div>

    <!-- Action Icon -->
    <div class="card-action">
      <v-icon icon="mdi-open-in-new" size="20" class="external-icon" color="primary" />
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  name: string
  issuer: string
  image: string
  link: string
  date?: string
  skills?: number
  lazy?: boolean
}

// const props = withDefaults(defineProps<Props>(), {
//   lazy: true,
//   date: '',
//   skills: 0
// })

const cardRef = ref<HTMLElement | null>(null)

const handleMouseEnter = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  cardRef.value = card
}

const handleMouseLeave = () => {
  if (cardRef.value) {
    cardRef.value.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
    cardRef.value.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
  cardRef.value = null
}

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return

  const card = cardRef.value
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Cálculo relativo ao centro (igual ao CredlyBadge)
  const rotateX = ((y - centerY) / centerY) * -10
  const rotateY = ((x - centerX) / centerX) * 10

  // Transform com perspective e scale igual ao CredlyBadge
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
  card.style.transition = 'transform 0.1s ease-out'
}
</script>

<style scoped>
.certification-card {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
  will-change: transform;
  width: 100%;
  height: 100%;
}

.certification-card:hover {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.certification-card:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Left Border Indicator */
.card-border-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg,
      rgb(var(--v-theme-success)),
      color-mix(in srgb, rgb(var(--v-theme-success)) 70%, black));
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.certification-card:hover .card-border-indicator {
  transform: scaleY(1);
}

/* Image Container */
.image-container {
  position: relative;
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 232px;
}

.image-wrapper {
  width: 100%;
  max-width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.certification-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.certification-card:hover .image-wrapper {
  transform: scale(1.05);
}

.certification-card:hover .certification-image {
  transform: scale(1.1);
}

/* Card Content */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px 16px 16px;
  min-height: 120px;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  text-align: center;
}

.certification-name {
  font-size: 16px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.4;
  margin: 0;
  transition: color 0.3s ease;
}

.certification-card:hover .certification-name {
  color: rgb(var(--v-theme-primary));
}

.certification-issuer {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin: 0;
}

/* Meta Information */
.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Badge */
.card-badge {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.status-chip {
  font-size: 11px;
  font-weight: 600;
  height: 24px !important;
  padding: 0 10px !important;
}

/* Action Icon */
.card-action {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.external-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.certification-card:hover .card-action {
  background: rgba(var(--v-theme-primary), 0.2);
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 960px) {
  .image-container {
    padding: 14px;
    min-height: 208px;
  }

  .image-wrapper {
    max-width: 180px;
    height: 180px;
  }

  .card-content {
    padding: 0 14px 14px 14px;
  }

  .card-action {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 600px) {
  .image-container {
    padding: 12px;
    min-height: 184px;
  }

  .image-wrapper {
    max-width: 160px;
    height: 160px;
  }

  .card-content {
    padding: 0 12px 12px 12px;
    gap: 10px;
  }

  .card-meta {
    gap: 8px;
  }

  .card-action {
    display: none;
  }
}
</style>
