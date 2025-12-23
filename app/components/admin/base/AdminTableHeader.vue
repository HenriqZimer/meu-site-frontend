<template>
  <v-card class="admin-table-card">
    <v-card-title class="d-flex justify-space-between align-center">
      <div class="d-flex align-center" style="gap: 12px">
        <v-icon :icon="icon" size="28" color="primary" />
        <span class="admin-table-title">{{ title }}</span>
      </div>
      <v-btn v-if="showAddButton" color="primary" class="admin-action-btn" @click="$emit('add')">
        <v-icon start>mdi-plus</v-icon>
        {{ addButtonText }}
      </v-btn>
    </v-card-title>

    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  icon: string
  addButtonText?: string
  showAddButton?: boolean
}

withDefaults(defineProps<Props>(), {
  addButtonText: 'Adicionar',
  showAddButton: true,
})

defineEmits<{
  (e: 'add'): void
}>()
</script>
