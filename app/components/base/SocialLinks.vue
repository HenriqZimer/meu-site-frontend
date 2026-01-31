<template>
  <div :class="containerClasses">
    <p v-if="label" class="social-label">{{ label }}</p>
    <div class="social-links">
      <a
        v-for="social in links"
        :key="social.name"
        :href="social.url || social.href"
        :aria-label="social.label || `Visitar ${social.name}`"
        class="social-link"
        :class="linkClass"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-icon :icon="social.icon" :size="iconSize" :class="iconClass" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SocialLink {
  name: string
  icon: string
  url?: string
  href?: string
  label?: string
}

interface Props {
  links?: SocialLink[]
  label?: string
  variant?: 'default' | 'footer'
  iconSize?: string | number
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  links: () => [],
  label: '',
  variant: 'default',
  iconSize: 20,
  customClass: '',
})

const containerClasses = computed(() => [
  'social-links-container',
  `social-links--${props.variant}`,
  props.customClass,
])

const linkClass = computed(() => (props.variant === 'footer' ? 'social-link--footer' : ''))

const iconClass = computed(() => (props.variant === 'footer' ? 'social-icons' : ''))
</script>

<style scoped>
.social-links-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.social-label {
  font-size: 14px;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface-variant));
  margin: 0;
}

.social-links {
  display: flex;
  gap: 12px;
  align-items: center;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(var(--v-theme-surface-bright), 0.5);
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  border-radius: 12px;
  color: rgb(var(--v-theme-on-surface));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.social-link:hover {
  transform: translateY(-2px);
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  color: white;
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

/* Variant Footer */
.social-links--footer .social-links {
  gap: 8px;
}

.social-link--footer {
  width: 36px;
  height: 36px;
  border-radius: 10px;
}

/* Responsivo */
@media (max-width: 999px) {
  .social-links {
    justify-content: center;
    align-items: center;
  }

  .social-link {
    width: 36px;
    height: 36px;
  }
}
</style>
