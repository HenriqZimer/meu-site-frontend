<template>
  <div
    class="filter-chips d-flex flex-wrap justify-center ga-3"
    :class="containerClass"
    v-bind="$attrs"
  >
    <v-chip
      v-for="filter in filters"
      :key="filter.value"
      :color="props.modelValue === filter.value ? activeColor : defaultColor"
      :variant="props.modelValue === filter.value ? 'flat' : 'outlined'"
      :class="{ 'filter-chip--active': props.modelValue === filter.value }"
      class="filter-chip"
      :size="size"
      @click="handleFilterClick(filter.value)"
    >
      <v-icon v-if="filter.icon" start :size="iconSize">{{ filter.icon }}</v-icon>
      {{ filter.label }}
      <v-badge
        v-if="showBadges && filter.count && filter.count > 0"
        :content="filter.count"
        :color="props.modelValue === filter.value ? badgeActiveColor : badgeDefaultColor"
        inline
        class="ml-2"
      />
    </v-chip>
  </div>
</template>

<script setup lang="ts">
interface Filter {
  value: string
  label: string
  icon?: string
  count?: number
}

interface Props {
  filters: Filter[]
  modelValue?: string
  activeColor?: string
  defaultColor?: string
  badgeActiveColor?: string
  badgeDefaultColor?: string
  size?: 'small' | 'default' | 'large'
  iconSize?: string | number
  showBadges?: boolean
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'all',
  activeColor: 'primary',
  defaultColor: 'default',
  badgeActiveColor: 'white',
  badgeDefaultColor: 'primary',
  size: 'default',
  iconSize: 18,
  showBadges: true,
  containerClass: '',
})

const emit = defineEmits<{
  'update:modelValue': (value: string) => void
  change: (value: string) => void
}>()

function handleFilterClick(value: string) {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.filter-chips {
  margin-bottom: 40px;
}

.filter-chip {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-chip:hover {
  transform: translateY(-2px);
}

.filter-chip--active {
  font-weight: 600;
}

@media (max-width: 960px) {
  .filter-chips {
    margin-bottom: 32px;
  }
}

@media (max-width: 600px) {
  .filter-chips {
    margin-bottom: 24px;
  }
}
</style>
