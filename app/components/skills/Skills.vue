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
    <SkillsCarousel :technologies="technologies" />
  </Section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SkillsCarousel from './components/SkillsCarousel.vue'

const skillsStore = useSkillsStore()

onMounted(async () => {
  await skillsStore.fetchSkills()
})

const technologies = computed(() => skillsStore.allSkills)
</script>
