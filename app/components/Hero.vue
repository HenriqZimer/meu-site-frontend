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

    <v-container class="py-12 py-md-16 position-relative" style="z-index: 2;">
      <v-row align="center" justify="center" class="flex-column-reverse flex-md-row">
        <!-- Text Content -->
        <v-col cols="12" md="7" lg="6" class="text-center text-md-left">
          <div class="hero-content" data-animate="fade-up">
            <!-- Status Badge -->
            <v-chip class="hero-badge mb-6 mb-md-8" variant="flat" size="default">
              <span class="status-dot" />
              <span class="ml-2">Disponível para novos projetos</span>
            </v-chip>

            <!-- Main Title -->
            <h1 class="hero-title mb-4 mb-md-6">
              <span class="title-greeting">Olá, eu sou</span>
              <span class="title-name text-gradient-vibrant">Henrique Zimermann</span>
            </h1>

            <!-- Subtitle with Icon -->
            <div class="hero-subtitle-box mb-6 mb-md-8">
              <div class="d-inline-flex align-center ga-3 flex-wrap justify-center justify-md-start">
                <v-chip color="primary" variant="flat" class="subtitle-chip high-contrast-chip">
                  <v-icon icon="mdi-infinity" start size="20" />
                  DevOps
                </v-chip>
                <v-chip color="blue-darken-2" variant="flat" class="subtitle-chip high-contrast-chip">
                  <v-icon icon="mdi-cloud-outline" start size="20" />
                  Cloud
                </v-chip>
                <v-chip color="blue-darken-2" variant="flat" class="subtitle-chip high-contrast-chip">
                  <v-icon icon="mdi-kubernetes" start size="20" />
                  Kubernetes
                </v-chip>
              </div>
            </div>

            <!-- Description -->
            <p class="hero-description text-body-1 text-md-h6 mb-8 mb-md-10 mx-auto mx-md-0">
              Resolvo problemas de infraestrutura com soluções automatizadas com <span
                class="text-highlight">CI/CD</span>,
              <span class="text-highlight">Kubernetes</span> e
              <span class="text-highlight">Cloud</span>.
            </p>

            <!-- CTA Buttons -->
            <div class="d-flex flex-column flex-sm-row align-center justify-center justify-md-start ga-4 mb-8 mb-md-12">
              <v-btn size="x-large" color="primary" variant="flat"
                class="cta-btn-primary text-none rounded-xl px-10 font-weight-bold" elevation="8"
                @click="scrollToSection('contact')">
                <v-icon icon="mdi-send" start />
                Entre em Contato
              </v-btn>

              <v-btn size="x-large" variant="outlined" color="primary"
                class="cta-btn-secondary text-none rounded-xl px-10 font-weight-bold"
                @click="scrollToSection('projects')">
                <v-icon icon="mdi-briefcase-variant-outline" start />
                Ver Projetos
              </v-btn>
            </div>

            <!-- Mini Stats -->
            <div class="d-flex justify-center justify-md-start mb-8 mb-md-10 mb-4">
              <v-row class="hero-mini-stats" style="max-width: 500px;">
                <v-col cols="4" class="text-center">
                  <div class="stat-card">
                    <div class="stat-value text-gradient-vibrant">3+</div>
                    <div class="stat-label">Anos</div>
                  </div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div class="stat-card">
                    <div class="stat-value text-gradient-cyan">{{ projectCount }}+</div>
                    <div class="stat-label">Projetos</div>
                  </div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div class="stat-card">
                    <div class="stat-value text-gradient-purple">{{ certificationCount }}+</div>
                    <div class="stat-label">Certificações</div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>

        <!-- Image with Floating Elements -->
        <v-col cols="12" md="5" lg="6" class="d-flex flex-column justify-center align-center mb-10 mb-md-0">
          <div class="hero-image-container position-relative">
            <!-- Main Avatar -->
            <div class="avatar-wrapper">
              <v-avatar :size="avatarSize" class="hero-avatar">
                <v-img :src="profileImageUrl" :alt="imageAlt" eager cover />
              </v-avatar>
              <div class="avatar-ring" />
              <div class="avatar-glow" />
            </div>

            <!-- Floating Tech Badges -->
            <div class="floating-badge badge-kubernetes">
              <v-icon icon="mdi-kubernetes" size="28" color="primary" />
            </div>
            <div class="floating-badge badge-docker">
              <v-icon icon="mdi-docker" size="28" color="info" />
            </div>
            <div class="floating-badge badge-aws">
              <v-icon icon="mdi-aws" size="28" color="warning" />
            </div>
            <div class="floating-badge badge-infinity">
              <v-icon icon="mdi-infinity" size="28" color="primary" />
            </div>
          </div>

          <!-- Social Links - Modern Design -->
          <div class="hero-social-links mt-10">
            <div class="social-label mb-4 text-center">
              <span class="text-body-2 font-weight-medium" style="color: rgb(148, 163, 184);">Conecte-se comigo</span>
            </div>
            <div class="d-flex justify-center ga-3">
              <v-btn v-for="social in socialLinks" :key="social.name" :href="social.url"
                :aria-label="`Visitar ${social.name}`" icon rounded="circle" class="social-btn-hero" width="48"
                height="48" target="_blank" rel="noopener noreferrer">
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
import { useNavigation } from "~/composables/useNavigation";
import { useSocialLinks } from "~/composables/useSocialLinks";
import { useProjectsStore } from "~/stores/projects";
import { useCertificationsStore } from "~/stores/certifications";

// Configuration
const config = useRuntimeConfig();
const siteFirstName = config.public.siteFirstName || "Henrique";

// Composables
const { scrollToSection } = useNavigation();
const { socialLinks } = useSocialLinks();
const { isMobile, isTablet } = useResponsive();
const { observeElements } = useScrollAnimation();

// Stores
const projectsStore = useProjectsStore();
const certificationsStore = useCertificationsStore();

const imageAlt = `Foto profissional de ${siteFirstName}`;
const profileImageUrl = "/foto-perfil-profissional.jpg";

// Avatar size responsivo - inicializar com valor padrão para evitar hidratação mismatch
const avatarSize = ref(320);

const updateAvatarSize = () => {
  if (process.client) {
    if (isMobile.value) avatarSize.value = 250;
    else if (isTablet.value) avatarSize.value = 280;
    else avatarSize.value = 320;
  }
};

// Dynamic stats from stores
const projectCount = computed(() => projectsStore.projectsCount);
const certificationCount = computed(() => certificationsStore.certificationsCount);

onMounted(() => {
  updateAvatarSize();
  
  observeElements({
    threshold: 0.2,
    once: true,
  });

  // Fetch stats from backend
  projectsStore.fetchStats();
  certificationsStore.fetchStats();
});

// Watch para mudanças responsivas
watch([isMobile, isTablet], updateAvatarSize);
</script>

<style scoped>
/* ===================================
   HERO SECTION
   =================================== */
.hero-modern {
  min-height: 100vh;
  background: rgb(15, 23, 42);
}

/* ===================================
   ANIMATED BACKGROUND
   =================================== */
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

/* ===================================
   HERO BADGE
   =================================== */
.hero-badge {
  background: rgba(59, 130, 246, 0.15) !important;
  border: 1px solid rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(10px);
  color: rgb(147, 197, 253) !important;
  font-weight: 600;
  padding: 10px 24px !important;
  height: auto !important;
  animation: fadeInUp 1s ease 0.2s both;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(34, 197, 94);
  animation: pulse 2s ease-in-out infinite;
}

/* ===================================
   TITLE
   =================================== */
.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  animation: fadeInUp 1s ease 0.4s both;
}

.title-greeting {
  color: rgb(203, 213, 225);
  font-weight: 500;
  font-size: 0.6em;
  display: block;
  margin-bottom: 8px;
}

.title-name {
  font-weight: 800;
}

/* ===================================
   SUBTITLE
   =================================== */
.hero-subtitle-box {
  animation: fadeInUp 1s ease 0.6s both;
}

.subtitle-chip {
  font-weight: 600 !important;
  padding: 10px 18px !important;
  height: auto !important;
}

/* High contrast chips for accessibility */
.high-contrast-chip {
  color: #ffffff !important;
  background: linear-gradient(135deg, #1e40af, #1e3a8a) !important;
  border: 2px solid rgba(59, 130, 246, 0.3) !important;
}

.high-contrast-chip .v-chip__content {
  color: #ffffff !important;
}

.high-contrast-chip .v-icon {
  color: #ffffff !important;
}

/* ===================================
   DESCRIPTION
   =================================== */
.hero-description {
  color: rgb(203, 213, 225);
  max-width: 600px;
  line-height: 1.7;
  animation: fadeInUp 1s ease 0.8s both;
}

.text-highlight {
  color: rgb(147, 197, 253);
  font-weight: 600;
}

/* ===================================
   CTA BUTTONS
   =================================== */
.cta-btn-primary {
  background: linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235)) !important;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  animation: fadeInUp 1s ease 1s both;
}

.cta-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.6) !important;
}

.cta-btn-secondary {
  border-width: 2px !important;
  border-color: rgb(59, 130, 246) !important;
  color: rgb(147, 197, 253) !important;
  transition: all 0.3s ease !important;
  animation: fadeInUp 1s ease 1.2s both;
}

.cta-btn-secondary:hover {
  transform: translateY(-3px);
  background: rgba(59, 130, 246, 0.1) !important;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3) !important;
}

/* ===================================
   MINI STATS
   =================================== */
.hero-mini-stats {
  animation: fadeInUp 1s ease 1.4s both;
  width: 100%;
  margin: 0;
}

.stat-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  padding: 16px 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  color: rgb(148, 163, 184);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ===================================
   HERO IMAGE
   =================================== */
.hero-image-container {
  animation: fadeInLeft 1s ease 0.5s both;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.hero-avatar {
  border: 4px solid rgba(59, 130, 246, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.hero-avatar:hover {
  transform: scale(1.05);
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 25px 70px rgba(59, 130, 246, 0.4);
}

.avatar-ring {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.2);
  animation: rotate 20s linear infinite;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  inset: -40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
  z-index: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

/* ===================================
   FLOATING BADGES
   =================================== */
.floating-badge {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  animation: float 6s ease-in-out infinite;
}

.floating-badge:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.5);
}

.badge-kubernetes {
  top: 10%;
  right: 10%;
}

.badge-docker {
  top: 50%;
  right: 0;
  animation-delay: 1s;
}

.badge-aws {
  bottom: 20%;
  right: 15%;
  animation-delay: 2s;
}

.badge-infinity {
  top: 35%;
  left: -10%;
  animation-delay: 3s;
}

/* ===================================
   SOCIAL LINKS
   =================================== */
.hero-social-links {
  animation: fadeInUp 1s ease 1.6s both;
}

.social-label {
  opacity: 0.9;
}

.social-btn-hero {
  background: rgba(30, 41, 59, 0.7) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: rgb(96, 165, 250) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  min-width: 48px !important;
  aspect-ratio: 1 / 1;
  padding: 0 !important;
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

.social-btn-hero .v-icon {
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.social-btn-hero:hover .v-icon {
  transform: rotate(5deg) scale(1.1);
}

/* ===================================
   SCROLL INDICATOR
   ===================================*/
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

/* ===================================
   ANIMATIONS
   =================================== */
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

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ===================================
   RESPONSIVE
   =================================== */
@media (max-width: 960px) {
  .floating-badge {
    width: 50px;
    height: 50px;
  }

  .shape {
    filter: blur(60px);
  }

  .stat-card {
    padding: 12px 8px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }
}

@media (max-width: 600px) {
  .hero-badge {
    padding: 8px 18px !important;
    font-size: 0.9rem;
  }

  .floating-badge {
    width: 45px;
    height: 45px;
  }

  .badge-infinity {
    left: 0;
  }

  .avatar-ring {
    inset: -10px;
  }

  .avatar-glow {
    inset: -20px;
  }

  .scroll-indicator {
    bottom: 5px;
  }

  .stat-card {
    padding: 10px 6px;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }

  .social-btn-hero {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    max-width: 44px !important;
    min-height: 44px !important;
    max-height: 44px !important;
  }

  .hero-social-links {
    margin-top: 32px !important;
    margin-bottom: 40px !important;
  }

  .hero-social-links .d-flex {
    flex-wrap: wrap;
    gap: 8px !important;
  }
}
</style>
