<template>
  <div class="admin-section">
    <!-- Stats Cards -->
    <AdminStatsGrid>
      <AdminStatCard
        icon="mdi-star-circle"
        :value="skills.length"
        label="Total de Skills"
        color="blue"
      />
      <AdminStatCard icon="mdi-check-circle" :value="activeCount" label="Ativas" color="green" />
      <AdminStatCard
        icon="mdi-pause-circle"
        :value="inactiveCount"
        label="Inativas"
        color="orange"
      />
      <AdminStatCard icon="mdi-shape" :value="categoriesCount" label="Categorias" color="purple" />
    </AdminStatsGrid>

    <!-- Skills Table -->
    <AdminTableHeader
      title="Gerenciar Skills"
      icon="mdi-star-circle"
      add-button-text="Nova Skill"
      @add="openCreateDialog"
    >
      <v-data-table
        :headers="headers"
        :items="skills"
        :loading="loading"
        :items-per-page="10"
        class="admin-data-table"
      >
        <template #[`item.icon`]="{ item }">
          <Icon :name="item.icon" :style="{ color: item.color }" size="32" />
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
    <AdminFormDialog
      v-model="dialog"
      :title="`${isEditing ? 'Editar' : 'Nova'} Skill`"
      icon="mdi-star-circle"
      :loading="saving"
      max-width="600px"
      @confirm="saveItem"
      @cancel="closeDialog"
    >
      <v-form ref="form">
        <v-text-field
          v-model="editedItem.name"
          label="Nome"
          :rules="[rules.required]"
          variant="outlined"
          class="admin-form-field"
        />

        <v-text-field
          v-model="editedItem.category"
          label="Categoria"
          :rules="[rules.required]"
          variant="outlined"
          class="admin-form-field"
        />

        <v-text-field
          v-model="editedItem.icon"
          label="Ícone"
          hint="Ex: devicon:kubernetes, logos:docker-icon, skill-icons:jenkins-dark"
          :rules="[rules.required]"
          variant="outlined"
          class="admin-form-field"
        />

        <v-text-field
          v-model="editedItem.color"
          label="Cor (hex)"
          hint="Ex: #326CE5"
          :rules="[rules.required]"
          variant="outlined"
          type="color"
          class="admin-form-field"
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
    </AdminFormDialog>

    <!-- Delete Dialog -->
    <AdminDeleteDialog
      v-model="deleteDialog"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir esta skill? Esta ação não pode ser desfeita."
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
import type { Skill } from '~/types/admin'
import { useAdminSkillsStore } from '~/stores/admin/skills'

const skillsStore = useAdminSkillsStore()

const headers = [
  { title: 'Ícone', key: 'icon', sortable: false },
  { title: 'Nome', key: 'name' },
  { title: 'Categoria', key: 'category' },
  { title: 'Cor', key: 'color', sortable: false },
  { title: 'Status', key: 'active' },
  { title: 'Ações', key: 'actions', sortable: false },
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
  icon: '',
  color: '#3b82f6',
  bgColor: '',
  active: true,
}

const editedItem = ref<Skill>({ ...defaultItem })
const editedIndex = ref(-1)

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
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
  } catch {
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
    const { _id, _createdAt, _updatedAt, __v, ...skillData } = editedItem.value as any

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
  } catch {
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
  } catch {
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
