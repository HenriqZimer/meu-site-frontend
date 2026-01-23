<template>
  <div class="icon-grid">
    <div
      v-for="icon in icons"
      :key="icon"
      class="icon-item"
      @click="$emit('select', `${prefix}${icon}`)"
    >
      <div class="icon-preview">
        <Icon :name="`${prefix}${icon}`" size="32px" />
      </div>
      <div class="icon-name">{{ icon }}</div>
      <div class="icon-full-name">{{ prefix }}{{ icon }}</div>
    </div>

    <div v-if="icons.length === 0" class="no-icons">
      <v-icon icon="mdi-magnify-remove-outline" size="48" class="mb-2" />
      <p>Nenhum ícone encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icons: string[]
  prefix: string
}

defineProps<Props>()
defineEmits<{
  select: [iconName: string]
}>()
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  padding: 8px 0;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.02);
}

.icon-item:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.icon-preview {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.icon-name {
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.9);
}

.icon-full-name {
  font-size: 9px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  word-break: break-all;
  font-family: monospace;
}

.no-icons {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
