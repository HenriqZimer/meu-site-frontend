<template>
  <v-card class="admin-stat-card">
    <v-card-text style="text-align: center; display: flex; align-items: center; gap: 12px">
      <div :class="`admin-stat-icon-wrapper ${color}`">
        <v-icon :icon="icon" />
      </div>
      <div class="admin-stat-content">
        <div class="admin-stat-value">{{ value }}</div>
        <div class="admin-stat-label">{{ label }}</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  value: string | number
  label: string
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'cyan'
}

withDefaults(defineProps<Props>(), {
  color: 'blue',
})
</script>
