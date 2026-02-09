<template>
  <section id="home" class="hero-modern position-relative d-flex align-center overflow-hidden">
    <!-- Animated Background -->
    <div class="hero-background">
      <div class="bg-gradient-mesh" />
      <div class="bg-grid" />
      <div class="floating-shapes">
        <div class="shape shape-1" />
        <div class="shape shape-2" />
        <div class="shape shape-3" />
      </div>
    </div>

    <v-container class="py-12 py-md-16 position-relative" style="z-index: 2">
      <v-row align="center" justify="center" class="flex-column-reverse flex-md-row">
        <!-- Text Content -->
        <v-col cols="12" md="7" lg="6" class="text-center text-md-left">
          <HeroComponentsHeroContent>
            <template #stats>
              <HeroComponentsHeroStats
                :project-count="projectCount"
                :certification-count="certificationCount"
              />
            </template>
          </HeroComponentsHeroContent>
        </v-col>

        <!-- Image with Floating Elements -->
        <v-col
          cols="12"
          md="5"
          lg="6"
          class="d-flex flex-column justify-center align-center mb-10 mb-md-0"
        >
          <HeroComponentsHeroImage
            :size="avatarSize"
            :image-alt="imageAlt"
            :image-url="IMAGE_URLS.PROFILE_PHOTO"
          />

          <!-- Social Links -->
          <div class="hero-social-links mt-10">
            <div class="social-label mb-4 text-center">
              <span class="text-body-2 font-weight-medium" style="color: rgb(148, 163, 184)"
                >Conecte-se comigo</span
              >
            </div>
            <div class="d-flex justify-center ga-3">
              <v-btn
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                :aria-label="`Visitar ${social.name}`"
                icon
                rounded="circle"
                class="social-btn-hero"
                width="48"
                height="48"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-icon :icon="social.icon" size="22" />
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <div class="scroll-line" />
      <v-icon icon="mdi-chevron-down" class="scroll-icon" size="24" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { IMAGE_URLS } from '~/constants'
import { useSocialLinks } from '~/composables/useSocialLinks'
import { useProjectsStore } from '~/stores/projects'
import { useCertificationsStore } from '~/stores/certifications'

// Configuration
const config = useRuntimeConfig()
const siteFirstName = config.public.siteFirstName || 'Henrique'

// Composables
const { socialLinks } = useSocialLinks()
const { isMobile, isTablet } = useResponsive()
const { observeElements } = useScrollAnimation()

// Stores
const projectsStore = useProjectsStore()
const certificationsStore = useCertificationsStore()

const imageAlt = `Foto profissional de ${siteFirstName}`

// Avatar size responsivo
const avatarSize = ref(320)

const updateAvatarSize = () => {
  if (import.meta.client) {
    if (isMobile.value) avatarSize.value = 250
    else if (isTablet.value) avatarSize.value = 280
    else avatarSize.value = 320
  }
}

// Dynamic stats from stores
const projectCount = computed(() => projectsStore.projectsCount)
const certificationCount = computed(() => certificationsStore.certificationsCount)

onMounted(() => {
  updateAvatarSize()
  observeElements({ threshold: 0.2, once: true })
  projectsStore.fetchStats()
  certificationsStore.fetchStats()
})

watch([isMobile, isTablet], updateAvatarSize)
</script>

<style scoped>
.hero-modern {
  min-height: 100vh;
  background: rgb(15, 23, 42);
}

/* Background */
.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
}

.bg-gradient-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  animation: gradientShift 15s ease infinite;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.floating-shapes .shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: rgba(59, 130, 246, 0.3);
  top: -200px;
  right: -200px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: rgba(6, 182, 212, 0.3);
  bottom: -150px;
  left: -150px;
  animation-delay: 5s;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: rgba(168, 85, 247, 0.3);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -30px);
  }
  66% {
    transform: translate(-20px, 20px);
  }
}

@keyframes gradientShift {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Social Links */
.hero-social-links {
  animation: fadeInUp 1s ease 1.6s both;
}

.social-btn-hero {
  background: rgba(30, 41, 59, 0.7) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: rgb(96, 165, 250) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.social-btn-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-btn-hero:hover {
  transform: translateY(-4px) scale(1.1);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  color: white !important;
}

.social-btn-hero:hover::before {
  opacity: 1;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 3;
  animation: bounce 2s ease-in-out infinite;
}

.scroll-line {
  width: 2px;
  height: 30px;
  background: linear-gradient(to bottom, transparent, rgb(59, 130, 246));
}

.scroll-icon {
  color: rgb(59, 130, 246);
  opacity: 0.7;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 960px) {
  .shape {
    filter: blur(60px);
  }
}

@media (max-width: 600px) {
  .scroll-indicator {
    bottom: 20px;
  }

  .social-btn-hero {
    width: 44px !important;
    height: 44px !important;
  }

  .hero-social-links {
    margin-top: 32px !important;
  }
}
</style>
