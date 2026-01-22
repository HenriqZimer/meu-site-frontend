<template>
  <Section
    id="contact"
    badge="Contato"
    badge-icon="mdi-email-outline"
    badge-color="error"
    title-prefix="Interessado em"
    title-highlight="trabalhar comigo"
    description="Vamos conversar sobre seu próximo projeto"
    section-class="py-10 py-md-16"
    container-class="px-4 px-md-6"
  >
    <v-row justify="center">
      <v-col cols="12" md="6">
        <ContactForm @success="handleSuccess" @error="handleError" />
      </v-col>

      <v-col cols="12" md="6">
        <ContactInfo />
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="5000"
      location="top"
      multi-line
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn icon="mdi-close" size="small" @click="showSnackbar = false" />
      </template>
    </v-snackbar>
  </Section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContactForm from './components/ContactForm.vue'
import ContactInfo from './components/ContactInfo.vue'

const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const handleSuccess = () => {
  snackbarMessage.value = 'Mensagem enviada com sucesso! Entrarei em contato em breve.'
  snackbarColor.value = 'success'
  showSnackbar.value = true
}

const handleError = (message: string) => {
  snackbarMessage.value = message
  snackbarColor.value = 'error'
  showSnackbar.value = true
}
</script>
