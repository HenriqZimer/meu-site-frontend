<template>
  <v-icon v-if="isMdiIcon" :icon="icon" :size="size" :color="color" />
  <Icon v-else :name="icon" :size="iconSize" :style="{ color: iconColor }" />
</template>

<script setup lang="ts">
interface Props {
  icon: string
  size?: string | number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: undefined,
})

// Ícones MDI (mdi-*) usam v-icon do Vuetify
// Outros ícones (devicon:*, logos:*, skill-icons:*) usam Icon do Nuxt
const isMdiIcon = computed(() => props.icon.startsWith('mdi-'))

const iconSize = computed(() => {
  if (typeof props.size === 'string') return props.size
  return `${props.size}px`
})

const iconColor = computed(() => {
  return props.color || 'currentColor'
})
</script>
