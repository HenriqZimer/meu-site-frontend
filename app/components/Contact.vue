<template>
  <Section id="contact" badge="Contato" badge-icon="mdi-email-outline" badge-color="error" title-prefix="Interessado em"
    title-highlight="trabalhar comigo" description="Vamos conversar sobre seu próximo projeto"
    section-class="py-10 py-md-16" container-class="px-4 px-md-6">

    <v-row justify="center">
      <!-- Contact Form -->
      <v-col cols="12" md="6">
        <div class="contact-card" data-animate="slide-up" data-delay="200">
          <div class="card-header mb-6">
            <h3 class="card-title">Envie uma Mensagem</h3>
            <p class="card-subtitle">Preencha o formulário e entrarei em contato em breve</p>
          </div>

          <v-form ref="formRef" v-model="valid" @submit.prevent="submitForm">
            <div class="form-field mb-4">
              <label class="field-label">Nome *</label>
              <input v-model="formData.name" type="text" class="field-input" placeholder="Seu nome completo"
                :class="{ 'field-error': errors.name }" @blur="validateField('name')" />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-field mb-4">
              <label class="field-label">Email *</label>
              <input v-model="formData.email" type="email" class="field-input" placeholder="seu@email.com"
                :class="{ 'field-error': errors.email }" @blur="validateField('email')" />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-field mb-4">
              <label class="field-label">Assunto *</label>
              <input v-model="formData.subject" type="text" class="field-input" placeholder="Assunto da mensagem"
                :class="{ 'field-error': errors.subject }" @blur="validateField('subject')" />
              <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
            </div>

            <div class="form-field mb-6">
              <label class="field-label">Mensagem *</label>
              <textarea v-model="formData.message" class="field-textarea"
                placeholder="Descreva seu projeto ou dúvida..." rows="6" :class="{ 'field-error': errors.message }"
                @blur="validateField('message')"></textarea>
              <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
            </div>

            <v-btn type="submit" color="primary" size="large" block class="submit-btn" :loading="loading"
              :disabled="!valid || loading">
              <v-icon start>mdi-send</v-icon>
              {{ loading ? 'Enviando...' : 'Enviar Mensagem' }}
            </v-btn>
          </v-form>

        </div>
      </v-col>

      <!-- Contact Info -->
      <v-col cols="12" md="6">
        <div class="contact-card" data-animate="slide-up" data-delay="300">
          <div class="card-header mb-6">
            <h3 class="card-title">Informações de Contato</h3>
            <p class="card-subtitle">Você também pode me encontrar através de</p>
          </div>

          <div class="contact-items mb-6">
            <ContactItem icon="mdi-email" label="Email" :value="email" :href="`mailto:${email}`" :delay="400" />
            <ContactItem icon="mdi-phone" label="Telefone" :value="phone" :href="`tel:${phone}`" :delay="450" />
            <ContactItem icon="mdi-whatsapp" label="WhatsApp" :value="phone" :href="contactInfo.whatsapp" :delay="500"
              external />
            <ContactItem icon="mdi-map-marker" label="Localização" :value="location" :delay="550" />
          </div>

          <div class="social-section">
            <h4 class="social-title mb-4">Redes Sociais</h4>
            <div class="d-flex flex-wrap ga-3">
              <v-btn variant="outlined" color="primary" class="social-btn" :href="githubUrl" target="_blank"
                size="large">
                <v-icon start icon="mdi-github" />
                GitHub
              </v-btn>
              <v-btn variant="outlined" color="primary" class="social-btn" :href="linkedinUrl" target="_blank"
                size="large">
                <v-icon start icon="mdi-linkedin" />
                LinkedIn
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Snackbar for feedback -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="5000" location="top" multi-line>
      {{ snackbarMessage }}
      <template #actions>
        <v-btn icon="mdi-close" size="small" @click="showSnackbar = false" />
      </template>
    </v-snackbar>
  </Section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSocialLinks } from "~/composables/useSocialLinks";

// Composables
const { contactInfo } = useSocialLinks();
const config = useRuntimeConfig();

// Data
const formRef = ref(null);
const valid = ref(false);
const loading = ref(false);
const showSnackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const errors = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

// Variables
const email = contactInfo.email;
const phone = contactInfo.phone;
const location = contactInfo.location;
const githubUrl = "https://github.com/henriqzimer";
const linkedinUrl = "https://linkedin.com/in/henrique-zimermann";

// Validation functions
const validateField = (field: 'name' | 'email' | 'subject' | 'message') => {
  errors.value[field] = '';

  if (field === 'name') {
    if (!formData.value.name.trim()) {
      errors.value.name = 'O nome é obrigatório';
    } else if (formData.value.name.trim().length < 3) {
      errors.value.name = 'O nome deve ter pelo menos 3 caracteres';
    }
  }

  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.value.email.trim()) {
      errors.value.email = 'O email é obrigatório';
    } else if (!emailRegex.test(formData.value.email)) {
      errors.value.email = 'Email inválido';
    }
  }

  if (field === 'subject') {
    if (!formData.value.subject.trim()) {
      errors.value.subject = 'O assunto é obrigatório';
    } else if (formData.value.subject.trim().length < 3) {
      errors.value.subject = 'O assunto deve ter pelo menos 3 caracteres';
    }
  }

  if (field === 'message') {
    if (!formData.value.message.trim()) {
      errors.value.message = 'A mensagem é obrigatória';
    } else if (formData.value.message.trim().length < 10) {
      errors.value.message = 'A mensagem deve ter pelo menos 10 caracteres';
    }
  }

  updateValidStatus();
};

const validateAllFields = () => {
  validateField('name');
  validateField('email');
  validateField('subject');
  validateField('message');
  return !Object.values(errors.value).some(error => error !== '');
};

const updateValidStatus = () => {
  valid.value =
    formData.value.name.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email) &&
    formData.value.subject.trim().length >= 3 &&
    formData.value.message.trim().length >= 10 &&
    !Object.values(errors.value).some(error => error !== '');
};

// Submit form
const submitForm = async () => {
  if (!validateAllFields()) {
    return;
  }
  loading.value = true;

  try {
    const response = await $fetch(`${config.public.apiUrl}/contacts`, {
      method: 'POST',
      body: formData.value,
    });

    // Show success notification
    snackbarMessage.value = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
    snackbarColor.value = 'success';
    showSnackbar.value = true;

    // Reset form
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
    errors.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
    valid.value = false;

  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', error);

    // Show error notification
    snackbarMessage.value = error.data?.message || 'Erro ao enviar mensagem. Tente novamente.';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* === CONTACT CARD === */
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

/* === CARD HEADER === */
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

/* === FORM FIELDS === */
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

.field-input::placeholder,
.field-textarea::placeholder {
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.6;
}

.field-textarea {
  resize: vertical;
  min-height: 120px;
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

/* === SUBMIT BUTTON === */
.submit-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* === CONTACT ITEMS === */
.contact-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* === SOCIAL SECTION === */
.social-section {
  padding-top: 24px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.social-title {
  font-size: 18px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  text-align: center;
}

.social-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.02em;
  flex: 1;
}

/* === RESPONSIVE === */
@media (max-width: 960px) {
  .contact-card {
    padding: 20px;
  }

  .card-title {
    font-size: 20px;
  }
}

@media (max-width: 600px) {
  .contact-card {
    padding: 16px;
  }

  .card-title {
    font-size: 18px;
  }

  .field-input,
  .field-textarea {
    padding: 10px 14px;
  }
}
</style>
