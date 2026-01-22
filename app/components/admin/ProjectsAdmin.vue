<template>
  <AdminCrudModule
    :table-title="crudConfig.tableTitle"
    :table-icon="crudConfig.tableIcon"
    :singular-name="crudConfig.singularName"
    :add-button-text="crudConfig.addButtonText"
    :delete-message="crudConfig.deleteMessage"
    :default-item="crudConfig.defaultItem"
    :headers="crudConfig.headers"
    :items="crud.items.value"
    :loading="crud.loading.value"
    :stats="crud.stats.value"
    :on-fetch="crud.onFetch"
    :on-create="crud.onCreate"
    :on-update="crud.onUpdate"
    :on-delete="crud.onDelete"
    :on-toggle-active="crud.onToggleActive"
  >
    <!-- Stats Cards -->
    <template #stats>
      <AdminStatCard
        icon="mdi-folder-multiple"
        :value="crud.items.value.length"
        label="Total de Projetos"
        color="blue"
      />
      <AdminStatCard
        icon="mdi-check-circle"
        :value="projectsStore.activeCount"
        label="Ativos"
        color="green"
      />
      <AdminStatCard
        icon="mdi-pause-circle"
        :value="projectsStore.inactiveCount"
        label="Inativos"
        color="orange"
      />
      <AdminStatCard
        icon="mdi-shape"
        :value="projectsStore.categoriesCount"
        label="Categorias"
        color="purple"
      />
    </template>

    <!-- Custom Table Columns -->
    <template #[`item.image`]="{ item }">
      <v-img :src="item.image" width="40" height="40" cover class="my-1 mx-auto" />
    </template>

    <template #[`item.technologies`]="{ item }">
      <div style="display: flex; justify-content: center; width: 100%">
        <v-chip-group class="admin-chip-group">
          <v-chip v-for="tech in item.technologies" :key="tech" size="small">
            {{ tech }}
          </v-chip>
        </v-chip-group>
      </div>
    </template>

    <!-- Form Fields -->
    <template #form="{ item, rules }">
      <v-text-field
        v-model="item.title"
        label="Título"
        :rules="[rules.required]"
        variant="outlined"
        class="admin-form-field"
      />

      <v-textarea
        v-model="item.description"
        label="Descrição"
        :rules="[rules.required]"
        variant="outlined"
        rows="3"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.image"
        label="URL da Imagem"
        :rules="[rules.required]"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.category"
        label="Categoria"
        :rules="[rules.required]"
        variant="outlined"
        hint="Digite a categoria do projeto (ex: containerization, cloud, frontend)"
        class="admin-form-field"
      />

      <v-combobox
        v-model="item.technologies"
        label="Tecnologias"
        multiple
        chips
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.demoUrl"
        label="URL Demo"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.githubUrl"
        label="URL GitHub"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.projectDate"
        label="Data do Projeto"
        type="month"
        variant="outlined"
        hint="Projetos mais recentes aparecerão primeiro"
        class="admin-form-field"
      />

      <v-switch
        v-model="item.active"
        label="Ativo"
        color="success"
        hide-details
        density="compact"
        inset
      />
    </template>
  </AdminCrudModule>
</template>

<script setup lang="ts">
import type { Project } from '~/types/admin'
import { useAdminProjectsStore } from '~/stores/admin/projects'

const projectsStore = useAdminProjectsStore()
const crud = useAdminCrud<Project>(projectsStore)

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

const crudConfig = {
  tableTitle: 'Gerenciar Projetos',
  tableIcon: 'mdi-folder-multiple',
  singularName: 'Projeto',
  addButtonText: 'Novo Projeto',
  deleteMessage: 'este projeto',
  defaultItem,
  headers: [
    { title: 'Imagem', key: 'image', sortable: false, align: 'center' },
    { title: 'Título', key: 'title', align: 'center' },
    { title: 'Categoria', key: 'category', align: 'center' },
    { title: 'Tecnologias', key: 'technologies', sortable: false, align: 'center' },
    { title: 'Status', key: 'active', align: 'center' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ] as const,
  ...crud,
}
</script>
