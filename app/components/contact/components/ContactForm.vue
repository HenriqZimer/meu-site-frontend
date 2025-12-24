<template>
  <div class="contact-card" data-animate="slide-up" data-delay="200">
    <div class="card-header mb-6">
      <h3 class="card-title">Envie uma Mensagem</h3>
      <p class="card-subtitle">Preencha o formulário e entrarei em contato em breve</p>
    </div>

    <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
      <div class="form-field mb-4">
        <label for="contact-name" class="field-label">Nome *</label>
        <input
          id="contact-name"
          v-model="formData.name"
          type="text"
          class="field-input"
          placeholder="Seu nome completo"
          :class="{ 'field-error': errors.name }"
          @blur="validateField('name')"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-field mb-4">
        <label for="contact-email" class="field-label">Email *</label>
        <input
          id="contact-email"
          v-model="formData.email"
          type="email"
          class="field-input"
          placeholder="seu@email.com"
          :class="{ 'field-error': errors.email }"
          @blur="validateField('email')"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-field mb-4">
        <label for="contact-subject" class="field-label">Assunto *</label>
        <input
          id="contact-subject"
          v-model="formData.subject"
          type="text"
          class="field-input"
          placeholder="Assunto da mensagem"
          :class="{ 'field-error': errors.subject }"
          @blur="validateField('subject')"
        />
        <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
      </div>

      <div class="form-field mb-6">
        <label for="contact-message" class="field-label">Mensagem *</label>
        <textarea
          id="contact-message"
          v-model="formData.message"
          class="field-textarea"
          placeholder="Descreva seu projeto ou dúvida..."
          rows="6"
          :class="{ 'field-error': errors.message }"
          @blur="validateField('message')"
        ></textarea>
        <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
      </div>

      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        class="submit-btn"
        :loading="loading"
        :disabled="!valid || loading"
      >
        <v-icon start>mdi-send</v-icon>
        {{ loading ? 'Enviando...' : 'Enviar Mensagem' }}
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', data: any): void
  (e: 'success'): void
  (e: 'error', message: string): void
}>()

const config = useRuntimeConfig()
const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const errors = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

// Validadores específicos para cada campo
const validators = {
  name: (value: string) => {
    if (!value.trim()) return 'O nome é obrigatório'
    if (value.trim().length < 3) return 'O nome deve ter pelo menos 3 caracteres'
    return ''
  },
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value.trim()) return 'O email é obrigatório'
    if (!emailRegex.test(value)) return 'Email inválido'
    return ''
  },
  subject: (value: string) => {
    if (!value.trim()) return 'O assunto é obrigatório'
    if (value.trim().length < 3) return 'O assunto deve ter pelo menos 3 caracteres'
    return ''
  },
  message: (value: string) => {
    if (!value.trim()) return 'A mensagem é obrigatória'
    if (value.trim().length < 10) return 'A mensagem deve ter pelo menos 10 caracteres'
    return ''
  },
}

const validateField = (field: 'name' | 'email' | 'subject' | 'message') => {
  errors.value[field] = validators[field](formData.value[field])
  updateValidStatus()
}

const validateAllFields = () => {
  validateField('name')
  validateField('email')
  validateField('subject')
  validateField('message')
  return !Object.values(errors.value).some(error => error !== '')
}

const updateValidStatus = () => {
  valid.value =
    formData.value.name.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email) &&
    formData.value.subject.trim().length >= 3 &&
    formData.value.message.trim().length >= 10 &&
    !Object.values(errors.value).some(error => error !== '')
}

const handleSubmit = async () => {
  if (!validateAllFields()) {
    return
  }
  loading.value = true

  try {
    await $fetch(`${config.public.apiUrl}/contacts`, {
      method: 'POST',
      body: formData.value,
    })

    emit('success')

    // Reset form
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
    }
    errors.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
    }
    valid.value = false
  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', error)
    emit('error', error.data?.message || 'Erro ao enviar mensagem. Tente novamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-card {
  position: relative;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.contact-card:hover {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-header {
  text-align: center;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface-variant));
}

.form-field {
  position: relative;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 8px;
}

.field-input,
.field-textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(var(--v-theme-surface), 0.5);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 8px;
  color: rgb(var(--v-theme-on-surface));
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.field-input:focus,
.field-textarea:focus {
  outline: none;
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-surface), 0.7);
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.1);
}

.field-error {
  border-color: rgb(var(--v-theme-error)) !important;
}

.error-message {
  display: block;
  font-size: 12px;
  color: rgb(var(--v-theme-error));
  margin-top: 4px;
}

.field-textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  text-transform: none;
  font-weight: 600;
}

@media (max-width: 600px) {
  .contact-card {
    padding: 16px;
  }

  .card-title {
    font-size: 20px;
  }
}
</style>
