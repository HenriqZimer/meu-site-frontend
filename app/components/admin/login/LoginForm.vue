<template>
  <v-container class="login-container fill-height">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="bg-shape shape-1" />
      <div class="bg-shape shape-2" />
      <div class="bg-shape shape-3" />
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

            <v-form @submit.prevent="$emit('submit')">
              <v-text-field
                :model-value="username"
                label="Usuário"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                density="comfortable"
                :error-messages="errorMessage"
                class="mb-4 custom-input"
                hide-details="auto"
                @update:model-value="$emit('update:username', $event)"
              />

              <v-text-field
                :model-value="password"
                label="Senha"
                prepend-inner-icon="mdi-lock-outline"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                density="comfortable"
                :error-messages="errorMessage"
                class="mb-6 custom-input"
                hide-details="auto"
                @update:model-value="$emit('update:password', $event)"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-btn
                type="submit"
                color="primary"
                size="x-large"
                block
                :loading="loading"
                class="login-btn"
              >
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
</template>

<script setup lang="ts">
defineProps<{
  username: string
  password: string
  loading: boolean
  errorMessage: string
}>()

defineEmits<{
  'update:username': [value: string]
  'update:password': [value: string]
  submit: []
}>()

const showPassword = ref(false)
</script>

<style scoped>
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
  0%,
  100% {
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
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
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
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
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
</style>
