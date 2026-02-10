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
      <Icon :name="item.icon" size="32" />
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

      <div class="icon-picker-section">
        <div class="icon-preview-container">
          <div class="icon-preview-label">Ícone Selecionado:</div>
          <div class="icon-preview-box">
            <IconWrapper v-if="item.icon" :icon="item.icon" :size="48" />
            <div v-else class="icon-placeholder">Nenhum ícone selecionado</div>
          </div>
        </div>
        <IconPicker v-model="item.icon" />
      </div>

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
    { title: 'Status', key: 'active', align: 'center' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ] as const,
  ...crud,
}
</script>

<style scoped>
.icon-picker-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.icon-preview-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.icon-preview-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;
}

.icon-preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  border: 2px dashed rgba(59, 130, 246, 0.3);
}

.icon-placeholder {
  color: #64748b;
  font-style: italic;
}
</style>
