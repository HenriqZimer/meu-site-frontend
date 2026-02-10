<template>
  <v-dialog :model-value="modelValue" :max-width="maxWidth" persistent scrollable>
    <v-card class="admin-dialog-card">
      <v-card-title class="admin-dialog-title">
        <v-icon v-if="icon" size="24" class="mr-2">{{ icon }}</v-icon>
        <span>{{ title }}</span>
      </v-card-title>

      <v-divider />

      <v-card-text class="admin-dialog-content">
        <slot />
      </v-card-text>

      <v-divider />

      <v-card-actions class="admin-dialog-actions">
        <v-spacer />
        <v-btn variant="tonal" size="large" color="error" class="px-8" @click="$emit('cancel')">
          {{ cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          variant="elevated"
          size="large"
          class="px-8 ml-4"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  icon?: string
  maxWidth?: string
  loading?: boolean
  confirmText?: string
  cancelText?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'mdi-pencil',
  maxWidth: '700px',
  loading: false,
  confirmText: 'Salvar',
  cancelText: 'Cancelar',
})

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm' | 'cancel'): void
}>()
</script>

<style scoped>
.admin-dialog-actions .v-btn {
  text-transform: capitalize !important;
}
</style>
