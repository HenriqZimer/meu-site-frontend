import { defineStore } from 'pinia'
import type { Certification } from '~/types/admin'

export const useAdminCertificationsStore = defineStore('admin-certifications', () => {
  // Usa composable genérico para operações CRUD
  const api = useAdminApi<Certification>({ endpoint: 'certifications' })

  // Getters computados
  const allCertifications = computed(() => api.data.value)
  const activeCount = computed(() => api.data.value.filter(c => c.active).length)
  const inactiveCount = computed(() => api.data.value.filter(c => !c.active).length)
  const totalSkills = computed(() =>
    api.data.value.reduce((sum, cert) => sum + (cert.skills ?? 0), 0)
  )

  // Certificações ordenadas por ano e mês (lógica específica de certifications)
  const sortedCertifications = computed(() => {
    return [...api.data.value].sort((a, b) => {
      const yearDiff = Number(b.year ?? 0) - Number(a.year ?? 0)
      if (yearDiff !== 0) return yearDiff
      return Number(b.month ?? 0) - Number(a.month ?? 0)
    })
  })

  // Wrapper para fetchCertifications
  const fetchCertifications = async () => {
    const result = await api.fetchAll()
    return result
  }

  return {
    // State
    certifications: api.data,
    loading: api.loading,
    error: api.error,

    // Getters
    allCertifications,
    sortedCertifications,
    activeCount,
    inactiveCount,
    totalSkills,

    // Actions
    fetchCertifications,
    createCertification: api.create,
    updateCertification: api.update,
    deleteCertification: api.remove,
    toggleActive: api.toggleActive,
  }
})
