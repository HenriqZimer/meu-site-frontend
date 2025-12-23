<template>
  <Section
    id="skills"
    badge="Skills"
    badge-icon="mdi-code-braces"
    badge-color="cyan"
    title-prefix="Minha Stack"
    title-highlight="Tecnológica"
    description="Ferramentas e tecnologias que domino e estou estudando"
    section-class="py-10 py-md-16"
    container-class="pa-0"
  >
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
  </Section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

// Store
const skillsStore = useSkillsStore()

// Carregar tecnologias da API
onMounted(async () => {
  await skillsStore.fetchSkills()
})

// Computed do store
const technologies = computed(() => skillsStore.allSkills)
</script>
