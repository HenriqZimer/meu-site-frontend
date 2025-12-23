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
        icon="mdi-certificate"
        :value="crud.items.value.length"
        label="Total de Certificações"
        color="blue"
      />
      <AdminStatCard
        icon="mdi-check-circle"
        :value="certificationsStore.activeCount"
        label="Ativas"
        color="green"
      />
      <AdminStatCard
        icon="mdi-pause-circle"
        :value="certificationsStore.inactiveCount"
        label="Inativas"
        color="orange"
      />
      <AdminStatCard
        icon="mdi-school"
        :value="certificationsStore.totalSkills"
        label="Total Skills"
        color="purple"
      />
    </template>

    <!-- Custom Table Columns -->
    <template #[`item.image`]="{ item }">
      <v-img :src="item.image" width="40" height="40" cover class="my-1 mx-auto" />
    </template>

    <template #[`item.date`]="{ item }">
      {{ formatDate(item.date) }}
    </template>

    <!-- Form Fields -->
    <template #form="{ item, rules }">
      <v-text-field
        v-model="item.name"
        label="Nome"
        :rules="[rules.required]"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.issuer"
        label="Emissor"
        :rules="[rules.required]"
        variant="outlined"
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
        v-model="item.link"
        label="URL da Credencial"
        variant="outlined"
        class="admin-form-field"
      />

      <v-text-field
        v-model="item.date"
        label="Data de Emissão"
        type="month"
        :rules="[rules.required]"
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
import type { Certification } from '~/types/admin'
import { useAdminCertificationsStore } from '~/stores/admin/certifications'

const certificationsStore = useAdminCertificationsStore()
const crud = useAdminCrud<Certification>(certificationsStore)

const formatDate = (date: string) => {
  if (!date) return ''
  const [year, month] = date.split('-')
  if (!month || !year) return date
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

const defaultItem: Certification = {
  name: '',
  issuer: '',
  date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
  image: '',
  link: '',
  skills: 0,
  active: true,
}

const crudConfig = {
  tableTitle: 'Gerenciar Certificações',
  tableIcon: 'mdi-certificate',
  singularName: 'Certificação',
  addButtonText: 'Nova Certificação',
  deleteMessage: 'esta certificação',
  formMaxWidth: '600px',
  defaultItem,
  headers: [
    { title: 'Imagem', key: 'image', sortable: false, align: 'center' },
    { title: 'Nome', key: 'name', align: 'center' },
    { title: 'Emissor', key: 'issuer', align: 'center' },
    { title: 'Data', key: 'date', align: 'center' },
    { title: 'Status', key: 'active', align: 'center' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ] as const,
  ...crud,
}
</script>
