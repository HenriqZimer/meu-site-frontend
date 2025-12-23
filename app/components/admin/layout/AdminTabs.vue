<template>
  <v-tabs
    :model-value="modelValue"
    color="primary"
    class="admin-tabs"
    height="56"
    center-active
    show-arrows
    @update:model-value="handleUpdate"
  >
    <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value" class="tab-item pa-4 mr-4">
      <v-icon start size="20">{{ tab.icon }}</v-icon>
      <span class="tab-text">{{ tab.label }}</span>
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
interface Tab {
  value: string
  label: string
  icon: string
}

defineProps<{
  modelValue: string
  tabs: Tab[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleUpdate = (val: unknown) => {
  emit('update:modelValue', val as string)
}
</script>

<style scoped>
.admin-tabs {
  background: rgba(15, 23, 42, 0.5) !important;
  padding: 0 !important;
  width: 100%;
  display: flex;
  justify-content: center;
}

:deep(.admin-tabs .v-slide-group__content) {
  justify-content: center;
  gap: 1.5rem;
  padding: 0 2rem;
}

:deep(.v-tab.tab-item) {
  color: #94a3b8 !important;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  border-radius: 12px 12px 0 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 56px;
  margin: 0;
  position: relative;
  padding: 0 1.5rem;
}

:deep(.v-tab.tab-item .tab-text) {
  margin-left: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
}

:deep(.v-tab.tab-item:hover) {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa !important;
  transform: translateY(-2px);
}

:deep(.v-tab.tab-item.v-tab--selected) {
  background: linear-gradient(
    180deg,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(59, 130, 246, 0.05) 100%
  ) !important;
  color: #3b82f6 !important;
  box-shadow: 0 -4px 12px rgba(59, 130, 246, 0.2);
}

:deep(.v-tabs-slider) {
  display: none;
}

@media (max-width: 768px) {
  .admin-tabs {
    padding: 0 0.5rem;
  }

  :deep(.v-slide-group__content) {
    padding: 0 0.5rem !important;
    gap: 0.25rem !important;
  }

  :deep(.v-tab.tab-item) {
    padding: 0 1rem !important;
    min-width: auto !important;
  }

  :deep(.v-tab.tab-item .tab-text) {
    display: none;
  }
}
</style>
