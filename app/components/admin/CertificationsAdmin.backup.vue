<template>
  <div class="admin-section">
    <!-- Stats Cards -->
    <AdminStatsGrid>
      <AdminStatCard
        icon="mdi-certificate"
        :value="certifications.length"
        label="Total de Certificações"
        color="blue"
      />
      <AdminStatCard icon="mdi-check-circle" :value="activeCount" label="Ativas" color="green" />
      <AdminStatCard
        icon="mdi-pause-circle"
        :value="inactiveCount"
        label="Inativas"
        color="orange"
      />
      <AdminStatCard icon="mdi-school" :value="totalSkills" label="Total Skills" color="purple" />
    </AdminStatsGrid>

    <!-- Certifications Table -->
    <AdminTableHeader
      title="Gerenciar Certificações"
      icon="mdi-certificate"
      add-button-text="Nova Certificação"
      @add="openCreateDialog"
    >
      <v-data-table
        :headers="headers"
        :items="certifications"
        :loading="loading"
        :items-per-page="10"
        class="admin-data-table"
      >
        <template #[`item.image`]="{ item }">
          <v-img :src="item.image" width="60" height="60" cover class="my-2" />
        </template>

        <template #[`item.date`]="{ item }">
          {{ formatDate(item.date) }}
        </template>

        <template #[`item.active`]="{ item }">
          <v-switch
            :model-value="item.active"
            color="success"
            hide-details
            density="compact"
            inset
            :loading="toggleLoading === item._id"
            @update:model-value="toggleActive(item)"
          />
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="admin-action-buttons">
            <v-tooltip text="Editar" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="small"
                  variant="tonal"
                  color="primary"
                  class="admin-action-btn-icon"
                  @click="editItem(item)"
                >
                  <v-icon size="18">mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Excluir" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="small"
                  variant="tonal"
                  color="error"
                  class="admin-action-btn-icon"
                  @click="deleteItem(item)"
                >
                  <v-icon size="18">mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </AdminTableHeader>

    <!-- Dialog Form -->
    <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
      <v-card class="admin-dialog-card">
        <v-card-title class="admin-dialog-title">
          <span>{{ isEditing ? 'Editar' : 'Nova' }} Certificação</span>
        </v-card-title>

        <v-divider />

        <v-card-text class="admin-dialog-content">
          <v-form ref="form">
            <v-text-field
              v-model="editedItem.name"
              label="Nome"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.issuer"
              label="Emissor"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.image"
              label="URL da Imagem"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.link"
              label="Link da Certificação"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.date"
              label="Data de Obtenção"
              type="month"
              :rules="[rules.required]"
              variant="outlined"
              hint="Selecione o mês e ano em que obteve a certificação"
              class="mb-4"
            />

            <v-text-field
              v-model.number="editedItem.skills"
              label="Número de Skills"
              type="number"
              variant="outlined"
              class="mb-4"
            />

            <v-switch
              v-model="editedItem.active"
              label="Ativo"
              color="success"
              hide-details
              density="compact"
              inset
            />
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="admin-dialog-actions">
          <v-btn variant="text" size="large" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" variant="flat" size="large" @click="saveItem">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <AdminDeleteDialog
      v-model="deleteDialog"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir esta certificação? Esta ação não pode ser desfeita."
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteDialog = false"
    />

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { Certification } from '~/types/admin'
import { useAdminCertificationsStore } from '~/stores/admin/certifications'

const certificationsStore = useAdminCertificationsStore()

const headers = [
  { title: 'Badge', key: 'image', sortable: false },
  { title: 'Nome', key: 'name' },
  { title: 'Emissor', key: 'issuer' },
  { title: 'Data', key: 'date' },
  { title: 'Skills', key: 'skills' },
  { title: 'Status', key: 'active' },
  { title: 'Ações', key: 'actions', sortable: false },
]

// Use computed from store
const certifications = computed(() => certificationsStore.allCertifications)
const loading = computed(() => certificationsStore.loading)
const activeCount = computed(() => certificationsStore.activeCount)
const inactiveCount = computed(() => certificationsStore.inactiveCount)
const totalSkills = computed(() => certificationsStore.totalSkills)

const dialog = ref(false)
const deleteDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const isEditing = ref(false)
const form = ref(null)
const toggleLoading = ref<string | null>(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const defaultItem = {
  name: '',
  issuer: '',
  image: '',
  link: '',
  date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
  skills: 0,
  active: true,
}

const editedItem = ref({ ...defaultItem })
const editedIndex = ref(-1)

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
}

// Função para formatar data YYYY-MM para Mes/Ano
function formatDate(date: string): string {
  if (!date) return '-'
  const [year, month] = date.split('-')
  if (!year || !month) return '-'
  const monthNames = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]
  return `${monthNames[parseInt(month) - 1]}/${year}`
}

const fetchCertifications = async () => {
  try {
    await certificationsStore.fetchCertifications()
  } catch {
    showSnackbar('Erro ao carregar certificações', 'error')
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  editedItem.value = { ...defaultItem }
  dialog.value = true
}

const editItem = (item: Certification) => {
  isEditing.value = true
  editedIndex.value = certificationsStore.allCertifications.indexOf(item)
  editedItem.value = { ...item }
  console.log('Editing certification:', { _id: (item as any)._id, name: item.name })
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editedItem.value = { ...defaultItem }
  editedIndex.value = -1
}

const saveItem = async () => {
  saving.value = true
  try {
    const { _id, _createdAt, _updatedAt, __v, ...certificationData } = editedItem.value as any

    if (isEditing.value && _id) {
      console.log('Atualizando certificação:', _id)
      await certificationsStore.updateCertification(_id, certificationData)
      showSnackbar('Certificação atualizada com sucesso')
    } else {
      console.log('Criando nova certificação')
      await certificationsStore.createCertification(certificationData)
      showSnackbar('Certificação criada com sucesso')
    }

    closeDialog()
  } catch (error: any) {
    console.error('Erro ao salvar certificação:', error)
    const errorMsg = error?.message || 'Erro ao salvar certificação'
    showSnackbar(errorMsg, 'error')
  } finally {
    saving.value = false
  }
}

const toggleActive = async (item: Certification) => {
  toggleLoading.value = (item as any)._id!
  try {
    await certificationsStore.toggleActive(item)
    showSnackbar(`Certificação ${!item.active ? 'ativada' : 'desativada'} com sucesso`)
  } catch {
    showSnackbar('Erro ao alterar status da certificação', 'error')
  } finally {
    toggleLoading.value = null
  }
}

const deleteItem = (item: Certification) => {
  editedIndex.value = certificationsStore.allCertifications.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await certificationsStore.deleteCertification((editedItem.value as any)._id)
    showSnackbar('Certificação excluída com sucesso')
    deleteDialog.value = false
  } catch {
    showSnackbar('Erro ao excluir certificação', 'error')
  } finally {
    deleting.value = false
  }
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  fetchCertifications()
})
</script>

<style scoped>
/* Estilos específicos do CertificationsAdmin - CSS comum movido para global.css */
</style>
