<template>
  <div class="contact-card" data-animate="slide-up" data-delay="300">
    <div class="card-header mb-6">
      <h3 class="card-title">Informações de Contato</h3>
      <p class="card-subtitle">Você também pode me encontrar através de</p>
    </div>

    <div class="contact-items mb-6">
      <ContactItem
        icon="mdi-email"
        label="Email"
        :value="email"
        :href="`mailto:${email}`"
        :delay="400"
      />
      <ContactItem
        icon="mdi-phone"
        label="Telefone"
        :value="phone"
        :href="`tel:${phone}`"
        :delay="450"
      />
      <ContactItem
        icon="mdi-whatsapp"
        label="WhatsApp"
        :value="phone"
        :href="whatsappUrl"
        :delay="500"
        external
      />
      <ContactItem icon="mdi-map-marker" label="Localização" :value="location" :delay="550" />
    </div>

    <div class="social-section">
      <h4 class="social-title mb-4">Redes Sociais</h4>
      <div class="d-flex flex-wrap ga-3">
        <v-btn
          variant="outlined"
          color="primary"
          class="social-btn"
          :href="githubUrl"
          target="_blank"
          size="large"
        >
          <v-icon start icon="mdi-github" />
          GitHub
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          class="social-btn"
          :href="linkedinUrl"
          target="_blank"
          size="large"
        >
          <v-icon start icon="mdi-linkedin" />
          LinkedIn
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactItem from './ContactItem.vue'
import { useSocialLinks } from '~/composables/useSocialLinks'

const { contactInfo } = useSocialLinks()

const email = contactInfo.email
const phone = contactInfo.phone
const location = contactInfo.location
const whatsappUrl = contactInfo.whatsapp
const githubUrl = 'https://github.com/henriqzimer'
const linkedinUrl = 'https://linkedin.com/in/henrique-zimermann'
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

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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
  flex: 1;
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
