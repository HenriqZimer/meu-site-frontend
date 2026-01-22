<template>
  <BaseCard
    :title="title"
    :icon="icon"
    :color="color"
    :count="count"
    :type="type"
    :animation-delay="animationDelay"
    :aria-label="`Lista de cursos ${
      type === 'completed' ? 'concluídos' : type === 'planned' ? 'planejados' : 'em andamento'
    }`"
  >
    <CourseItem
      v-for="(item, index) in items"
      :key="`${item.name}-${index}`"
      :course="item"
      :index="index"
      :animation-delay="animationDelay + 400 + index * 100"
      :type="type"
      :show-status="showStatus"
    />
  </BaseCard>
</template>

<script setup lang="ts">
import CourseItem from '~/components/courses/components/CourseItem.vue'

// Types
interface Course {
  name: string
  platform: string
  instructor?: string
  duration?: string
  icon?: string
  color?: string
  image?: string
  link: string
  progress?: number
}

// Props
interface Props {
  title: string
  icon: string
  color: string
  items: Course[]
  count: number
  type: 'completed' | 'in-progress' | 'planned'
  showStatus?: boolean
  animationDelay?: number
  elevation?: number | string
}

withDefaults(defineProps<Props>(), {
  showStatus: true,
  animationDelay: 0,
  elevation: 8,
})
</script>
