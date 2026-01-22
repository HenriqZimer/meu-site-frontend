<template>
  <BaseCard
    :title="title"
    :icon="icon"
    :color="color"
    :count="count"
    :type="type"
    :animation-delay="animationDelay"
    :aria-label="`Lista de certificações ${type === 'obtained' ? 'obtidas' : 'planejadas'}`"
  >
    <CertificationItem
      v-for="(item, index) in items"
      :key="`${item.name}-${index}`"
      :certification="item"
      :index="index"
      :animation-delay="animationDelay + 400 + index * 100"
      :type="type"
    />
  </BaseCard>
</template>

<script setup lang="ts">
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
  title: string
  icon: string
  color: string
  items: Certification[]
  count: number
  type: 'obtained' | 'planned'
  animationDelay?: number
  elevation?: number | string
}

withDefaults(defineProps<Props>(), {
  animationDelay: 0,
  elevation: 8,
})
</script>
