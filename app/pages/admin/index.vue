<template>
    <v-app :theme="'dark'">
        <div class="admin-page">
            <!-- Login Screen -->
            <v-container v-if="!isAuthenticated" class="login-container fill-height">
                <!-- Animated Background -->
                <div class="animated-bg">
                    <div class="bg-shape shape-1"></div>
                    <div class="bg-shape shape-2"></div>
                    <div class="bg-shape shape-3"></div>
                </div>

                <v-row align="center" justify="center" class="login-row">
                    <v-col cols="12" sm="8" md="5" lg="4">
                        <!-- Logo/Brand -->
                        <div class="brand-section text-center mb-8">
                            <div class="brand-icon-wrapper">
                                <v-icon icon="mdi-shield-lock" size="64" class="brand-icon" />
                            </div>
                            <h1 class="brand-title mt-4">Admin Portal</h1>
                            <p class="brand-subtitle">Painel de Gerenciamento</p>
                        </div>

                        <!-- Login Card -->
                        <v-card class="login-card" elevation="0">
                            <v-card-text class="pa-8">
                                <h2 class="login-title text-center mb-2">Bem-vindo de volta</h2>
                                <p class="login-subtitle text-center mb-6">Entre com suas credenciais</p>

                                <v-form @submit.prevent="handleLogin">
                                    <v-text-field v-model="loginForm.username" label="Usuário"
                                        prepend-inner-icon="mdi-account-outline" variant="outlined"
                                        density="comfortable" :error-messages="loginError" class="mb-4 custom-input"
                                        hide-details="auto" />

                                    <v-text-field v-model="loginForm.password" label="Senha"
                                        prepend-inner-icon="mdi-lock-outline" :type="showPassword ? 'text' : 'password'"
                                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                        variant="outlined" density="comfortable"
                                        :error-messages="loginError" class="mb-6 custom-input" hide-details="auto"
                                        @click:append-inner="showPassword = !showPassword" />

                                    <v-btn type="submit" color="primary" size="x-large" block :loading="loading"
                                        class="login-btn">
                                        <v-icon start>mdi-login</v-icon>
                                        Entrar no Painel
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>

                        <!-- Footer Info -->
                        <div class="login-footer text-center mt-6">
                            <p class="text-caption">
                                <v-icon size="small" class="mr-1">mdi-shield-check</v-icon>
                                Conexão segura com criptografia JWT
                            </p>
                        </div>
                    </v-col>
                </v-row>
            </v-container>

            <!-- Admin Content -->
            <v-main v-else class="admin-content">
                <v-container fluid class="pa-0">
                    <!-- Header with Tabs -->
                    <div class="admin-header">
                        <div class="header-content">
                            <div class="header-left">
                                <div class="header-icon-wrapper">
                                    <v-icon icon="mdi-view-dashboard" size="28" />
                                </div>
                                <div class="header-text">
                                    <h1 class="header-title">Painel Administrativo</h1>
                                    <p class="header-subtitle">
                                        <v-icon size="14" class="mr-1">mdi-shield-check</v-icon>
                                        Gerenciamento de Conteúdo
                                    </p>
                                </div>
                            </div>
                            <div class="header-actions">
                                <div class="user-info">
                                    <v-icon size="20" class="mr-2">mdi-account-circle</v-icon>
                                    <span class="user-name">Admin</span>
                                </div>
                                <v-btn 
                                    variant="flat" 
                                    color="error" 
                                    prepend-icon="mdi-logout" 
                                    class="logout-btn"
                                    size="default"
                                    @click="handleLogout"
                                >
                                    Sair
                                </v-btn>
                            </div>
                        </div>

                        <!-- Tabs -->
                        <v-tabs v-model="activeTab" color="primary" class="admin-tabs" height="56">
                            <v-tab value="projects" class="tab-item">
                                <v-icon start size="20">mdi-folder-multiple</v-icon>
                                <span class="tab-text">Projetos</span>
                            </v-tab>
                            <v-tab value="skills" class="tab-item">
                                <v-icon start size="20">mdi-star-circle</v-icon>
                                <span class="tab-text">Habilidades</span>
                            </v-tab>
                            <v-tab value="certifications" class="tab-item">
                                <v-icon start size="20">mdi-certificate</v-icon>
                                <span class="tab-text">Certificações</span>
                            </v-tab>
                            <v-tab value="courses" class="tab-item">
                                <v-icon start size="20">mdi-school</v-icon>
                                <span class="tab-text">Cursos</span>
                            </v-tab>
                            <v-tab value="contacts" class="tab-item">
                                <v-icon start size="20">mdi-email</v-icon>
                                <span class="tab-text">Contatos</span>
                            </v-tab>
                        </v-tabs>
                    </div>

                    <!-- Tab Content -->
                    <div class="tab-content-wrapper">
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
                </v-container>
            </v-main>
        </div>
    </v-app>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()

// Estado de autenticação
const isAuthenticated = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const loginError = ref('')

const loginForm = ref({
    username: '',
    password: ''
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
                    Authorization: `Bearer ${token}`
                }
            })
            isAuthenticated.value = true
        } catch (error) {
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
        const response = await $fetch<{ access_token: string, user: any }>(`${config.public.apiUrl}/auth/login`, {
            method: 'POST',
            body: {
                username: loginForm.value.username,
                password: loginForm.value.password
            }
        })

        // Salvar token no localStorage
        localStorage.setItem('admin_token', response.access_token)
        localStorage.setItem('admin_user', JSON.stringify(response.user))

        isAuthenticated.value = true
    } catch (error: any) {
        console.error('Erro no login:', error)
        loginError.value = error.data?.message || 'Usuário ou senha incorretos'
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
    meta: [
        { name: 'robots', content: 'noindex, nofollow' }
    ]
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  position: relative;
}/* Login Container with Modern Animated Background */
.login-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    min-height: 100vh;
}

.animated-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 0;
    background: 
        radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%);
}

.bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
    animation: float 25s ease-in-out infinite;
}

.shape-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
    top: -15%;
    left: -10%;
    animation-delay: 0s;
}

.shape-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%);
    bottom: -15%;
    right: -10%;
    animation-delay: 8s;
}

.shape-3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%);
    top: 40%;
    right: 20%;
    animation-delay: 15s;
}

@keyframes float {
    0%, 100% {
        transform: translate(0, 0) scale(1) rotate(0deg);
    }
    33% {
        transform: translate(40px, -40px) scale(1.15) rotate(120deg);
    }
    66% {
        transform: translate(-30px, 30px) scale(0.85) rotate(240deg);
    }
}

.login-row {
    position: relative;
    z-index: 1;
}

/* Brand Section */
.brand-section {
    color: white;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.brand-icon-wrapper {
    display: inline-flex;
    padding: 24px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2));
    backdrop-filter: blur(20px);
    border-radius: 28px;
    border: 2px solid rgba(255, 255, 255, 0.15);
    box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.3),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
}

.brand-icon-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 3s infinite;
}

@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

.brand-icon {
    color: white;
    filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.5));
}

.brand-title {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 800;
    letter-spacing: -1px;
    margin: 0;
    background: linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #c7d2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
}

.brand-subtitle {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.5px;
}

/* Login Card */
.login-card {
    border-radius: 28px !important;
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.4),
        0 0 1px rgba(255, 255, 255, 0.5) inset !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;
}

.login-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #a855f7, #22c55e, #3b82f6);
    background-size: 200% 100%;
    animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.login-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 
        0 30px 80px rgba(0, 0, 0, 0.45),
        0 0 1px rgba(255, 255, 255, 0.5) inset !important;
}

.login-title {
    font-size: 1.875rem;
    font-weight: 700;
    background: linear-gradient(135deg, #1e293b, #475569);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.75px;
}

.login-subtitle {
    color: #64748b;
    font-size: 0.9375rem;
    font-weight: 500;
}

/* Custom Input Fields */
:deep(.custom-input .v-field) {
    border-radius: 14px;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.custom-input .v-field:hover) {
    border-color: #93c5fd;
    background: #ffffff;
}

:deep(.custom-input .v-field--focused) {
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

:deep(.custom-input .v-field__prepend-inner) {
    color: #94a3b8;
    transition: color 0.3s ease;
}

:deep(.custom-input .v-field--focused .v-field__prepend-inner) {
    color: #3b82f6;
}

/* Login Button */
.login-btn {
    border-radius: 14px !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    letter-spacing: 0.5px !important;
    text-transform: none !important;
    padding: 24px 0 !important;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative;
    overflow: hidden;
}

.login-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
}

.login-btn:hover::before {
    left: 100%;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5) !important;
}

.login-btn:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important;
}

/* Login Footer */
.login-footer {
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.login-footer .text-caption {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

/* Admin Content Area - Dark Theme */
.admin-content {
    background: #0f172a;
    min-height: 100vh;
    padding: 0;
}

/* Admin Header */
.admin-header {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    position: sticky;
    top: 0;
    z-index: 10;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.header-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15));
    border-radius: 12px;
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: #60a5fa;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.header-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #ffffff 0%, #93c5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
}

.header-subtitle {
    font-size: 0.8125rem;
    margin: 0;
    color: #94a3b8;
    font-weight: 500;
    display: flex;
    align-items: center;
    letter-spacing: 0.3px;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-actions > * {
    margin-left: 0.5rem;
}

.user-info {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: rgba(59, 130, 246, 0.08);
    border-radius: 8px;
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: #e2e8f0;
}

.user-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #e2e8f0;
}

.logout-btn {
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.15) !important;
    color: #fca5a5 !important;
    border: 1px solid rgba(239, 68, 68, 0.3) !important;
    transition: all 0.3s ease !important;
    font-weight: 600 !important;
}

.logout-btn:hover {
    background: rgba(239, 68, 68, 0.25) !important;
    border-color: rgba(239, 68, 68, 0.5) !important;
    color: #ffffff !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
}

/* Admin Tabs - Dark Theme */
.admin-tabs {
    background: rgba(15, 23, 42, 0.5) !important;
    padding: 0 2rem;
    border-top: 1px solid rgba(59, 130, 246, 0.1);
}

:deep(.admin-tabs .v-tab.tab-item) {
    color: #94a3b8 !important;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    border-radius: 12px 12px 0 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 56px;
    margin: 0 0.25rem;
    position: relative;
    padding: 0 1.5rem;
}

:deep(.admin-tabs .v-tab.tab-item .tab-text) {
    margin-left: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
}

:deep(.admin-tabs .v-tab.tab-item:hover) {
    background: rgba(59, 130, 246, 0.1);
    color: #60a5fa !important;
    transform: translateY(-2px);
}

:deep(.admin-tabs .v-tab.tab-item.v-tab--selected) {
    background: linear-gradient(180deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%) !important;
    color: #3b82f6 !important;
    border-bottom: 3px solid #3b82f6;
    box-shadow: 0 -4px 12px rgba(59, 130, 246, 0.2);
}

:deep(.admin-tabs .v-tab.tab-item.v-tab--selected::before) {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 3px 3px 0 0;
}

:deep(.admin-tabs .v-tabs-slider) {
    display: none;
}

/* Tab Content Wrapper */
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
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }

    .header-left {
        width: 100%;
    }

    .header-actions {
        width: 100%;
        justify-content: space-between;
    }

    .admin-tabs {
        padding: 0 1rem;
    }

    :deep(.admin-tabs .v-tab.tab-item .tab-text) {
        display: none;
    }

    .tab-content-wrapper {
        padding: 1rem;
    }
}
</style>
