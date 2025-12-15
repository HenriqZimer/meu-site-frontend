<template>
  <Section
    id="certifications"
    badge="Certificações"
    badge-icon="mdi-certificate"
    badge-color="warning"
    title-prefix="Minhas"
    title-highlight="Certificações"
    description="Desenvolvimento profissional contínuo através de certificações e especializações em tecnologias cloud e DevOps"
    section-class="py-10 py-md-16"
    container-class="px-4 px-md-6"
    :no-header="false"
  >
    <!-- Badges -->
    <div class="certifications-content">
      <CertificationBadgeGrid :badges="certificationBadges" :show-header="false" />
    </div>
  </Section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Store
const certificationsStore = useCertificationsStore()

onMounted(async () => {
  // Carregar certificações da API
  await certificationsStore.fetchCertifications()
})

// Computed do store
const certificationBadges = computed(() => certificationsStore.allCertifications)
</script>

<style scoped>
/* === CERTIFICATIONS CONTENT === */
.certifications-content {
  width: 100%;
  margin: 0 auto;
}

/* All other styles inherited from Section component and CertificationBadgeGrid */
</style>
