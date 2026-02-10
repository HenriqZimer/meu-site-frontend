import { defineStore } from 'pinia'
import type { Contact } from '~/types/admin'

export const useAdminContactsStore = defineStore('admin-contacts', () => {
  const config = useRuntimeConfig()

  // State
  const contacts = ref<Contact[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters computados
  const allContacts = computed(() => contacts.value)
  const unreadCount = computed(() => contacts.value.filter(c => !c.read).length)
  const readCount = computed(() => contacts.value.filter(c => c.read).length)
  const todayCount = computed(() => {
    const today = new Date().toDateString()
    return contacts.value.filter(c => {
      const contactDate = new Date(c.createdAt ?? '').toDateString()
      return contactDate === today
    }).length
  })

  // Contatos ordenados por data (mais recente primeiro)
  const sortedContacts = computed(() => {
    return [...contacts.value].sort((a, b) => {
      const dateA = new Date(a.createdAt ?? 0).getTime()
      const dateB = new Date(b.createdAt ?? 0).getTime()
      return dateB - dateA
    })
  })

  // Fetch contacts - endpoint customizado
  const fetchContacts = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ data: Contact[]; count: number }>(
        `${config.public.apiUrl}/contacts`,
        {
          headers: getAuthHeaders(),
        }
      )
      contacts.value = response.data ?? []
      return contacts.value
    } catch (err: unknown) {
      const errorMsg = (err as any)?.message ?? 'Erro ao carregar contatos'
      error.value = errorMsg

      if (import.meta.dev) {
        console.error('[useAdminContactsStore] fetchContacts:', err as any)
      }

      throw new Error(errorMsg)
    } finally {
      loading.value = false
    }
  }

  // Toggle read status - método específico de contacts
  const toggleRead = async (id: string) => {
    try {
      const response = await $fetch<{ data: Contact; message: string }>(
        `${config.public.apiUrl}/contacts/${id}/toggle-read`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
        }
      )

      // Atualiza estado local imediatamente
      const contactIndex = contacts.value.findIndex(c => c._id === id)
      if (contactIndex !== -1) {
        contacts.value[contactIndex] = response.data
      }

      return response.data
    } catch (err: unknown) {
      if (import.meta.dev) {
        console.error('[useAdminContactsStore] toggleRead:', err as any)
      }
      throw err
    }
  }

  // Delete contact
  const deleteContact = async (id: string) => {
    try {
      await $fetch(`${config.public.apiUrl}/contacts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      await fetchContacts()
    } catch (err: unknown) {
      if (import.meta.dev) {
        console.error('[useAdminContactsStore] deleteContact:', err as any)
      }
      throw err
    }
  }

  // Delete all read contacts - método específico de contacts
  const deleteAllRead = async () => {
    try {
      const readContacts = contacts.value.filter(c => c.read && c._id)
      await Promise.all(readContacts.map(contact => deleteContact(contact._id as string)))
      await fetchContacts()
    } catch (err: unknown) {
      if (import.meta.dev) {
        console.error('[useAdminContactsStore] deleteAllRead:', err as any)
      }
      throw err
    }
  }

  return {
    // State
    contacts,
    loading,
    error,

    // Getters
    allContacts,
    sortedContacts,
    unreadCount,
    readCount,
    todayCount,

    // Actions
    fetchContacts,
    toggleRead,
    deleteContact,
    deleteAllRead,
  }
})

// Helper para obter headers de autenticação
function getAuthHeaders(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
  }
  return {}
}
