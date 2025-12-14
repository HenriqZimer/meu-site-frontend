<template>
  <Section id="skills" badge="Skills" badge-icon="mdi-code-braces" badge-color="cyan" title-prefix="Minha Stack"
    title-highlight="Tecnológica" description="Ferramentas e tecnologias que domino e estou estudando"
    section-class="py-10 py-md-16" container-class="pa-0">

    <!-- Tech Carousel -->
    <div class="tech-carousel-container mt-8">
      <div class="tech-carousel-wrapper overflow-x-hidden">
        <div class="tech-carousel-track d-inline-flex ga-4 ga-md-6">
          <!-- First set -->
          <v-card v-for="tech in technologies" :key="tech.name" class="tech-card elevation-2 rounded-xl" width="180"
            height="auto">
            <v-card-text class="d-flex flex-column align-center ga-3 pa-5 text-center">
              <div class="tech-icon-container d-flex align-center justify-center rounded-lg"
                :data-icon="tech.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')">
                <v-icon :icon="tech.icon" size="40" />
              </div>
              <div class="tech-details">
                <div class="text-subtitle-1 font-weight-bold" style="color: rgb(241, 245, 249);">{{ tech.name }}</div>
                <div class="text-caption" style="color: rgb(148, 163, 184);">{{ tech.category }}</div>
              </div>
            </v-card-text>
          </v-card>
          <!-- Duplicate for seamless loop -->
          <v-card v-for="tech in technologies" :key="`duplicate-${tech.name}`" class="tech-card elevation-2 rounded-xl"
            width="180" height="auto" aria-hidden="true">
            <v-card-text class="d-flex flex-column align-center ga-3 pa-5 text-center">
              <div class="tech-icon-container d-flex align-center justify-center rounded-lg"
                :data-icon="tech.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')">
                <v-icon :icon="tech.icon" size="40" />
              </div>
              <div class="tech-details">
                <div class="text-subtitle-1 font-weight-bold" style="color: rgb(241, 245, 249);">{{ tech.name }}</div>
                <div class="text-caption" style="color: rgb(148, 163, 184);">{{ tech.category }}</div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">

// Types
interface Technology {
  name: string;
  category: string;
  icon: string;
  color: string;
  bgColor: string;
  status?: string;
}

// Store
const skillsStore = useSkillsStore()

// Carregar tecnologias da API
onMounted(async () => {
  await skillsStore.fetchSkills()
})

// Computed do store
const technologies = computed(() => skillsStore.allSkills)
const loading = computed(() => skillsStore.loading)

</script>

<style scoped>
/* === CAROUSEL CONTAINER === */
.tech-carousel-container {
  position: relative;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.tech-carousel-wrapper {
  width: 100%;
  position: relative;
  padding: 40px 0;
  margin: -40px 0;
}

.tech-carousel-track {
  display: inline-flex;
  gap: 24px;
  -webkit-animation: scroll 120s linear infinite;
  animation: scroll 120s linear infinite;
  will-change: transform;
  -webkit-will-change: transform;
  flex-wrap: nowrap;
  /* Safari fix */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.tech-carousel-track:hover {
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
}

@-webkit-keyframes scroll {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }

  100% {
    -webkit-transform: translateX(calc(-50% - 12px));
    transform: translateX(calc(-50% - 12px));
  }
}

@keyframes scroll {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }

  100% {
    -webkit-transform: translateX(calc(-50% - 12px));
    transform: translateX(calc(-50% - 12px));
  }
}

/* === TECHNOLOGY CARD === */
.tech-card {
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  background: rgba(30, 41, 59, 0.7) !important;
  border: 1px solid rgba(148, 163, 184, 0.1);
  flex: 0 0 auto;
  min-width: 180px;
}

.tech-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgb(96, 165, 250), transparent);
  transition: all 0.4s ease;
  z-index: 1;
}

.tech-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg,
      rgba(59, 130, 246, 0.15),
      rgba(6, 182, 212, 0.15));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.tech-card:hover::before {
  height: 4px;
  box-shadow: 0 0 20px currentColor;
}

.tech-card:hover::after {
  opacity: 1;
}

.tech-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 20px 40px rgba(59, 130, 246, 0.2),
    0 0 60px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

/* === TECHNOLOGY ICON === */
.tech-icon-container {
  width: 64px;
  height: 64px;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent);
  border-radius: 12px;
}

.tech-icon-container::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 14px;
  background: radial-gradient(circle, transparent 30%, rgba(59, 130, 246, 0.15) 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.tech-card:hover .tech-icon-container {
  transform: scale(1.2) rotate(5deg);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent);
}

.tech-card:hover .tech-icon-container::before {
  opacity: 1;
  animation: iconGlow 2s ease-in-out infinite;
}

.tech-icon-container .v-icon {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: filter 0.3s ease;
}

.tech-card:hover .tech-icon-container .v-icon {
  filter: drop-shadow(0 4px 12px currentColor);
}

/* === TEXT STYLES === */
.tech-details .text-subtitle-1 {
  transition: all 0.3s ease;
  position: relative;
}

.tech-card:hover .tech-details .text-subtitle-1 {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: translateY(-2px);
}

.tech-details .text-caption {
  transition: color 0.3s ease;
}

.tech-card:hover .tech-details .text-caption {
  color: rgb(203, 213, 225) !important;
}

/* === ANIMATIONS === */
@keyframes iconGlow {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

/* Responsive Design */
@media (max-width: 960px) {
  .tech-card {
    min-width: 160px;
  }

  .tech-icon-container {
    width: 56px;
    height: 56px;
  }
}

@media (max-width: 600px) {
  .tech-card {
    min-width: 140px;
  }

  .tech-icon-container {
    width: 48px;
    height: 48px;
  }
}

/* Cores específicas das bordas superiores por tecnologia - CORES OFICIAIS */
.tech-card:has([data-icon="docker"])::before {
  background: rgb(41, 148, 229) !important;
}

.tech-card:has([data-icon="kubernetes"])::before {
  background: rgb(51, 113, 227) !important;
}

.tech-card:has([data-icon="terraform"])::before {
  background: rgb(124, 77, 255) !important;
}

.tech-card:has([data-icon="ansible"])::before {
  background: rgb(238, 0, 0) !important;
}

.tech-card:has([data-icon="jenkins"])::before {
  background: rgb(213, 66, 49) !important;
}

.tech-card:has([data-icon="github-actions"])::before {
  background: rgb(42, 129, 246) !important;
}

.tech-card:has([data-icon="argocd"])::before {
  background: rgb(239, 111, 54) !important;
}

.tech-card:has([data-icon="gitlab-ci"])::before {
  background: rgb(252, 109, 38) !important;
}

.tech-card:has([data-icon="prometheus"])::before {
  background: rgb(230, 86, 37) !important;
}

.tech-card:has([data-icon="grafana"])::before {
  background: rgb(242, 125, 53) !important;
}

.tech-card:has([data-icon="elk-stack"])::before {
  background: rgb(0, 169, 152) !important;
}

.tech-card:has([data-icon="jaeger"])::before {
  background: rgb(96, 214, 229) !important;
}

.tech-card:has([data-icon="aws"])::before {
  background: rgb(255, 153, 0) !important;
}

.tech-card:has([data-icon="azure"])::before {
  background: rgb(0, 120, 212) !important;
}

.tech-card:has([data-icon="gcp"])::before {
  background: rgb(234, 67, 53) !important;
}

.tech-card:has([data-icon="digitalocean"])::before {
  background: rgb(0, 127, 255) !important;
}

.tech-card:has([data-icon="python"])::before {
  background: rgb(55, 118, 171) !important;
}

.tech-card:has([data-icon="go"])::before {
  background: rgb(0, 173, 216) !important;
}

.tech-card:has([data-icon="javascript"])::before {
  background: rgb(247, 223, 30) !important;
}

.tech-card:has([data-icon="typescript"])::before {
  background: rgb(49, 120, 198) !important;
}

.tech-card:has([data-icon="bash"])::before {
  background: rgb(76, 175, 80) !important;
}

.tech-card:has([data-icon="powershell"])::before {
  background: rgb(1, 114, 182) !important;
}

.tech-card:has([data-icon="vue"])::before {
  background: rgb(65, 184, 131) !important;
}

.tech-card:has([data-icon="react"])::before {
  background: rgb(97, 218, 251) !important;
}

.tech-card:has([data-icon="nuxt"])::before {
  background: rgb(0, 220, 130) !important;
}

.tech-card:has([data-icon="nodejs"])::before {
  background: rgb(104, 160, 99) !important;
}

.tech-card:has([data-icon="postgresql"])::before {
  background: rgb(51, 103, 145) !important;
}

.tech-card:has([data-icon="mysql"])::before {
  background: rgb(0, 117, 143) !important;
}

.tech-card:has([data-icon="mongodb"])::before {
  background: rgb(71, 162, 72) !important;
}

.tech-card:has([data-icon="redis"])::before {
  background: rgb(220, 61, 50) !important;
}

.tech-card:has([data-icon="rabbitmq"])::before {
  background: rgb(255, 102, 0) !important;
}

.tech-card:has([data-icon="kafka"])::before {
  background: rgb(200, 200, 200) !important;
}

.tech-card:has([data-icon="nginx"])::before {
  background: rgb(0, 150, 57) !important;
}

.tech-card:has([data-icon="traefik"])::before {
  background: rgb(36, 182, 239) !important;
}

.tech-card:has([data-icon="istio"])::before {
  background: rgb(70, 132, 217) !important;
}

.tech-card:has([data-icon="envoy"])::before {
  background: rgb(172, 71, 189) !important;
}

.tech-card:has([data-icon="helm"])::before {
  background: rgb(12, 192, 224) !important;
}

.tech-card:has([data-icon="flux"])::before {
  background: rgb(52, 140, 212) !important;
}

.tech-card:has([data-icon="kustomize"])::before {
  background: rgb(90, 90, 207) !important;
}

.tech-card:has([data-icon="linkerd"])::before {
  background: rgb(46, 180, 67) !important;
}

.tech-card:has([data-icon="consul"])::before {
  background: rgb(224, 56, 117) !important;
}

.tech-card:has([data-icon="cilium"])::before {
  background: rgb(248, 197, 23) !important;
}

.tech-card:has([data-icon="ebpf"])::before {
  background: rgb(247, 147, 30) !important;
}

.tech-card:has([data-icon="git"])::before {
  background: rgb(240, 80, 50) !important;
}

.tech-card:has([data-icon="linux"])::before {
  background: rgb(255, 192, 0) !important;
}

.tech-card:has([data-icon="webassembly"])::before {
  background: rgb(101, 79, 240) !important;
}

/* Cores dos ícones - mesma cor da borda superior (CORES OFICIAIS) */
[data-icon="docker"] .v-icon {
  color: rgb(41, 148, 229) !important;
}

[data-icon="kubernetes"] .v-icon {
  color: rgb(51, 113, 227) !important;
}

[data-icon="terraform"] .v-icon {
  color: rgb(124, 77, 255) !important;
}

[data-icon="ansible"] .v-icon {
  color: rgb(238, 0, 0) !important;
}

[data-icon="jenkins"] .v-icon {
  color: rgb(213, 66, 49) !important;
}

[data-icon="github-actions"] .v-icon {
  color: rgb(42, 129, 246) !important;
}

[data-icon="argocd"] .v-icon {
  color: rgb(239, 111, 54) !important;
}

[data-icon="gitlab-ci"] .v-icon {
  color: rgb(252, 109, 38) !important;
}

[data-icon="prometheus"] .v-icon {
  color: rgb(230, 86, 37) !important;
}

[data-icon="grafana"] .v-icon {
  color: rgb(242, 125, 53) !important;
}

[data-icon="elk-stack"] .v-icon {
  color: rgb(0, 169, 152) !important;
}

[data-icon="jaeger"] .v-icon {
  color: rgb(96, 214, 229) !important;
}

[data-icon="aws"] .v-icon {
  color: rgb(255, 153, 0) !important;
}

[data-icon="azure"] .v-icon {
  color: rgb(0, 120, 212) !important;
}

[data-icon="gcp"] .v-icon {
  color: rgb(234, 67, 53) !important;
}

[data-icon="digitalocean"] .v-icon {
  color: rgb(0, 127, 255) !important;
}

[data-icon="python"] .v-icon {
  color: rgb(55, 118, 171) !important;
}

[data-icon="go"] .v-icon {
  color: rgb(0, 173, 216) !important;
}

[data-icon="javascript"] .v-icon {
  color: rgb(247, 223, 30) !important;
}

[data-icon="typescript"] .v-icon {
  color: rgb(49, 120, 198) !important;
}

[data-icon="bash"] .v-icon {
  color: rgb(76, 175, 80) !important;
}

[data-icon="powershell"] .v-icon {
  color: rgb(33, 150, 243) !important;
}

[data-icon="vue"] .v-icon {
  color: rgb(104, 184, 104) !important;
}

[data-icon="react"] .v-icon {
  color: rgb(77, 199, 237) !important;
}

[data-icon="nuxt"] .v-icon {
  color: rgb(104, 184, 104) !important;
}

[data-icon="nodejs"] .v-icon {
  color: rgb(104, 184, 104) !important;
}

[data-icon="postgresql"] .v-icon {
  color: rgb(51, 103, 145) !important;
}

[data-icon="mysql"] .v-icon {
  color: rgb(0, 117, 143) !important;
}

[data-icon="mongodb"] .v-icon {
  color: rgb(71, 162, 72) !important;
}

[data-icon="redis"] .v-icon {
  color: rgb(211, 57, 50) !important;
}

[data-icon="rabbitmq"] .v-icon {
  color: rgb(255, 102, 0) !important;
}

[data-icon="kafka"] .v-icon {
  color: rgb(150, 150, 150) !important;
}

[data-icon="nginx"] .v-icon {
  color: rgb(0, 150, 57) !important;
}

[data-icon="traefik"] .v-icon {
  color: rgb(36, 182, 239) !important;
}

[data-icon="istio"] .v-icon {
  color: rgb(70, 132, 217) !important;
}

[data-icon="envoy"] .v-icon {
  color: rgb(172, 71, 189) !important;
}

[data-icon="helm"] .v-icon {
  color: rgb(89, 132, 169) !important;
}

[data-icon="flux"] .v-icon {
  color: rgb(52, 140, 212) !important;
}

[data-icon="kustomize"] .v-icon {
  color: rgb(90, 90, 207) !important;
}

[data-icon="linkerd"] .v-icon {
  color: rgb(46, 180, 67) !important;
}

[data-icon="consul"] .v-icon {
  color: rgb(224, 56, 117) !important;
}

[data-icon="cilium"] .v-icon {
  color: rgb(248, 197, 23) !important;
}

[data-icon="ebpf"] .v-icon {
  color: rgb(247, 147, 30) !important;
}

[data-icon="git"] .v-icon {
  color: rgb(240, 80, 50) !important;
}

[data-icon="linux"] .v-icon {
  color: rgb(252, 198, 36) !important;
}

[data-icon="webassembly"] .v-icon {
  color: rgb(101, 79, 240) !important;
}
</style>
