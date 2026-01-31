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
        icon="mdi-star-circle"
        :value="crud.items.value.length"
        label="Total de Skills"
        color="blue"
      />
      <AdminStatCard
        icon="mdi-check-circle"
        :value="skillsStore.activeCount"
        label="Ativas"
        color="green"
      />
      <AdminStatCard
        icon="mdi-pause-circle"
        :value="skillsStore.inactiveCount"
        label="Inativas"
        color="orange"
      />
      <AdminStatCard
        icon="mdi-shape"
        :value="skillsStore.categoriesCount"
        label="Categorias"
        color="purple"
      />
    </template>

    <!-- Custom Table Columns -->
    <template #[`item.icon`]="{ item }">
      <Icon :name="item.icon" :style="{ color: item.color }" size="32" />
    </template>

    <template #[`item.color`]="{ item }">
      <v-chip :style="{ backgroundColor: item.color, color: '#fff' }" size="small">
        {{ item.color }}
      </v-chip>
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
        v-model="item.category"
        label="Categoria"
        :rules="[rules.required]"
        variant="outlined"
        class="admin-form-field"
      />

      <div class="d-flex flex-column gap-2">
        <v-text-field
          v-model="item.icon"
          label="Ícone"
          hint="Ex: devicon:kubernetes, logos:docker-icon, skill-icons:jenkins-dark"
          :rules="[rules.required]"
          variant="outlined"
          class="admin-form-field"
        >
          <template #prepend-inner>
            <IconWrapper v-if="item.icon" :icon="item.icon" :size="24" class="mr-2" />
          </template>
        </v-text-field>
        <IconPicker v-model="item.icon" />
      </div>

      <v-text-field
        v-model="item.color"
        label="Cor (hex)"
        hint="Ex: #326CE5"
        :rules="[rules.required]"
        variant="outlined"
        type="color"
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
import type { Skill } from '~/types/admin'
import { useAdminSkillsStore } from '~/stores/admin/skills'

const skillsStore = useAdminSkillsStore()
const crud = useAdminCrud<Skill>(skillsStore)

const defaultItem: Skill = {
  name: '',
  category: '',
  icon: '',
  color: '#3B82F6',
  active: true,
}

const crudConfig = {
  tableTitle: 'Gerenciar Skills',
  tableIcon: 'mdi-star-circle',
  singularName: 'Skill',
  addButtonText: 'Nova Skill',
  deleteMessage: 'esta skill',
  formMaxWidth: '600px',
  defaultItem,
  headers: [
    { title: 'Ícone', key: 'icon', sortable: false, align: 'center' },
    { title: 'Nome', key: 'name', align: 'center' },
    { title: 'Categoria', key: 'category', align: 'center' },
    { title: 'Cor', key: 'color', sortable: false, align: 'center' },
    { title: 'Status', key: 'active', align: 'center' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ] as const,
  ...crud,
}
</script>
