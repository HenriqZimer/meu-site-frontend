<template>
  <InfiniteCarousel :duration="120" gap="24px" container-class="mt-8" full-width>
    <!-- First set -->
    <AnimatedCard
      v-for="tech in technologies"
      :key="tech.name"
      :title="tech.name"
      :subtitle="tech.category"
      :icon="tech.icon"
      :icon-data-attr="tech.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')"
      width="180"
      height="auto"
      class="tech-card elevation-2 rounded-xl"
    />

    <!-- Duplicate for seamless loop -->
    <AnimatedCard
      v-for="tech in technologies"
      :key="`duplicate-${tech.name}`"
      :title="tech.name"
      :subtitle="tech.category"
      :icon="tech.icon"
      :icon-data-attr="tech.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')"
      width="180"
      height="auto"
      class="tech-card elevation-2 rounded-xl"
      aria-hidden="true"
    />
  </InfiniteCarousel>
</template>

<script setup lang="ts">
interface Technology {
  name: string
  category: string
  icon: string
}

defineProps<{
  technologies: Technology[]
}>()
</script>
