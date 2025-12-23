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
        icon="mdi-school"
        :value="crud.items.value.length"
        label="Total de Cursos"
        color="blue"
      />
      <AdminStatCard
        icon="mdi-check-circle"
        :value="coursesStore.activeCount"
        label="Ativos"
        color="green"
      />
      <AdminStatCard
        icon="mdi-pause-circle"
        :value="coursesStore.inactiveCount"
        label="Inativos"
        color="orange"
      />
      <AdminStatCard
        icon="mdi-calendar"
        :value="coursesStore.uniqueYears"
        label="Anos Diferentes"
        color="purple"
      />
    </template>

    <!-- Custom Table Columns -->
    <template #[`item.image`]="{ item }">
      <v-img :src="item.image" width="40" height="40" cover class="my-1 mx-auto" />
    </template>

    <!-- Form Fields -->
    <template #form="{ item, rules }">
      <v-text-field
        v-model="item.name"
        label="Nome do Curso"
        :rules="[rules.required]"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.platform"
        label="Plataforma"
        :rules="[rules.required]"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.instructor"
        label="Instrutor"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.duration"
        label="Duração"
        hint="Ex: 40 horas"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.image"
        label="URL da Imagem"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.link"
        label="URL do Certificado"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.date"
        label="Data de Conclusão"
        type="month"
        variant="outlined"
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
import type { Course } from '~/types/admin'
import { useAdminCoursesStore } from '~/stores/admin/courses'

const coursesStore = useAdminCoursesStore()
const crud = useAdminCrud<Course>(coursesStore)

const defaultItem: Course = {
  name: '',
  platform: '',
  instructor: '',
  duration: '',
  image: '',
  link: '',
  date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
  active: true,
}

const crudConfig = {
  tableTitle: 'Gerenciar Cursos',
  tableIcon: 'mdi-school',
  singularName: 'Curso',
  addButtonText: 'Novo Curso',
  deleteMessage: 'este curso',
  formMaxWidth: '600px',
  defaultItem,
  headers: [
    { title: 'Imagem', key: 'image', sortable: false, align: 'center' },
    { title: 'Nome', key: 'name', align: 'center' },
    { title: 'Plataforma', key: 'platform', align: 'center' },
    { title: 'Instrutor', key: 'instructor', align: 'center' },
    { title: 'Duração', key: 'duration', align: 'center' },
    { title: 'Status', key: 'active', align: 'center' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ] as const,
  ...crud,
}
</script>
