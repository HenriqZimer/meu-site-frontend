<template>
  <div class="admin-section">
    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-icon-wrapper blue">
              <v-icon icon="mdi-star-circle" size="32" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ skills.length }}</div>
              <div class="stat-label">Total de Skills</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-icon-wrapper green">
              <v-icon icon="mdi-check-circle" size="32" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ activeCount }}</div>
              <div class="stat-label">Ativas</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-icon-wrapper orange">
              <v-icon icon="mdi-pause-circle" size="32" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ inactiveCount }}</div>
              <div class="stat-label">Inativas</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-text>
            <div class="stat-icon-wrapper purple">
              <v-icon icon="mdi-shape" size="32" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ categoriesCount }}</div>
              <div class="stat-label">Categorias</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Skills Table -->
    <v-card class="table-card">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="d-flex align-center" style="gap: 12px;">
          <v-icon icon="mdi-star-circle" size="28" color="primary" />
          <span class="table-title">Gerenciar Skills</span>
        </div>
        <v-btn color="primary" class="action-btn" @click="openCreateDialog">
          <v-icon start>mdi-plus</v-icon>
          Nova Skill
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="skills"
          :loading="loading"
          :items-per-page="10"
          class="data-table"
        >
          <template #[`item.icon`]="{ item }">
            <v-icon :icon="item.icon" :color="item.color" size="32" />
          </template>

          <template #[`item.color`]="{ item }">
            <v-chip :style="{ backgroundColor: item.color, color: '#fff' }" size="small">
              {{ item.color }}
            </v-chip>
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
            <div class="action-buttons">
              <v-tooltip text="Editar" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon size="small" variant="tonal" color="primary" class="action-btn-icon" @click="editItem(item)">
                    <v-icon size="18">mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Excluir" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon size="small" variant="tonal" color="error" class="action-btn-icon" @click="deleteItem(item)">
                    <v-icon size="18">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialog Form -->
    <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <span>{{ isEditing ? 'Editar' : 'Nova' }} Skill</span>
        </v-card-title>

        <v-divider />

        <v-card-text class="dialog-content">
          <v-form ref="form">
            <v-text-field
              v-model="editedItem.name"
              label="Nome"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.category"
              label="Categoria"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.icon"
              label="Ícone (mdi-)"
              hint="Ex: mdi-kubernetes, mdi-docker"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.color"
              label="Cor (hex)"
              hint="Ex: #326CE5"
              :rules="[rules.required]"
              variant="outlined"
              type="color"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.bgColor"
              label="Cor de Fundo (hex)"
              hint="Ex: #e3f2fd"
              variant="outlined"
              type="color"
              class="mb-4"
            />

            <v-text-field
              v-model.number="editedItem.order"
              label="Ordem"
              type="number"
              variant="outlined"
              class="mb-4"
            />

            <v-switch
              v-model="editedItem.active"
              label="Ativo"
              color="primary"
            />
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="dialog-actions">
          <v-btn variant="text" size="large" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" variant="flat" size="large" @click="saveItem">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="450px">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <v-icon icon="mdi-alert" color="error" class="mr-2" />
          Confirmar Exclusão
        </v-card-title>
        
        <v-divider />
        
        <v-card-text class="dialog-content text-center py-6">
          Tem certeza que deseja excluir esta skill?<br>
          Esta ação não pode ser desfeita.
        </v-card-text>
        
        <v-divider />
        
        <v-card-actions class="dialog-actions">
          <v-btn variant="text" size="large" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" variant="flat" size="large" @click="confirmDelete">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { Skill } from '~/types/admin'
import { useAdminSkillsStore } from '~/stores/admin/skills'

const skillsStore = useAdminSkillsStore()

const headers = [
  { title: 'Ícone', key: 'icon', sortable: false },
  { title: 'Nome', key: 'name' },
  { title: 'Categoria', key: 'category' },
  { title: 'Cor', key: 'color', sortable: false },
  { title: 'Status', key: 'active' },
  { title: 'Ordem', key: 'order' },
  { title: 'Ações', key: 'actions', sortable: false }
]

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

const defaultItem: Skill = {
  name: '',
  category: '',
  icon: 'mdi-',
  color: '#3b82f6',
  bgColor: '#e3f2fd',
  order: 1,
  active: true
}

const editedItem = ref<Skill>({ ...defaultItem })
const editedIndex = ref(-1)

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório'
}

// Computed from store
const skills = computed(() => skillsStore.allSkills)
const loading = computed(() => skillsStore.loading)
const activeCount = computed(() => skillsStore.activeCount)
const inactiveCount = computed(() => skillsStore.inactiveCount)
const categoriesCount = computed(() => skillsStore.categoriesCount)

const fetchSkills = async () => {
  try {
    await skillsStore.fetchSkills()
  } catch (error) {
    showSnackbar('Erro ao carregar skills', 'error')
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  editedItem.value = { ...defaultItem }
  dialog.value = true
}

const editItem = (item: Skill) => {
  isEditing.value = true
  editedIndex.value = skillsStore.allSkills.indexOf(item)
  editedItem.value = { ...item }
  console.log('Editing skill:', { _id: (item as any)._id, name: item.name })
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
    const { _id, createdAt, updatedAt, __v, ...skillData } = editedItem.value as any
    
    if (isEditing.value && _id) {
      console.log('Atualizando skill:', _id)
      await skillsStore.updateSkill(_id, editedItem.value)
      showSnackbar('Skill atualizada com sucesso')
    } else {
      console.log('Criando nova skill')
      await skillsStore.createSkill(skillData)
      showSnackbar('Skill criada com sucesso')
    }

    closeDialog()
  } catch (error: any) {
    console.error('Erro ao salvar skill:', error)
    showSnackbar(error.message || 'Erro ao salvar skill', 'error')
  } finally {
    saving.value = false
  }
}

const toggleActive = async (item: Skill) => {
  toggleLoading.value = item._id!
  try {
    await skillsStore.toggleActive(item)
    showSnackbar(`Skill ${!item.active ? 'ativada' : 'desativada'} com sucesso`)
  } catch (error) {
    showSnackbar('Erro ao alterar status da skill', 'error')
  } finally {
    toggleLoading.value = null
  }
}

const deleteItem = (item: Skill) => {
  editedIndex.value = skillsStore.allSkills.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await skillsStore.deleteSkill(editedItem.value._id!)
    showSnackbar('Skill excluída com sucesso')
    deleteDialog.value = false
  } catch (error) {
    showSnackbar('Erro ao excluir skill', 'error')
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
  fetchSkills()
})
</script>

<style scoped>
.admin-section {
  padding: 0;
}

/* Stat Cards */
.stat-card {
  background: rgba(var(--v-theme-surface-variant), 0.3) !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.1) !important;
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

.stat-card :deep(.v-card-text) {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem !important;
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-icon-wrapper.blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.stat-icon-wrapper.green {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
  color: #22c55e;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}

.stat-icon-wrapper.orange {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.1));
  color: #f97316;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
}

.stat-icon-wrapper.purple {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1));
  color: #a855f7;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.8;
}

/* Table Card */
.table-card {
  background: rgba(var(--v-theme-surface-variant), 0.3) !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.1) !important;
  border-radius: 16px !important;
}

.table-card :deep(.v-card-title) {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.action-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 600 !important;
}

/* Data Table */
.data-table {
  background: transparent !important;
}

.data-table :deep(.v-data-table__th) {
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-on-surface-variant)) !important;
}

.data-table :deep(.v-data-table__td) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.action-btn-icon {
  border-radius: 50% !important;
  width: 32px !important;
  height: 32px !important;
  min-width: unset !important;
}

.action-btn-icon:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Dialog Styles */
.dialog-card {
  background: rgba(var(--v-theme-surface), 0.98) !important;
  border-radius: 16px !important;
  max-height: 85vh;
}

.dialog-title {
  padding: 1.25rem 1.5rem !important;
  background: rgba(var(--v-theme-primary), 0.05);
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.dialog-content {
  padding: 1.5rem !important;
  max-height: calc(85vh - 180px);
  overflow-y: auto;
}

.dialog-content :deep(.v-field) {
  margin-bottom: 0.5rem;
}

.dialog-actions {
  padding: 1rem 1.5rem !important;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.dialog-actions :deep(.v-btn) {
  min-width: 120px;
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 600 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-value {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .stat-icon-wrapper :deep(.v-icon) {
    font-size: 24px !important;
  }
  
  .dialog-content {
    max-height: calc(85vh - 160px);
  }
}
</style>
