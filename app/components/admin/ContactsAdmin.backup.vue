<template>
  <div class="contacts-admin">
    <!-- Stats Cards -->
    <AdminStatsGrid>
      <AdminStatCard
        icon="mdi-email"
        :value="contacts.length"
        label="Total de Contatos"
        color="blue"
      />
      <AdminStatCard icon="mdi-email-alert" :value="unreadCount" label="Não Lidos" color="orange" />
      <AdminStatCard icon="mdi-email-check" :value="readCount" label="Lidos" color="green" />
      <AdminStatCard icon="mdi-calendar-today" :value="todayCount" label="Hoje" color="purple" />
    </AdminStatsGrid>

    <!-- Contacts Table -->
    <v-card class="contacts-table-card">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="d-flex align-center" style="gap: 12px">
          <v-icon icon="mdi-email-multiple" size="28" color="primary" />
          <span class="table-title">Mensagens de Contato</span>
        </div>
        <v-btn
          color="error"
          variant="outlined"
          size="small"
          :disabled="readCount === 0"
          :loading="deletingAll"
          @click="deleteAllRead"
        >
          <v-icon start>mdi-delete-sweep</v-icon>
          Limpar Lidos
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="contacts"
          :loading="loading"
          :items-per-page="10"
          class="contacts-table"
        >
          <template #[`item.read`]="{ item }">
            <v-chip :color="item.read ? 'success' : 'warning'" size="small" variant="flat">
              <v-icon start size="small">
                {{ item.read ? 'mdi-email-check' : 'mdi-email-alert' }}
              </v-icon>
              {{ item.read ? 'Lido' : 'Não Lido' }}
            </v-chip>
          </template>

          <template #[`item.createdAt`]="{ item }">
            <div class="date-cell">
              <div class="date-primary">{{ formatDate(item.createdAt) }}</div>
              <div class="date-secondary">{{ formatTime(item.createdAt) }}</div>
            </div>
          </template>

          <template #[`item.subject`]="{ item }">
            <div class="subject-cell">
              <v-icon v-if="!item.read" icon="mdi-circle" size="8" color="warning" class="mr-2" />
              {{ item.subject }}
            </div>
          </template>

          <template #[`item.actions`]="{ item }">
            <div class="admin-action-buttons">
              <v-tooltip text="Ver Detalhes" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon size="small" variant="text" @click="viewItem(item)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip
                :text="item.read ? 'Marcar como não lido' : 'Marcar como lido'"
                location="top"
              >
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon size="small" variant="text" @click="toggleRead(item)">
                    <v-icon>
                      {{ item.read ? 'mdi-email-open' : 'mdi-email-check' }}
                    </v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Excluir" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click="deleteItem(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="650px" scrollable>
      <v-card class="admin-dialog-card">
        <v-card-title class="admin-dialog-title">
          <v-icon icon="mdi-email-open" size="24" color="primary" />
          <span>Detalhes da Mensagem</span>
        </v-card-title>

        <v-divider />

        <v-card-text class="admin-dialog-content">
          <div class="contact-detail">
            <div class="detail-row">
              <div class="detail-label">
                <v-icon icon="mdi-account" size="20" class="mr-2" />
                Nome
              </div>
              <div class="detail-value">{{ viewedItem.name }}</div>
            </div>

            <v-divider class="my-4" />

            <div class="detail-row">
              <div class="detail-label">
                <v-icon icon="mdi-email" size="20" class="mr-2" />
                E-mail
              </div>
              <div class="detail-value">
                <a :href="`mailto:${viewedItem.email}`" class="email-link">
                  {{ viewedItem.email }}
                </a>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="detail-row">
              <div class="detail-label">
                <v-icon icon="mdi-text-subject" size="20" class="mr-2" />
                Assunto
              </div>
              <div class="detail-value">{{ viewedItem.subject }}</div>
            </div>

            <v-divider class="my-4" />

            <div class="detail-row">
              <div class="detail-label">
                <v-icon icon="mdi-message-text" size="20" class="mr-2" />
                Mensagem
              </div>
              <div class="detail-value message-content">
                {{ viewedItem.message }}
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="detail-row">
              <div class="detail-label">
                <v-icon icon="mdi-calendar-clock" size="20" class="mr-2" />
                Data de Envio
              </div>
              <div class="detail-value">
                {{ formatFullDate(viewedItem.createdAt) }}
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="admin-dialog-actions">
          <v-btn
            :prepend-icon="viewedItem.read ? 'mdi-email-open' : 'mdi-email-check'"
            variant="outlined"
            size="large"
            @click="toggleRead(viewedItem)"
          >
            {{ viewedItem.read ? 'Marcar como não lido' : 'Marcar como lido' }}
          </v-btn>
          <v-btn
            color="primary"
            :href="`mailto:${viewedItem.email}?subject=Re: ${viewedItem.subject}`"
            target="_blank"
            prepend-icon="mdi-reply"
            variant="flat"
            size="large"
          >
            Responder
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <AdminDeleteDialog
      v-model="deleteDialog"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteDialog = false"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" location="top">
      {{ snackbarText }}
      <template #actions>
        <v-btn icon="mdi-close" size="small" @click="snackbar = false" />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '~/types/admin'
import { useAdminContactsStore } from '~/stores/admin/contacts'

const contactsStore = useAdminContactsStore()

const headers = [
  { title: 'Status', key: 'read', width: '120px' },
  { title: 'Nome', key: 'name' },
  { title: 'E-mail', key: 'email' },
  { title: 'Assunto', key: 'subject' },
  { title: 'Data', key: 'createdAt', width: '150px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '150px', align: 'center' as const },
]

// State
const contacts = computed(() => contactsStore.allContacts)
const loading = computed(() => contactsStore.loading)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const deleting = ref(false)
const deletingAll = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const viewedItem = ref<Contact>({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const itemToDelete = ref<Contact | null>(null)

// Computed
const unreadCount = computed(() => contactsStore.unreadCount)
const readCount = computed(() => contactsStore.readCount)
const todayCount = computed(() => contactsStore.todayCount)

// Methods
const fetchContacts = async () => {
  try {
    await contactsStore.fetchContacts()
  } catch {
    showSnackbar('Erro ao carregar contatos', 'error')
  }
}

const viewItem = async (item: Contact) => {
  viewedItem.value = { ...item }
  viewDialog.value = true

  // Mark as read when viewing
  if (!item.read) {
    await toggleRead(item)
  }
}

const toggleRead = async (item: Contact) => {
  try {
    await contactsStore.toggleRead(item._id!)

    // Update viewedItem if it's the same
    if (viewedItem.value._id === item._id) {
      viewedItem.value.read = !viewedItem.value.read
    }

    showSnackbar(item.read ? 'Marcado como não lido' : 'Marcado como lido', 'success')
  } catch {
    showSnackbar('Erro ao atualizar status', 'error')
  }
}

const deleteItem = (item: Contact) => {
  itemToDelete.value = item
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  deleting.value = true
  try {
    await contactsStore.deleteContact(itemToDelete.value._id!)

    showSnackbar('Contato excluído com sucesso', 'success')
    deleteDialog.value = false
    viewDialog.value = false
  } catch {
    showSnackbar('Erro ao excluir contato', 'error')
  } finally {
    deleting.value = false
    itemToDelete.value = null
  }
}

const deleteAllRead = async () => {
  if (readCount.value === 0) return

  const confirmed = confirm(`Tem certeza que deseja excluir ${readCount.value} contato(s) lido(s)?`)
  if (!confirmed) return

  deletingAll.value = true
  try {
    await contactsStore.deleteAllRead()
    showSnackbar('Contatos lidos excluídos com sucesso', 'success')
  } catch {
    showSnackbar('Erro ao excluir contatos', 'error')
  } finally {
    deletingAll.value = false
  }
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatTime = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatFullDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  fetchContacts()
})
</script>

<style scoped>
/* Estilos específicos do ContactsAdmin - CSS comum movido para global.css */
.contacts-admin {
  padding: 0;
}

/* Contacts Table Card */
.contacts-table-card {
  background: rgba(var(--v-theme-surface-variant), 0.3) !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.1) !important;
  border-radius: 16px !important;
}

.contacts-table-card :deep(.v-card-title) {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

/* Data Table */
.contacts-table {
  background: transparent !important;
}

.contacts-table :deep(.v-data-table__th) {
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-on-surface-variant)) !important;
}

.contacts-table :deep(.v-data-table__td) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.date-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-primary {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.date-secondary {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.7;
}

.subject-cell {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.contact-detail {
  padding: 0.5rem 0;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.8;
}

.detail-value {
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.6;
}

.message-content {
  padding: 1rem;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  white-space: pre-wrap;
  word-break: break-word;
}

.email-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  transition: all 0.2s ease;
}

.email-link:hover {
  text-decoration: underline;
  opacity: 0.8;
}
</style>
