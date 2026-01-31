<template>
  <div class="admin-section">
    <!-- Stats Cards -->
    <AdminStatsGrid>
      <AdminStatCard
        icon="mdi-email"
        :value="crud.items.value.length"
        label="Total de Contatos"
        color="blue"
      />
      <AdminStatCard
        icon="mdi-email-alert"
        :value="contactsStore.unreadCount"
        label="Não Lidos"
        color="orange"
      />
      <AdminStatCard
        icon="mdi-email-check"
        :value="contactsStore.readCount"
        label="Lidos"
        color="green"
      />
      <AdminStatCard
        icon="mdi-calendar-today"
        :value="contactsStore.todayCount"
        label="Hoje"
        color="purple"
      />
    </AdminStatsGrid>

    <!-- Contacts Table -->
    <AdminTableHeader
      title="Mensagens de Contato"
      icon="mdi-email-multiple"
      :show-add-button="false"
    >
      <v-data-table
        :headers="headers"
        :items="crud.items.value"
        :loading="crud.loading.value"
        :items-per-page="10"
        class="admin-data-table"
      >
        <template #[`item.read`]="{ item }">
          <v-chip :color="(item as any).read ? 'success' : 'warning'" size="small">
            {{ (item as any).read ? 'Lida' : 'Não Lida' }}
          </v-chip>
        </template>

        <template #[`item.createdAt`]="{ item }">
          {{ formatDate((item as any).createdAt || '') }}
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="admin-action-buttons">
            <v-tooltip text="Ver Detalhes" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  icon
                  size="small"
                  variant="tonal"
                  color="info"
                  class="admin-action-btn-icon"
                  @click="viewDetails(item as Contact)"
                >
                  <v-icon size="18">mdi-eye</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip
              :text="(item as any).read ? 'Marcar como Não Lida' : 'Marcar como Lida'"
              location="top"
            >
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  icon
                  size="small"
                  variant="tonal"
                  color="primary"
                  class="admin-action-btn-icon"
                  @click="toggleRead(item as Contact)"
                >
                  <v-icon size="18">{{
                    (item as any).read ? 'mdi-email' : 'mdi-email-check'
                  }}</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Excluir" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  icon
                  size="small"
                  variant="tonal"
                  color="error"
                  class="admin-action-btn-icon"
                  @click="deleteItem(item as Contact)"
                >
                  <v-icon size="18">mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </AdminTableHeader>

    <!-- Details Dialog -->
    <AdminFormDialog
      v-model="detailsDialog"
      title="Detalhes da Mensagem"
      icon="mdi-email-open"
      max-width="600px"
      confirm-text="Responder"
      cancel-text="Fechar"
      @confirm="replyToEmail"
      @cancel="detailsDialog = false"
    >
      <div v-if="selectedContact" class="contact-details">
        <div class="detail-row">
          <strong>Nome:</strong>
          <span>{{ selectedContact.name }}</span>
        </div>
        <div class="detail-row">
          <strong>E-mail:</strong>
          <a :href="`mailto:${selectedContact.email}`">{{ selectedContact.email }}</a>
        </div>
        <div class="detail-row">
          <strong>Data:</strong>
          <span>{{ formatDate(selectedContact.createdAt || '') }}</span>
        </div>
        <div class="detail-row">
          <strong>Status:</strong>
          <v-chip :color="selectedContact.read ? 'success' : 'warning'" size="small">
            {{ selectedContact.read ? 'Lida' : 'Não Lida' }}
          </v-chip>
        </div>
        <v-divider class="my-4" />
        <div class="detail-row message-content">
          <strong>Mensagem:</strong>
          <p class="message-text">{{ selectedContact.message }}</p>
        </div>
      </div>
    </AdminFormDialog>

    <!-- Delete Confirmation Dialog -->
    <AdminDeleteDialog
      v-model="deleteDialog"
      title="Confirmar Exclusão"
      :message="deleteMessage"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteDialog = false"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      <div style="text-align: center; width: 100%">{{ snackbarText }}</div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '~/types/admin'
import { useAdminContactsStore } from '~/stores/admin/contacts'

const contactsStore = useAdminContactsStore()
const crud = useAdminCrud<Contact>(contactsStore)

const headers = [
  { title: 'Nome', key: 'name', align: 'center' },
  { title: 'E-mail', key: 'email', align: 'center' },
  { title: 'Data', key: 'createdAt', align: 'center' },
  { title: 'Status', key: 'read', align: 'center' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
] as const

const detailsDialog = ref(false)
const deleteDialog = ref(false)
const deleting = ref(false)
const selectedContact = ref<Contact | null>(null)
const deleteMode = ref<'single' | 'all'>('single')

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const deleteMessage = computed(() => {
  if (deleteMode.value === 'all') {
    return 'Tem certeza que deseja excluir TODAS as mensagens LIDAS? Esta ação não pode ser desfeita.'
  }
  return 'Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.'
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
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

const viewDetails = async (item: Contact) => {
  selectedContact.value = item
  detailsDialog.value = true

  // Mark as read when viewing
  if (!item.read && item._id) {
    try {
      await contactsStore.toggleRead(item._id)
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }
}

const replyToEmail = () => {
  if (!selectedContact.value?.email) return

  const link = document.createElement('a')
  link.href = `mailto:${selectedContact.value.email}`
  link.click()
}

const toggleRead = async (item: Contact) => {
  if (!item._id) return

  try {
    await contactsStore.toggleRead(item._id)
    showSnackbar(`Mensagem marcada como ${item.read ? 'não lida' : 'lida'}`)
  } catch (error) {
    console.error('Erro ao alterar status:', error)
    showSnackbar('Erro ao alterar status', 'error')
  }
}

const deleteItem = (item: Contact) => {
  selectedContact.value = item
  deleteMode.value = 'single'
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    if (deleteMode.value === 'all') {
      await contactsStore.deleteAllRead()
      showSnackbar('Mensagens lidas foram excluídas')
    } else if (selectedContact.value?._id) {
      await crud.onDelete(selectedContact.value._id)
      showSnackbar('Mensagem excluída com sucesso')
    }
    deleteDialog.value = false
  } catch (error) {
    console.error('Erro ao excluir:', error)
    showSnackbar('Erro ao excluir mensagem(ns)', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  try {
    await crud.onFetch()
  } catch (error) {
    console.error('Erro ao carregar contatos:', error)
    showSnackbar('Erro ao carregar contatos', 'error')
  }
})
</script>

<style scoped>
.contact-details {
  padding: 0.5rem 0;
}

.detail-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.detail-row strong {
  min-width: 100px;
  color: rgb(var(--v-theme-primary));
}

.detail-row.message-content {
  flex-direction: column;
  gap: 0.5rem;
}

.message-text {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 1rem;
  border-radius: 8px;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
  margin: 0;
}
</style>
