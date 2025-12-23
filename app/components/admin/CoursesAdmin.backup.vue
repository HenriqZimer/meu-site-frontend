<template>
  <div class="admin-section">
    <!-- Stats Cards -->
    <AdminStatsGrid>
      <AdminStatCard
        icon="mdi-school"
        :value="courses.length"
        label="Total de Cursos"
        color="blue"
      />
      <AdminStatCard icon="mdi-check-circle" :value="activeCount" label="Ativos" color="green" />
      <AdminStatCard
        icon="mdi-pause-circle"
        :value="inactiveCount"
        label="Inativos"
        color="orange"
      />
      <AdminStatCard
        icon="mdi-calendar"
        :value="uniqueYears"
        label="Anos Diferentes"
        color="purple"
      />
    </AdminStatsGrid>

    <!-- Courses Table -->
    <AdminTableHeader
      title="Gerenciar Cursos"
      icon="mdi-school"
      add-button-text="Novo Curso"
      @add="openCreateDialog"
    >
      <v-data-table
        :headers="headers"
        :items="courses"
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
          <span>{{ isEditing ? 'Editar' : 'Novo' }} Curso</span>
        </v-card-title>

        <v-divider />

        <v-card-text class="admin-dialog-content">
          <v-form ref="form">
            <v-text-field
              v-model="editedItem.name"
              label="Nome do Curso"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.platform"
              label="Plataforma"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.instructor"
              label="Instrutor"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.duration"
              label="Duração (Ex: 4.5h)"
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
              label="Link do Certificado"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="editedItem.date"
              label="Data de Conclusão"
              type="month"
              :rules="[rules.required]"
              variant="outlined"
              hint="Selecione o mês e ano em que concluiu o curso"
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
      message="Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita."
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
import type { Course } from '~/types/admin'
import { useAdminCoursesStore } from '~/stores/admin/courses'

const coursesStore = useAdminCoursesStore()

const headers = [
  { title: 'Logo', key: 'image', sortable: false },
  { title: 'Nome', key: 'name' },
  { title: 'Plataforma', key: 'platform' },
  { title: 'Instrutor', key: 'instructor' },
  { title: 'Duração', key: 'duration' },
  { title: 'Data', key: 'date' },
  { title: 'Status', key: 'active' },
  { title: 'Ações', key: 'actions', sortable: false },
]

// Use computed from store
const courses = computed(() => coursesStore.allCourses)
const loading = computed(() => coursesStore.loading)
const activeCount = computed(() => coursesStore.activeCount)
const inactiveCount = computed(() => coursesStore.inactiveCount)
const uniqueYears = computed(() => coursesStore.uniqueYears)

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
  platform: '',
  instructor: '',
  duration: '',
  image: '',
  link: '',
  date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
  active: true,
}

const editedItem = ref({ ...defaultItem })
const editedIndex = ref(-1)

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
}

const fetchCourses = async () => {
  try {
    await coursesStore.fetchCourses()
  } catch {
    showSnackbar('Erro ao carregar cursos', 'error')
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  editedItem.value = { ...defaultItem }
  dialog.value = true
}

const editItem = (item: Course) => {
  isEditing.value = true
  editedIndex.value = coursesStore.allCourses.indexOf(item)
  editedItem.value = { ...item }
  console.log('Editing course:', { _id: (item as any)._id, name: item.name })
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
    const { _id, _createdAt, _updatedAt, __v, ...courseData } = editedItem.value as any

    if (isEditing.value && _id) {
      console.log('Atualizando curso:', _id)
      await coursesStore.updateCourse(_id, courseData)
      showSnackbar('Curso atualizado com sucesso')
    } else {
      console.log('Criando novo curso')
      await coursesStore.createCourse(courseData)
      showSnackbar('Curso criado com sucesso')
    }

    closeDialog()
  } catch (error: any) {
    console.error('Erro ao salvar curso:', error)
    const errorMsg = error?.message || 'Erro ao salvar curso'
    showSnackbar(errorMsg, 'error')
  } finally {
    saving.value = false
  }
}

const toggleActive = async (item: Course) => {
  toggleLoading.value = (item as any)._id!
  try {
    await coursesStore.toggleActive(item)
    showSnackbar(`Curso ${!item.active ? 'ativado' : 'desativado'} com sucesso`)
  } catch {
    showSnackbar('Erro ao alterar status do curso', 'error')
  } finally {
    toggleLoading.value = null
  }
}

const deleteItem = (item: Course) => {
  editedIndex.value = coursesStore.allCourses.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await coursesStore.deleteCourse((editedItem.value as any)._id)
    showSnackbar('Curso excluído com sucesso')
    deleteDialog.value = false
  } catch {
    showSnackbar('Erro ao excluir curso', 'error')
  } finally {
    deleting.value = false
  }
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()

    const months = [
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
    return `${months[month - 1]}/${year}`
  } catch {
    return '-'
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
/* Estilos específicos do CoursesAdmin - CSS comum movido para global.css */
</style>
