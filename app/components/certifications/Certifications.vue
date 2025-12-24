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
  >
    <div class="certifications-content">
      <CertificationBadgeGrid :badges="certificationBadges" :show-header="false" />
    </div>
  </Section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import CertificationBadgeGrid from './components/CertificationBadgeGrid.vue'

const certificationsStore = useCertificationsStore()

onMounted(async () => {
  // Garantir que está rodando no cliente
  if (import.meta.client) {
    try {
      console.log('[Certifications Component] Iniciando fetch...')
      await certificationsStore.fetchCertifications()
      console.log(
        '[Certifications Component] Fetch concluído. Total:',
        certificationsStore.allCertifications.length
      )
    } catch (error) {
      console.error('[Certifications Component] Erro ao buscar certificações:', error)
    }
  }
})

const certificationBadges = computed(() => certificationsStore.allCertifications)
</script>

<style scoped>
.certifications-content {
  width: 100%;
  margin: 0 auto;
}
</style>
