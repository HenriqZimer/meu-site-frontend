<template>
  <div class="admin-section">
    <!-- Stats Cards -->
    <AdminStatsGrid>
      <AdminStatCard
        icon="mdi-folder-multiple"
        :value="projects.length"
        label="Total de Projetos"
        color="blue"
      />
      <AdminStatCard icon="mdi-check-circle" :value="activeCount" label="Ativos" color="green" />
      <AdminStatCard
        icon="mdi-pause-circle"
        :value="inactiveCount"
        label="Inativos"
        color="orange"
      />
      <AdminStatCard icon="mdi-shape" :value="categoriesCount" label="Categorias" color="purple" />
    </AdminStatsGrid>

    <!-- Projects Table -->
    <AdminTableHeader
      title="Gerenciar Projetos"
      icon="mdi-folder-multiple"
      add-button-text="Novo Projeto"
      @add="openCreateDialog"
    >
      <v-data-table
        :headers="headers"
        :items="projects"
        :loading="loading"
        :items-per-page="10"
        class="admin-data-table"
      >
        <template #[`item.image`]="{ item }">
          <v-img :src="item.image" width="80" height="60" cover class="my-2" />
        </template>

        <template #[`item.technologies`]="{ item }">
          <v-chip-group>
            <v-chip v-for="tech in item.technologies" :key="tech" size="small">
              {{ tech }}
            </v-chip>
          </v-chip-group>
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
      :title="`${isEditing ? 'Editar' : 'Novo'} Projeto`"
      icon="mdi-folder-multiple"
      :loading="saving"
      max-width="700px"
      @confirm="saveItem"
      @cancel="closeDialog"
    >
      <v-form ref="form">
        <v-text-field
          v-model="editedItem.title"
          label="Título"
          :rules="[rules.required]"
          variant="outlined"
          class="admin-form-field"
        />

        <v-textarea
          v-model="editedItem.description"
          label="Descrição"
          :rules="[rules.required]"
          variant="outlined"
          rows="3"
          class="admin-form-field"
        />

        <v-text-field
          v-model="editedItem.image"
          label="URL da Imagem"
          :rules="[rules.required]"
          variant="outlined"
          class="admin-form-field"
        />

        <v-combobox
          v-model="editedItem.category"
          :items="categories"
          label="Categoria"
          :rules="[rules.required]"
          variant="outlined"
          class="admin-form-field"
        />

        <v-combobox
          v-model="editedItem.technologies"
          label="Tecnologias"
          multiple
          chips
          variant="outlined"
          class="admin-form-field"
        />

        <v-text-field
          v-model="editedItem.demoUrl"
          label="URL Demo"
          variant="outlined"
          class="admin-form-field"
        />

        <v-text-field
          v-model="editedItem.githubUrl"
          label="URL GitHub"
          variant="outlined"
          class="admin-form-field"
        />

        <v-text-field
          v-model="editedItem.projectDate"
          label="Data do Projeto"
          type="month"
          variant="outlined"
          hint="Projetos mais recentes aparecerão primeiro"
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

    <!-- Delete Confirmation Dialog -->
    <AdminDeleteDialog
      v-model="deleteDialog"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteDialog = false"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types/admin'
import { useAdminProjectsStore } from '~/stores/admin/projects'

const projectsStore = useAdminProjectsStore()

const headers = [
  { title: 'Imagem', key: 'image', sortable: false },
  { title: 'Título', key: 'title' },
  { title: 'Categoria', key: 'category' },
  { title: 'Tecnologias', key: 'technologies', sortable: false },
  { title: 'Status', key: 'active' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const categories = [
  'containerization',
  'infrastructure',
  'automation',
  'cloud',
  'frontend',
  'backend',
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

const defaultItem: Project = {
  title: '',
  description: '',
  image: '',
  category: '',
  technologies: [],
  demoUrl: '',
  githubUrl: '',
  projectDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
  active: true,
}

const editedItem = ref<Project>({ ...defaultItem })
const editedIndex = ref(-1)

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
}

// Computed from store
const projects = computed(() => projectsStore.allProjects)
const loading = computed(() => projectsStore.loading)
const activeCount = computed(() => projectsStore.activeCount)
const inactiveCount = computed(() => projectsStore.inactiveCount)
const categoriesCount = computed(() => projectsStore.categoriesCount)

// Fetch projects
const fetchProjects = async () => {
  try {
    await projectsStore.fetchProjects()
  } catch {
    showSnackbar('Erro ao carregar projetos', 'error')
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  editedItem.value = { ...defaultItem }
  dialog.value = true
}

const editItem = (item: Project) => {
  isEditing.value = true
  editedIndex.value = projectsStore.allProjects.indexOf(item)
  editedItem.value = { ...item }
  console.log('Editing project:', { _id: (item as any)._id, title: item.title })
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editedItem.value = { ...defaultItem }
  editedIndex.value = -1
}

const saveItem = async () => {
  if (!form.value) return

  saving.value = true
  try {
    const { _id, _createdAt, _updatedAt, __v, ...projectData } = editedItem.value as any

    if (isEditing.value && _id) {
      console.log('Atualizando projeto:', _id)
      await projectsStore.updateProject(_id, editedItem.value)
      showSnackbar('Projeto atualizado com sucesso')
    } else {
      console.log('Criando novo projeto')
      await projectsStore.createProject(projectData)
      showSnackbar('Projeto criado com sucesso')
    }

    closeDialog()
  } catch (error: any) {
    console.error('Erro ao salvar projeto:', error)
    showSnackbar(error.message || 'Erro ao salvar projeto', 'error')
  } finally {
    saving.value = false
  }
}

const toggleActive = async (item: Project) => {
  toggleLoading.value = item._id!
  try {
    await projectsStore.toggleActive(item)
    showSnackbar(`Projeto ${!item.active ? 'ativado' : 'desativado'} com sucesso`)
  } catch {
    showSnackbar('Erro ao alterar status do projeto', 'error')
  } finally {
    toggleLoading.value = null
  }
}

const deleteItem = (item: Project) => {
  editedIndex.value = projectsStore.allProjects.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await projectsStore.deleteProject(editedItem.value._id!)
    showSnackbar('Projeto excluído com sucesso')
    deleteDialog.value = false
  } catch {
    showSnackbar('Erro ao excluir projeto', 'error')
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
  fetchProjects()
})
</script>
