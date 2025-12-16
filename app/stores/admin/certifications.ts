import { defineStore } from 'pinia'
import type { Certification } from '~/types/admin'

export const useAdminCertificationsStore = defineStore('admin-certifications', {
  state: () => ({
    certifications: [] as Certification[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allCertifications: state => state.certifications,
    activeCount: state => state.certifications.filter(c => c.active).length,
    inactiveCount: state => state.certifications.filter(c => !c.active).length,
    totalSkills: state => state.certifications.reduce((sum, cert) => sum + (cert.skills || 0), 0),
  },

  actions: {
    async fetchCertifications() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const data = await $fetch<Certification[]>(
          `${config.public.apiUrl}/certifications/admin/all`
        )
        this.certifications = data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        return data
      } catch (error: any) {
        this.error = error?.message || 'Erro ao carregar certificações'
        console.error('Erro ao carregar certificações:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCertification(certData: Omit<Certification, '_id' | 'createdAt' | 'updatedAt'>) {
      try {
        const config = useRuntimeConfig()
        const newCert = await $fetch<Certification>(`${config.public.apiUrl}/certifications`, {
          method: 'POST',
          body: certData,
        })
        await this.fetchCertifications()
        return newCert
      } catch (error: any) {
        const errorMsg = error?.data?.message ?? error?.message ?? 'Erro ao criar certificação'
        console.error('Erro ao criar certificação:', error)
        throw new Error(errorMsg)
      }
    },

    async updateCertification(id: string, certData: Partial<Certification>) {
      try {
        const config = useRuntimeConfig()
        const { _id, createdAt, updatedAt, __v, ...cleanData } = certData as any

        const updatedCert = await $fetch<Certification>(
          `${config.public.apiUrl}/certifications/${id}`,
          {
            method: 'PUT',
            body: cleanData,
          }
        )

        await this.fetchCertifications()
        return updatedCert
      } catch (error: any) {
        const errorMsg = error?.data?.message ?? error?.message ?? 'Erro ao atualizar certificação'
        console.error('Erro ao atualizar certificação:', error)
        throw new Error(errorMsg)
      }
    },

    async toggleActive(certification: Certification) {
      try {
        const updatedCert = { ...certification, active: !certification.active }
        await this.updateCertification((certification as any)._id!, updatedCert)
        return updatedCert
      } catch (error: any) {
        console.error('Erro ao alterar status da certificação:', error)
        throw error
      }
    },

    async deleteCertification(id: string) {
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiUrl}/certifications/${id}`, {
          method: 'DELETE',
        })
        await this.fetchCertifications()
      } catch (error: any) {
        console.error('Erro ao excluir certificação:', error)
        throw error
      }
    },
  },
})
