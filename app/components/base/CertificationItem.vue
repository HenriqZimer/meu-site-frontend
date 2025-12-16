<template>
  <article :class="itemClasses" :style="itemStyles" role="listitem">
    <div class="certification-item-inner">
      <!-- Avatar/Icon -->
      <div class="certification-avatar">
        <v-avatar v-if="certification.image" :size="avatarSize" class="certification-avatar-img">
          <v-img
            :src="certification.image"
            :alt="`Logo da certificação ${certification.name}`"
            :loading="index > 2 ? 'lazy' : 'eager'"
            transition="fade-transition"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon :color="certification.color || 'primary'" size="large">
                  mdi-certificate
                </v-icon>
              </div>
            </template>
          </v-img>
        </v-avatar>

        <div v-else class="certification-icon-wrapper">
          <v-icon :color="certification.color || 'primary'" :size="iconSize">
            {{ certification.icon || 'mdi-certificate' }}
          </v-icon>
        </div>
      </div>

      <!-- Content -->
      <div class="certification-content">
        <h4 class="certification-title">
          {{ certification.name }}
        </h4>

        <p class="certification-issuer">
          {{ certification.issuer }}
        </p>
      </div>

      <!-- Action Button -->
      <div class="certification-action">
        <v-btn
          :href="certification.link"
          target="_blank"
          :icon="actionIcon"
          :size="buttonSize"
          variant="outlined"
          color="primary"
          class="certification-action-btn"
          :aria-label="`Abrir ${
            type === 'obtained' ? 'certificação' : 'informações da certificação'
          } ${certification.name} em nova aba`"
        />
      </div>

      <!-- Decorative Element -->
      <div class="certification-decoration" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Types
interface Certification {
  name: string
  issuer: string
  icon?: string
  color?: string
  image?: string
  link: string
}

// Props
interface Props {
  certification: Certification
  index: number
  animationDelay: number
  type: 'obtained' | 'planned'
}

const props = defineProps<Props>()

// Composables
const { isMobile, isTablet, getResponsiveValue } = useResponsive()

// Computed properties
const itemClasses = computed(() => [
  'modern-certification-item',
  {
    'certification-item--mobile': isMobile.value,
    'certification-item--tablet': isTablet.value,
    'certification-item--obtained': props.type === 'obtained',
    'certification-item--planned': props.type === 'planned',
  },
])

const itemStyles = computed(() => ({
  '--animation-delay': `${props.animationDelay}ms`,
  '--item-color': `var(--v-theme-${props.type === 'obtained' ? 'primary' : 'primary'})`,
}))

// const titleClasses = computed(() => [
//   "font-weight-bold",
//   "mb-2",
//   getResponsiveValue({
//     mobile: "text-body-1",
//     tablet: "text-h6",
//     desktop: "text-h6",
//   }),
// ]);

// const subtitleClasses = computed(() => [
//   "font-weight-medium",
//   getResponsiveValue({
//     mobile: "text-body-2",
//     tablet: "text-body-1",
//     desktop: "text-body-1",
//   }),
// ]);

const avatarSize = computed(() =>
  getResponsiveValue({
    mobile: 48,
    tablet: 56,
    desktop: 56,
  })
)

const iconSize = computed(() =>
  getResponsiveValue({
    mobile: 'large',
    tablet: 'x-large',
    desktop: 'x-large',
  })
)

const buttonSize = computed(() =>
  getResponsiveValue({
    mobile: 'small',
    tablet: 'default',
    desktop: 'default',
  })
)

const actionIcon = computed(() =>
  props.type === 'obtained' ? 'mdi-open-in-new' : 'mdi-information-outline'
)
</script>

<style scoped>
.modern-certification-item {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-surface-bright));
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: var(--animation-delay);
}

.modern-certification-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

/* Hover sempre azul */
.certification-item--obtained:hover,
.certification-item--planned:hover {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.2);
}

.certification-item-inner {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
  position: relative;
  z-index: 2;
}

/* Avatar */
.certification-avatar {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.certification-avatar-img {
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

/* Hover normal - sem zoom na imagem */
.modern-certification-item:hover .certification-avatar-img {
  border-color: transparent;
  box-shadow: none;
}

.certification-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(var(--item-color), 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.modern-certification-item:hover .certification-icon-wrapper {
  background: rgba(var(--item-color), 0.2);
  transform: rotate(5deg);
}

/* Content */
.certification-content {
  flex: 1;
  min-width: 0;
}

.certification-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 4px;
  line-height: 1.4;
  transition: color 0.3s ease;
}

/* Título sempre azul em hover */
.certification-item--obtained:hover .certification-title,
.certification-item--planned:hover .certification-title {
  color: #3b82f6;
}

.certification-issuer {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.3;
}

/* Action */
.certification-action {
  flex-shrink: 0;
}

.certification-action-btn {
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  opacity: 0.7;
}

.modern-certification-item:hover .certification-action-btn {
  opacity: 1;
  transform: scale(1.1);
}

/* Borda sempre azul nos botões */
.certification-item--obtained .certification-action-btn,
.certification-item--planned .certification-action-btn {
  border-color: rgba(59, 130, 246, 0.5) !important;
}

.certification-item--obtained:hover .certification-action-btn,
.certification-item--planned:hover .certification-action-btn {
  border-color: #3b82f6 !important;
}

/* Decorative Element */
.certification-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(var(--item-color), 0.8) 0%,
    rgba(var(--item-color), 0.4) 100%
  );
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.3s ease;
}

.modern-certification-item:hover .certification-decoration {
  transform: scaleY(1);
}

/* Decoração sempre azul */
.certification-item--obtained .certification-decoration,
.certification-item--planned .certification-decoration {
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%);
}

/* fadeInUp animation available in /assets/css/components.css */

/* Responsive */
@media (max-width: 768px) {
  .certification-item-inner {
    padding: 12px;
    gap: 12px;
  }

  .certification-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .certification-title {
    font-size: 1rem;
  }

  .certification-issuer {
    font-size: 0.85rem;
  }

  .modern-certification-item:hover {
    transform: translateY(-2px);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .modern-certification-item,
  .certification-avatar,
  .certification-action-btn,
  .certification-decoration {
    animation: none !important;
    transition: none !important;
  }

  .modern-certification-item:hover {
    transform: none !important;
  }

  .modern-certification-item:hover .certification-avatar,
  .modern-certification-item:hover .certification-action-btn {
    transform: none !important;
  }
}
</style>
