import { defineStore } from 'pinia'
import type { Contact } from '~/types/admin'

export const useAdminContactsStore = defineStore('admin-contacts', {
  state: () => ({
    contacts: [] as Contact[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allContacts: state => state.contacts,
    unreadCount: state => state.contacts.filter(c => !c.read).length,
    readCount: state => state.contacts.filter(c => c.read).length,
    todayCount: state => {
      const today = new Date().toDateString()
      return state.contacts.filter(c => {
        const contactDate = new Date(c.createdAt ?? '').toDateString()
        return contactDate === today
      }).length
    },
  },

  actions: {
    async fetchContacts() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Contact[]; count: number }>(
          `${config.public.apiUrl}/contacts`
        )
        const contacts = response.data ?? []
        this.contacts = contacts.sort((a, b) => {
          const dateA = new Date(a.createdAt ?? 0).getTime()
          const dateB = new Date(b.createdAt ?? 0).getTime()
          return dateB - dateA
        })
        return contacts
      } catch (error: any) {
        this.error = error?.message ?? 'Erro ao carregar contatos'
        console.error('Erro ao carregar contatos:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleRead(id: string) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ data: Contact; message: string }>(
          `${config.public.apiUrl}/contacts/${id}/toggle-read`,
          { method: 'PATCH' }
        )

        // Update local state immediately
        const contactIndex = this.contacts.findIndex(c => c._id === id)
        if (contactIndex !== -1) {
          this.contacts[contactIndex] = response.data
        }

        return response.data
      } catch (error: any) {
        console.error('Erro ao alterar status de leitura:', error)
        throw error
      }
    },

    async deleteContact(id: string) {
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiUrl}/contacts/${id}`, {
          method: 'DELETE',
        })
        await this.fetchContacts()
      } catch (error: any) {
        console.error('Erro ao excluir contato:', error)
        throw error
      }
    },

    async deleteAllRead() {
      try {
        const readContacts = this.contacts.filter(c => c.read)
        await Promise.all(readContacts.map(contact => this.deleteContact(contact._id!)))
        await this.fetchContacts()
      } catch (error: any) {
        console.error('Erro ao excluir contatos lidos:', error)
        throw error
      }
    },
  },
})
