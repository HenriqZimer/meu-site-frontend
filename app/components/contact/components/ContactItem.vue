<template>
  <div class="contact-item" :style="{ animationDelay: `${delay}ms` }">
    <div class="contact-icon">
      <v-icon :icon="icon" size="20" />
    </div>
    <div class="contact-details">
      <span class="contact-label">{{ label }}</span>
      <a
        v-if="href"
        :href="href"
        class="contact-value"
        :target="external ? '_blank' : undefined"
        :rel="external ? 'noopener noreferrer' : undefined"
      >
        {{ value }}
      </a>
      <span v-else class="contact-value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: string
  href?: string
  delay?: number
  external?: boolean
}

withDefaults(defineProps<Props>(), {
  href: '',
  delay: 300,
  external: false,
})
</script>

<style scoped>
.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(var(--v-theme-surface-bright), 0.3);
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.contact-item:hover {
  background: rgba(var(--v-theme-surface-bright), 0.5);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateX(4px);
}

.contact-icon {
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgb(96, 165, 250);
  transition: all 0.3s ease;
}

.contact-item:hover .contact-icon {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  transform: scale(1.1);
}

.contact-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-label {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-value {
  font-size: 16px;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  text-decoration: none;
  transition: color 0.3s ease;
  word-break: break-word;
}

a.contact-value:hover {
  color: rgb(96, 165, 250);
}

/* fadeInUp animation available in /assets/css/components.css */
</style>
