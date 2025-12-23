<template>
  <div class="admin-section">
    <!-- Stats Cards -->
    <AdminStatsGrid>
      <slot name="stats" :items="items" :stats="stats" />
    </AdminStatsGrid>

    <!-- Table -->
    <AdminTableHeader
      :title="tableTitle"
      :icon="tableIcon"
      :add-button-text="addButtonText"
      @add="openCreateDialog"
    >
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :items-per-page="itemsPerPage"
        class="admin-data-table"
      >
        <!-- Custom column templates -->
        <template v-for="(_, slot) in $slots" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>

        <!-- Active/Status column with toggle switch -->
        <template v-if="hasActiveColumn" #[`item.active`]="{ item }">
          <div class="d-flex justify-center">
            <v-switch
              :model-value="item.active"
              color="success"
              hide-details
              density="compact"
              inset
              :loading="toggleLoading === item._id"
              @update:model-value="toggleActive(item)"
            />
          </div>
        </template>

        <!-- Action buttons column (Edit and Delete) -->
        <template #[`item.actions`]="{ item }">
          <div class="admin-action-buttons">
            <v-tooltip text="Editar" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
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
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
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

    <!-- Form Dialog -->
    <AdminFormDialog
      v-model="dialog"
      :title="`${isEditing ? 'Editar' : formCreateTitle} ${singularName}`"
      :icon="tableIcon"
      :loading="saving"
      :max-width="formMaxWidth"
      @confirm="saveItem"
      @cancel="closeDialog"
    >
      <v-form ref="formRef">
        <slot name="form" :item="editedItem" :is-editing="isEditing" :rules="rules" />
      </v-form>
    </AdminFormDialog>

    <!-- Delete Confirmation Dialog -->
    <AdminDeleteDialog
      v-model="deleteDialog"
      :title="`Confirmar Exclusão`"
      :message="`Tem certeza que deseja excluir ${deleteMessage}? Esta ação não pode ser desfeita.`"
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

<script setup lang="ts" generic="T extends Record<string, any>">
import type { VDataTable } from 'vuetify/components'

interface Props {
  // Table config
  tableTitle: string
  tableIcon: string
  headers: InstanceType<typeof VDataTable>['$props']['headers']

  // Form config
  singularName: string
  formCreateTitle?: string
  formMaxWidth?: string
  deleteMessage?: string
  addButtonText?: string

  // Data
  items: T[]
  loading?: boolean
  itemsPerPage?: number

  // Features
  hasActiveColumn?: boolean

  // Stats (computados no componente pai)
  stats?: Record<string, any>

  // Default item para criar novo
  defaultItem: T

  // Funções CRUD do store
  onFetch: () => Promise<void>
  onCreate: (item: Partial<T>) => Promise<void>
  onUpdate: (id: string, item: Partial<T>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onToggleActive?: (item: T) => Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  stats: () => ({}),
  onToggleActive: undefined,
  formCreateTitle: 'Novo',
  formMaxWidth: '700px',
  deleteMessage: 'este item',
  addButtonText: 'Adicionar',
  loading: false,
  itemsPerPage: 10,
  hasActiveColumn: true,
})

// Watch para debug
watch(
  () => props.items,
  newItems => {
    console.log('📊 [AdminCrudModule] Items changed:', newItems?.length, newItems)
  },
  { immediate: true, deep: true }
)

watch(
  () => props.loading,
  newLoading => {
    console.log('⏳ [AdminCrudModule] Loading changed:', newLoading)
  },
  { immediate: true }
)

// State
const dialog = ref(false)
const deleteDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const isEditing = ref(false)
const formRef = ref<any>(null)
const toggleLoading = ref<string | null>(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const editedItem = ref<T>({ ...props.defaultItem })
const editedIndex = ref(-1)

// Validation rules
const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido',
  url: (v: string) =>
    !v || /^https?:\/\/.+/.test(v) || 'URL inválida (deve começar com http:// ou https://)',
}

// Methods
const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const openCreateDialog = () => {
  isEditing.value = false
  editedItem.value = { ...props.defaultItem }
  dialog.value = true
}

const editItem = (item: T) => {
  isEditing.value = true
  editedIndex.value = props.items.indexOf(item)
  editedItem.value = { ...item }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editedItem.value = { ...props.defaultItem }
  editedIndex.value = -1
}

const saveItem = async () => {
  if (!formRef.value) return

  saving.value = true
  try {
    // Remove campos internos do MongoDB/sistema
    const { _id, _createdAt, _updatedAt, __v, ...itemData } = editedItem.value as any

    if (isEditing.value && _id) {
      await props.onUpdate(_id, editedItem.value)
      showSnackbar(`${props.singularName} atualizado com sucesso`)
    } else {
      await props.onCreate(itemData)
      showSnackbar(`${props.singularName} criado com sucesso`)
    }

    closeDialog()
  } catch (error: any) {
    console.error(`Erro ao salvar ${props.singularName}:`, error)
    showSnackbar(error.message || `Erro ao salvar ${props.singularName}`, 'error')
  } finally {
    saving.value = false
  }
}

const toggleActive = async (item: T) => {
  if (!props.onToggleActive) return

  toggleLoading.value = (item as any)._id
  try {
    await props.onToggleActive(item)
    showSnackbar(
      `${props.singularName} ${!(item as any).active ? 'ativado' : 'desativado'} com sucesso`
    )
  } catch (error) {
    console.error(`Erro ao alterar status:`, error)
    showSnackbar(`Erro ao alterar status`, 'error')
  } finally {
    toggleLoading.value = null
  }
}

const deleteItem = (item: T) => {
  editedIndex.value = props.items.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await props.onDelete((editedItem.value as any)._id)
    showSnackbar(`${props.singularName} excluído com sucesso`)
    deleteDialog.value = false
  } catch (error) {
    console.error(`Erro ao excluir:`, error)
    showSnackbar(`Erro ao excluir ${props.singularName}`, 'error')
  } finally {
    deleting.value = false
  }
}

// Fetch data on mount
onMounted(async () => {
  try {
    await props.onFetch()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    showSnackbar('Erro ao carregar dados', 'error')
  }
})

// Expose methods que podem ser úteis para o componente pai
defineExpose({
  openCreateDialog,
  showSnackbar,
})
</script>

<style scoped>
.admin-data-table :deep(td),
.admin-data-table :deep(th) {
  text-align: center !important;
}

.admin-data-table :deep(.v-data-table__td),
.admin-data-table :deep(.v-data-table__th) {
  text-align: center !important;
}
</style>
