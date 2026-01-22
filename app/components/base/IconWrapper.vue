<template>
  <v-icon v-if="isMdiIcon" :icon="icon" :size="size" :color="color" />
  <Icon v-else :icon="icon" :width="iconSize" :height="iconSize" :style="{ color: iconColor }" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  icon: string
  size?: string | number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: undefined,
})

const isMdiIcon = computed(() => props.icon.startsWith('mdi-'))

const iconSize = computed(() => {
  if (typeof props.size === 'number') return props.size
  return parseInt(props.size) || 24
})

const iconColor = computed(() => {
  return props.color || 'currentColor'
})
</script>
