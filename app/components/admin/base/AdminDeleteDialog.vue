<template>
  <v-dialog
    :model-value="modelValue"
    max-width="450px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="admin-dialog-card">
      <v-card-title class="admin-dialog-title">
        <v-icon icon="mdi-alert" color="error" class="mr-2" />
        {{ title }}
      </v-card-title>

      <v-divider />

      <v-card-text class="admin-dialog-content text-center py-6">
        {{ message }}
      </v-card-text>

      <v-divider />

      <v-card-actions class="admin-dialog-actions">
        <v-btn variant="text" size="large" color="error" @click="$emit('cancel')">{{
          cancelText
        }}</v-btn>
        <v-btn
          color="error"
          :loading="loading"
          variant="flat"
          size="large"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmar Exclusão',
  message: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
  confirmText: 'Excluir',
  cancelText: 'Cancelar',
  loading: false,
})

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm' | 'cancel'): void
}>()
</script>
