<template>
  <v-app :theme="'dark'">
    <div class="admin-page">
      <!-- Login Screen -->
      <AdminLoginForm
        v-if="!isAuthenticated"
        v-model:username="loginForm.username"
        v-model:password="loginForm.password"
        :loading="loading"
        :error-message="loginError"
        @submit="handleLogin"
      />

      <!-- Admin Content -->
      <div v-else class="admin-layout">
        <!-- Header fixo no topo -->
        <div class="admin-header-wrapper">
          <AdminLayoutAdminHeader />
        </div>

        <!-- Conteúdo com sidebar e main -->
        <div class="admin-main-wrapper">
          <!-- Sidebar com menu de navegação expansível -->
          <v-navigation-drawer
            permanent
            rail
            class="admin-sidebar"
            color="rgba(15, 23, 42, 0.95)"
            :width="280"
            :rail-width="72"
            expand-on-hover
          >
            <!-- Menu de navegação -->
            <v-list class="pa-2" density="compact">
              <v-list-item
                v-for="tab in adminTabs"
                :key="tab.value"
                :value="tab.value"
                :active="activeTab === tab.value"
                :class="['sidebar-item', { 'sidebar-item-active': activeTab === tab.value }]"
                @click="activeTab = tab.value"
              >
                <template #prepend>
                  <v-icon :icon="tab.icon" size="24" />
                </template>
                <v-list-item-title class="sidebar-title">
                  {{ tab.label }}
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <!-- Botão de logout fixo no rodapé -->
            <template #append>
              <div class="sidebar-footer">
                <v-divider class="mb-2" />
                <v-list-item class="sidebar-logout-item" @click="handleLogout">
                  <template #prepend>
                    <v-icon icon="mdi-logout" size="24" />
                  </template>
                  <v-list-item-title class="sidebar-title"> Sair </v-list-item-title>
                </v-list-item>
              </div>
            </template>
          </v-navigation-drawer>

          <!-- Área de conteúdo principal -->
          <v-main class="admin-main-content">
            <div class="content-wrapper">
              <v-window v-model="activeTab">
                <!-- Projects Tab -->
                <v-window-item value="projects">
                  <AdminProjectsAdmin />
                </v-window-item>

                <!-- Skills Tab -->
                <v-window-item value="skills">
                  <AdminSkillsAdmin />
                </v-window-item>

                <!-- Certifications Tab -->
                <v-window-item value="certifications">
                  <AdminCertificationsAdmin />
                </v-window-item>

                <!-- Courses Tab -->
                <v-window-item value="courses">
                  <AdminCoursesAdmin />
                </v-window-item>

                <!-- Contacts Tab -->
                <v-window-item value="contacts">
                  <AdminContactsAdmin />
                </v-window-item>
              </v-window>
            </div>
          </v-main>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

// Admin tabs configuration
const adminTabs = [
  { value: 'projects', label: 'Projetos', icon: 'mdi-folder-multiple' },
  { value: 'skills', label: 'Habilidades', icon: 'mdi-star-circle' },
  { value: 'certifications', label: 'Certificações', icon: 'mdi-certificate' },
  { value: 'courses', label: 'Cursos', icon: 'mdi-school' },
  { value: 'contacts', label: 'Contatos', icon: 'mdi-email' },
]

// Estado de autenticação
const isAuthenticated = ref(false)
const loading = ref(false)
const loginError = ref('')

const loginForm = ref({
  username: '',
  password: '',
})

const activeTab = ref('projects')

// Verificar autenticação ao montar
onMounted(async () => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    try {
      // Validar token com backend
      await $fetch(`${config.public.apiUrl}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      isAuthenticated.value = true
    } catch {
      // Token inválido, limpar storage
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      isAuthenticated.value = false
    }
  }
})

// Login com backend
const handleLogin = async () => {
  loading.value = true
  loginError.value = ''

  try {
    const response = await $fetch<{ access_token: string; user: any }>(
      `${config.public.apiUrl}/auth/login`,
      {
        method: 'POST',
        body: {
          username: loginForm.value.username,
          password: loginForm.value.password,
        },
      }
    )

    // Salvar token no localStorage
    localStorage.setItem('admin_token', response.access_token)
    localStorage.setItem('admin_user', JSON.stringify(response.user))

    isAuthenticated.value = true
  } catch {
    console.error('Erro no login')
    loginError.value = 'Usuário ou senha incorretos'
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  loginForm.value.username = ''
  loginForm.value.password = ''
}

// Meta tags
useHead({
  title: 'Admin - Painel Administrativo',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<style scoped>
/* === ADMIN PAGE LAYOUT === */
.admin-page {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.admin-header-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.admin-main-wrapper {
  display: flex;
  flex: 1;
  position: relative;
}

.admin-sidebar {
  border-right: 1px solid rgba(59, 130, 246, 0.1) !important;
  background: rgba(15, 23, 42, 0.95) !important;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  z-index: 10 !important;
}

:deep(.admin-sidebar .v-navigation-drawer__content) {
  overflow-x: hidden;
}

.sidebar-item {
  margin-bottom: 0.5rem;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #94a3b8 !important;
  min-height: 52px !important;
  padding: 0.5rem 1rem !important;
}

.sidebar-item:hover {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #60a5fa !important;
}

.sidebar-item-active {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2) 0%,
    rgba(59, 130, 246, 0.1) 100%
  ) !important;
  color: #3b82f6 !important;
  border-left: 3px solid #3b82f6;
  font-weight: 600;
}

.sidebar-item :deep(.v-list-item__prepend) {
  margin-right: 16px;
}

.sidebar-title {
  font-size: 0.9375rem !important;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-item-active .sidebar-title {
  font-weight: 600;
}

.sidebar-footer {
  padding: 0.5rem;
  background: rgba(15, 23, 42, 0.8);
  border-top: 1px solid rgba(59, 130, 246, 0.2);
}

.sidebar-logout-item {
  min-height: 52px !important;
  padding: 0.75rem 1rem !important;
  margin: 0 !important;
  border-radius: 8px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #fca5a5 !important;
}

.sidebar-logout-item:hover {
  background: rgba(239, 68, 68, 0.15) !important;
  color: #ef4444 !important;
  cursor: pointer;
}

.sidebar-logout-item :deep(.v-list-item__prepend) {
  margin-right: 16px;
}

.admin-main-content {
  flex: 1;
  background: transparent !important;
  padding: 0 !important;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  padding: 2rem;
  max-width: 100%;
}

.admin-content {
  background: #0f172a;
  min-height: 100vh;
  padding: 0;
}

.tab-content-wrapper {
  padding: 2rem;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark Theme Cards and Components */
:deep(.v-card) {
  background: #1e293b !important;
  border-radius: 12px !important;
  border: 1px solid rgba(59, 130, 246, 0.1) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
}

:deep(.v-card-title) {
  font-weight: 600;
  color: #ffffff !important;
  padding: 1.5rem;
  background: rgba(59, 130, 246, 0.05);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

:deep(.v-card-text) {
  color: #e2e8f0 !important;
}

/* Buttons - Dark Theme */
:deep(.v-btn) {
  border-radius: 8px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  transition: all 0.2s ease !important;
}

:deep(.v-btn:not(.v-btn--icon):hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
}

/* Data Table - Dark Theme */
:deep(.v-data-table) {
  background: #1e293b !important;
  color: #e2e8f0 !important;
  border-radius: 12px;
}

:deep(.v-data-table .v-data-table__th) {
  background: rgba(59, 130, 246, 0.05) !important;
  color: #94a3b8 !important;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

:deep(.v-data-table .v-data-table__td) {
  border-bottom: 1px solid rgba(59, 130, 246, 0.05) !important;
  color: #e2e8f0 !important;
}

:deep(.v-data-table tbody tr:hover) {
  background: rgba(59, 130, 246, 0.05) !important;
}

/* Form Inputs - Dark Theme */
:deep(.v-text-field),
:deep(.v-textarea),
:deep(.v-select),
:deep(.v-combobox) {
  border-radius: 8px;
}

:deep(.v-field) {
  background: rgba(15, 23, 42, 0.5) !important;
  border: 1px solid rgba(59, 130, 246, 0.2) !important;
  border-radius: 8px !important;
}

:deep(.v-field:hover) {
  border-color: rgba(59, 130, 246, 0.4) !important;
}

:deep(.v-field--focused) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

:deep(.v-field__input),
:deep(.v-field__input input),
:deep(.v-select__selection-text) {
  color: #e2e8f0 !important;
}

:deep(.v-label) {
  color: #94a3b8 !important;
}

:deep(.v-field--focused .v-label) {
  color: #3b82f6 !important;
}

/* Fix v-select dropdown positioning */
:deep(.v-overlay) {
  z-index: 9999 !important;
}

:deep(.v-overlay__scrim) {
  z-index: 9998 !important;
}

:deep(.v-overlay__content) {
  z-index: 9999 !important;
}

:deep(.v-menu) {
  z-index: 9999 !important;
}

:deep(.v-menu > .v-overlay__content) {
  margin-top: 4px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
  border: 1px solid rgba(59, 130, 246, 0.2) !important;
  border-radius: 8px !important;
  background: #1e293b !important;
  position: relative !important;
  z-index: 9999 !important;
}

:deep(.v-list) {
  background: #1e293b !important;
  padding: 0.5rem !important;
}

:deep(.v-list-item) {
  border-radius: 6px !important;
  margin-bottom: 0.25rem !important;
  color: #e2e8f0 !important;
  transition: all 0.2s ease !important;
}

:deep(.v-list-item:hover) {
  background: rgba(59, 130, 246, 0.15) !important;
}

:deep(.v-list-item--active) {
  background: rgba(59, 130, 246, 0.25) !important;
  color: #60a5fa !important;
}

:deep(.v-list-item__content) {
  color: inherit !important;
}

:deep(.v-list-item-title) {
  color: #e2e8f0 !important;
}

:deep(.v-select__selection) {
  color: #e2e8f0 !important;
}

:deep(.v-select__selection-text) {
  color: #e2e8f0 !important;
}

/* V-select and v-autocomplete menu wrapper */
:deep(.v-select .v-field__append-inner),
:deep(.v-autocomplete .v-field__append-inner) {
  color: #94a3b8 !important;
}

:deep(.v-select--active-menu .v-field__append-inner),
:deep(.v-autocomplete--active-menu .v-field__append-inner) {
  color: #3b82f6 !important;
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

/* V-autocomplete specific styles */
:deep(.v-autocomplete .v-field) {
  cursor: pointer !important;
}

:deep(.v-autocomplete .v-field__input) {
  cursor: pointer !important;
}

:deep(.v-combobox .v-chip) {
  background: rgba(59, 130, 246, 0.2) !important;
  border: 1px solid rgba(59, 130, 246, 0.3) !important;
  color: #93c5fd !important;
}

/* Dialogs - Dark Theme */
:deep(.v-dialog .v-card) {
  background: #1e293b !important;
}

:deep(.v-dialog .v-card-title) {
  background: rgba(59, 130, 246, 0.1);
  color: #ffffff !important;
}

/* Chips - Dark Theme */
:deep(.v-chip) {
  border-radius: 6px !important;
  font-weight: 500 !important;
}

/* Snackbar - Dark Theme */
:deep(.v-snackbar) {
  text-align: center;
}

:deep(.v-snackbar__content) {
  border-radius: 8px !important;
}

/* Scrollbar - Dark Theme */
:deep(*::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(*::-webkit-scrollbar-track) {
  background: #0f172a;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 4px;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: rgba(59, 130, 246, 0.5);
}

/* Responsive Design */
@media (max-width: 960px) {
  .content-wrapper {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0.75rem;
  }

  .sidebar-item {
    min-height: 48px !important;
    padding: 0.5rem 0.75rem !important;
  }
}
</style>
