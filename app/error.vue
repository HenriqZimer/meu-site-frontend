<template>
  <v-app>
    <div class="error-page">
      <div class="error-container">
        <!-- Background Animation -->
        <div class="error-background">
          <div v-for="i in 20" :key="i" class="floating-icon"
            :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }">
            <v-icon :icon="icons[i % icons.length]" size="24" />
          </div>
        </div>

        <!-- Error Content -->
        <div class="error-content" data-animate="fade-up">
          <!-- Error Icon -->
          <div class="error-icon-container">
            <v-icon icon="mdi-alert-circle-outline" size="120" color="primary" />
          </div>

          <!-- Error Code -->
          <h1 class="error-code">{{ error?.statusCode || 404 }}</h1>

          <!-- Error Message -->
          <h2 class="error-title">{{ errorTitle }}</h2>
          <p class="error-description">{{ errorDescription }}</p>

          <!-- Error Details (Dev mode) -->
          <div v-if="error?.message && isDev" class="error-details">
            <v-expansion-panels variant="accordion">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon icon="mdi-information-outline" class="mr-2" />
                  Detalhes do Erro (Dev Mode)
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <pre class="error-stack">{{ error.message }}</pre>
                  <pre v-if="error.stack" class="error-stack">{{ error.stack }}</pre>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- Action Buttons -->
          <div class="error-actions">
            <v-btn color="primary" size="large" variant="flat" :to="'/'" prepend-icon="mdi-home">
              Voltar ao Início
            </v-btn>
            <v-btn color="secondary" size="large" variant="outlined" prepend-icon="mdi-arrow-left"
              @click="handleBack">
              Página Anterior
            </v-btn>
          </div>

          <!-- Quick Links -->
          <div class="error-links">
            <h3 class="error-links-title">Links Rápidos</h3>
            <div class="error-links-grid">
              <NuxtLink to="/#about" class="error-link">
                <v-icon icon="mdi-account-circle" size="20" />
                <span>Sobre</span>
              </NuxtLink>
              <NuxtLink to="/#skills" class="error-link">
                <v-icon icon="mdi-briefcase" size="20" />
                <span>Skills</span>
              </NuxtLink>
              <NuxtLink to="/#projects" class="error-link">
                <v-icon icon="mdi-folder-multiple" size="20" />
                <span>Projetos</span>
              </NuxtLink>
              <NuxtLink to="/#courses" class="error-link">
                <v-icon icon="mdi-school" size="20" />
                <span>Cursos</span>
              </NuxtLink>
              <NuxtLink to="/#certifications" class="error-link">
                <v-icon icon="mdi-certificate" size="20" />
                <span>Certificações</span>
              </NuxtLink>
              <NuxtLink to="/#contact" class="error-link">
                <v-icon icon="mdi-email" size="20" />
                <span>Contato</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Social Links -->
          <div class="error-social">
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})

const router = useRouter()
const isDev = import.meta.dev

// Icons para animação de background
const icons = [
  'mdi-kubernetes',
  'mdi-docker',
  'mdi-aws',
  'mdi-terraform',
  'mdi-react',
  'mdi-vuejs',
  'mdi-nodejs',
  'mdi-python',
  'mdi-database',
  'mdi-git'
]

// Mensagens baseadas no código de erro
const errorTitle = computed(() => {
  const code = props.error?.statusCode || 404
  switch (code) {
    case 404:
      return 'Página não encontrada'
    case 500:
      return 'Erro interno do servidor'
    case 403:
      return 'Acesso negado'
    default:
      return 'Ops! Algo deu errado'
  }
})

const errorDescription = computed(() => {
  const code = props.error?.statusCode || 404
  switch (code) {
    case 404:
      return 'A página que você está procurando não existe ou foi movida. Vamos te ajudar a encontrar o caminho de volta!'
    case 500:
      return 'Desculpe, ocorreu um erro no servidor. Nossa equipe já foi notificada e estamos trabalhando para resolver.'
    case 403:
      return 'Você não tem permissão para acessar este recurso.'
    default:
      return 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.'
  }
})

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

// Scroll Animation
const { observeElements } = useScrollAnimation()

onMounted(() => {
  observeElements({
    threshold: 0.1,
    once: true
  })
})

// Meta tags
useHead({
  title: `${props.error?.statusCode || 404} - ${errorTitle.value}`,
  meta: [{ name: 'robots', content: 'noindex' }]
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.error-container {
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 2;
}

.error-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  animation: float 20s infinite ease-in-out;
  opacity: 0.03;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-100px) rotate(120deg);
  }
  66% {
    transform: translateY(-50px) rotate(240deg);
  }
}

.error-content {
  text-align: center;
  background: rgb(var(--v-theme-surface));
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.error-icon-container {
  margin-bottom: 24px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.error-code {
  font-size: clamp(80px, 15vw, 140px);
  font-weight: 900;
  background: linear-gradient(135deg,
      rgb(var(--v-theme-primary)),
      rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
  line-height: 1;
  letter-spacing: -0.02em;
}

.error-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 16px 0;
}

.error-description {
  font-size: 18px;
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

.error-details {
  margin: 32px 0;
  text-align: left;
}

.error-stack {
  background: rgb(var(--v-theme-background));
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface));
  margin: 8px 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.error-links {
  margin-top: 48px;
  padding-top: 48px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.error-links-title {
  font-size: 16px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.error-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.error-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgb(var(--v-theme-background));
  border-radius: 12px;
  color: rgb(var(--v-theme-on-surface));
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.error-link:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  border-color: rgb(var(--v-theme-primary));
  transform: translateY(-2px);
}

.error-link span {
  font-size: 14px;
  font-weight: 500;
}

.error-social {
  margin-top: 32px;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .error-content {
    padding: 40px 24px;
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions .v-btn {
    width: 100%;
  }

  .error-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .error-links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
