<template>
  <Section id="courses" badge="Cursos" badge-icon="mdi-school" badge-color="success" title-prefix="Meus"
    title-highlight="Cursos Concluídos"
    description="Aprendizado contínuo através de cursos e especializações nas melhores plataformas de ensino online"
    section-class="section-modern" container-class="section-container">

    <!-- Statistics Overview -->
    <div class="mb-8 mb-md-10">
      <StatsGrid class="teste" :items="stats" variant="stats" :columns="{ xs: 1, sm: 2, md: 4, lg: 4 }"
        :base-delay="200" :delay-increment="100" custom-class="stats-section" />
    </div>

    <!-- Modern Course Cards Grid -->
    <div class="courses-grid-container">
      <div v-for="(yearGroup, yearIndex) in coursesByYear" :key="yearGroup.year" class="year-section"
        :class="yearGroup.year === 'Planejados' ? 'year-section--planned' : 'year-section--completed'">
        <!-- Year Header -->
        <div class="year-header" data-animate="fade-up" :data-delay="yearIndex * 150">
          <div class="year-header-content">
            <div class="year-icon-wrapper">
              <v-icon icon="mdi-calendar" size="32" class="year-icon" />
            </div>
            <div class="year-info">
              <h3 class="year-title">{{ yearGroup.year }}</h3>
              <p class="year-count">
                {{ yearGroup.courses.length }} {{ yearGroup.courses.length === 1 ? 'curso' : 'cursos' }}
              </p>
            </div>
          </div>
          <div class="year-divider"></div>
        </div>

        <!-- Course Cards Grid -->
        <v-row class="courses-grid" justify="center">
          <v-col v-for="(course, index) in getVisibleCourses(yearGroup)" :key="`${course.name}-${index}`" cols="12" sm="6" md="4"
            class="course-col">
            <div class="course-card-wrapper" data-animate="flip-in" :data-delay="yearIndex * 150 + index * 100"
              @mouseenter="handleCardHover($event)" @mousemove="handleCardMove($event)"
              @mouseleave="handleCardLeave($event)">
              <v-card class="course-card" elevation="0">
                <!-- Course Image/Icon -->
                <div class="course-image-wrapper">
                  <img v-if="course.image" :src="course.image" :alt="course.name" class="course-image" />
                  <div v-else class="course-icon-placeholder">
                    <v-icon icon="mdi-school" size="64" />
                  </div>
                  <div class="course-image-overlay" />
                </div>

                <!-- Course Content -->
                <v-card-text class="course-content">
                  <h4 class="course-name">{{ course.name }}</h4>

                  <div class="course-meta">
                    <div v-if="course.platform" class="course-platform">
                      <v-icon icon="mdi-domain" size="14" />
                      <span>{{ course.platform }}</span>
                    </div>

                    <div v-if="course.instructor" class="course-instructor">
                      <v-icon icon="mdi-account" size="14" />
                      <span>{{ course.instructor }}</span>
                    </div>

                    <div v-if="course.duration" class="course-duration">
                      <v-icon icon="mdi-clock-outline" size="14" />
                      <span>{{ course.duration }}</span>
                    </div>
                  </div>

                  <!-- View Certificate Button -->
                  <v-btn v-if="course.link" :href="course.link" target="_blank" variant="flat" color="primary"
                    size="small" class="course-btn mt-3" block>
                    <v-icon start>mdi-certificate</v-icon>
                    Ver Certificado
                  </v-btn>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>

        <!-- Ver Mais Button -->
        <div v-if="shouldShowMoreButton(yearGroup)" class="text-center mt-6">
          <v-btn
            variant="outlined"
            color="primary"
            size="large"
            class="see-more-btn"
            @click="toggleYearExpansion(yearGroup.year)"
          >
            <v-icon start>{{ isYearExpanded(yearGroup.year) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            {{ isYearExpanded(yearGroup.year) ? 'Ver Menos' : `Ver Mais (${yearGroup.courses.length - 3})` }}
          </v-btn>
        </div>
      </div>
    </div>
  </Section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MENU_ITEMS, SCROLL_CONFIG } from '~/constants'
import CertificationItem from '~/components/base/CertificationItem.vue'
import type { Stat } from '~/components/base/StatsGrid.vue'

// Types & Interfaces
interface Course {
  name: string
  platform: string
  instructor?: string
  duration?: string
  icon?: string
  color?: string
  image?: string
  link: string
  year?: string
}

interface YearGroup {
  year: string
  courses: Course[]
}

// Store
const coursesStore = useCoursesStore()

// Carregar cursos da API no onMounted
onMounted(async () => {
  await coursesStore.fetchCourses()
  observeElements({
    threshold: 0.1,
    once: true
  })
})

// Computed do store
const allCourses = computed(() => coursesStore.allCourses)
const completedCourses = computed(() => coursesStore.completedCourses)
const totalHours = computed(() => coursesStore.totalHours)
const loading = computed(() => coursesStore.loading)

// Stats dos cursos
const stats = computed<Stat[]>(() => [
  {
    icon: 'mdi-school',
    value: completedCourses.value.length,
    label: 'Cursos Concluídos',
    color: 'primary'
  },
  {
    icon: 'mdi-clock-outline',
    value: `${Math.round(totalHours.value)}h`,
    label: 'Horas de Estudo',
    color: 'success'
  }
])

// Composables
const { isMobile, isTablet, isDesktop, getResponsiveValue } = useResponsive()

// Scroll Animation
const { observeElements } = useScrollAnimation()

// Agrupar cursos por ano (usa getter da store)
const coursesByYear = computed(() => coursesStore.coursesByYear)

// Estado de expansão dos anos
const expandedYears = ref<Set<string>>(new Set())

// Verificar se deve mostrar botão "ver mais"
const shouldShowMoreButton = (yearGroup: YearGroup) => {
  return yearGroup.courses.length > 3
}

// Verificar se ano está expandido
const isYearExpanded = (year: string) => {
  return expandedYears.value.has(year)
}

// Alternar expansão do ano
const toggleYearExpansion = (year: string) => {
  if (expandedYears.value.has(year)) {
    expandedYears.value.delete(year)
  } else {
    expandedYears.value.add(year)
  }
}

// Obter cursos visíveis (primeiros 3 ou todos se expandido)
const getVisibleCourses = (yearGroup: YearGroup) => {
  if (isYearExpanded(yearGroup.year) || yearGroup.courses.length <= 3) {
    return yearGroup.courses
  }
  return yearGroup.courses.slice(0, 3)
}

// 3D Parallax hover effect
const handleCardHover = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement
  card.style.transition = 'transform 0.1s ease-out'
}

const handleCardMove = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -8
  const rotateY = ((x - centerX) / centerX) * 8

  card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)'
}

const handleCardLeave = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement
  card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
}
</script>

<style scoped>
/* === GRID CONTAINER === */
.courses-grid-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* === YEAR SECTION === */
.year-section {
  margin-bottom: 80px;
}

.year-section:last-child {
  margin-bottom: 0;
}

/* === YEAR HEADER === */
.year-header {
  margin-bottom: 40px;
  opacity: 0;
}

.year-header[data-animate="fade-up"] {
  animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.year-header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.year-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.year-icon-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.year-header:hover .year-icon-wrapper::before {
  opacity: 1;
}

.year-icon {
  color: #3b82f6;
  transition: transform 0.3s ease;
}

.year-header:hover .year-icon {
  transform: rotate(360deg) scale(1.1);
}

.year-info {
  flex: 1;
}

.year-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
}

.year-count {
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 4px 0 0;
  font-weight: 500;
}

.year-divider {
  height: 2px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
  border-radius: 2px;
}

/* === PLANNED YEAR VARIANT === */
.year-section--planned .year-icon-wrapper {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

.year-section--planned .year-icon-wrapper::before {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, transparent 100%);
}

.year-section--planned .year-icon {
  color: #f59e0b;
}

.year-section--planned .year-title {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.year-section--planned .year-divider {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.5) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 100%);
}

/* === COURSE CARDS GRID === */
.courses-grid {
  margin: 0 -12px;
}

.course-col {
  padding: 12px;
}

.course-card-wrapper {
  height: 100%;
  opacity: 0;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.course-card-wrapper[data-animate="flip-in"] {
  animation: flipIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.course-card {
  height: 100%;
  background: rgba(15, 23, 42, 0.6) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(59, 130, 246, 0.15) !important;
  border-radius: 20px !important;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.course-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.course-card-wrapper:hover .course-card {
  border-color: rgba(59, 130, 246, 0.4) !important;
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
  transform: translateY(-4px);
}

.course-card-wrapper:hover .course-card::before {
  opacity: 1;
}

/* === COURSE IMAGE === */
.course-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.8);
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.course-icon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.course-icon-placeholder .v-icon {
  color: rgba(59, 130, 246, 0.4);
}

.course-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.8) 100%);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.course-card-wrapper:hover .course-image {
  transform: scale(1.1);
}

.course-card-wrapper:hover .course-image-overlay {
  opacity: 0.4;
}

/* === COURSE CONTENT === */
.course-content {
  padding: 20px !important;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8rem;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.course-platform,
.course-instructor,
.course-duration {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.4;
}

.course-platform .v-icon,
.course-instructor .v-icon,
.course-duration .v-icon {
  color: rgba(59, 130, 246, 0.6);
  flex-shrink: 0;
}

.course-platform span,
.course-instructor span,
.course-duration span {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* === COURSE BUTTON === */
.course-btn {
  background: rgba(59, 130, 246, 0.12) !important;
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa !important;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
  transition: all 0.3s ease;
}

.course-btn:hover {
  background: rgba(59, 130, 246, 0.2) !important;
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.course-btn .v-icon {
  transition: transform 0.3s ease;
}

.course-btn:hover .v-icon {
  transform: rotate(12deg) scale(1.1);
}

/* === VER MAIS BUTTON === */
.see-more-btn {
  border-radius: 12px !important;
  border-width: 2px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  padding: 12px 32px !important;
  transition: all 0.3s ease !important;
}

.see-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3) !important;
  background: rgba(59, 130, 246, 0.1) !important;
}

.see-more-btn .v-icon {
  transition: transform 0.3s ease;
}

.see-more-btn:hover .v-icon {
  transform: scale(1.2);
}

/* === ANIMATIONS === */
@keyframes flipIn {
  0% {
    opacity: 0;
    transform: perspective(1000px) rotateY(-90deg) scale(0.8);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    transform: perspective(1000px) rotateY(0deg) scale(1);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === RESPONSIVE === */
@media (max-width: 960px) {
  .year-section {
    margin-bottom: 60px;
  }

  .year-header {
    margin-bottom: 30px;
  }

  .year-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .year-title {
    font-size: 1.75rem;
  }

  .course-image-wrapper {
    height: 180px;
  }
}

@media (max-width: 600px) {
  .year-section {
    margin-bottom: 48px;
  }

  .year-header-content {
    gap: 16px;
  }

  .year-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .year-icon {
    font-size: 24px !important;
  }

  .year-title {
    font-size: 1.5rem;
  }

  .year-count {
    font-size: 0.875rem;
  }

  .course-image-wrapper {
    height: 160px;
  }

  .course-content {
    padding: 16px !important;
  }

  .course-name {
    font-size: 1rem;
    min-height: 2.5rem;
  }
}

/* Header Section */
.modern-courses .courses-header {
  text-align: center;
  margin-bottom: 80px;
}

.modern-courses .section-title {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.2s;
}

.modern-courses .section-badge {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: rgba(59, 130, 246, 0.15) !important;
  color: rgb(96, 165, 250) !important;
  padding: 8px 16px !important;
  border-radius: 24px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  margin-bottom: 16px !important;
  border: 1px solid rgba(59, 130, 246, 0.3) !important;
  backdrop-filter: blur(10px) !important;
}

.modern-courses .section-badge .v-icon {
  color: rgb(96, 165, 250) !important;
  background: transparent !important;
  background-color: transparent !important;
}

.modern-courses .section-badge.primary-theme {
  background: rgba(59, 130, 246, 0.15) !important;
  color: rgb(96, 165, 250) !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
}

.modern-courses .section-badge.primary-theme .v-icon {
  color: rgb(96, 165, 250) !important;
  background: transparent !important;
  background-color: transparent !important;
}

.modern-courses .section-description {
  font-size: 1.2rem;
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 600px;
  margin: 0 auto 48px;
  line-height: 1.6;
}

/* Statistics Overview */
.modern-courses .stats-overview {
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.6s;
}

.modern-courses .stat-item {
  opacity: 0;
  animation: fadeInScale 0.6s ease forwards;
}

.modern-courses .stat-item[data-animate-delay="0"] {
  animation-delay: 0.8s;
}

.modern-courses .stat-item[data-animate-delay="100"] {
  animation-delay: 0.9s;
}

.modern-courses .stat-item[data-animate-delay="200"] {
  animation-delay: 1.0s;
}

.modern-courses .stat-item[data-animate-delay="300"] {
  animation-delay: 1.1s;
}

.modern-courses .stat-card {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-outline), 0.15);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.modern-courses .stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, rgb(59, 130, 246), rgb(96, 165, 250)) !important;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.modern-courses .stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.25);
  border-color: rgba(96, 165, 250, 0.5);
  background: rgba(var(--v-theme-surface), 0.95);
}

.modern-courses .stat-card:hover::before {
  transform: scaleX(1);
}

.modern-courses .stat-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

/* Primary color (Total) */
.modern-courses .stat-item:nth-child(1) .stat-icon-wrapper {
  background: rgba(59, 130, 246, 0.1) !important;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.modern-courses .stat-item:nth-child(1) .stat-card:hover .stat-icon-wrapper {
  background: rgba(59, 130, 246, 0.2) !important;
  border-color: rgba(59, 130, 246, 0.4);
}

.modern-courses .stat-item:nth-child(1) .stat-icon {
  color: #3b82f6 !important;
}

.modern-courses .stat-item:nth-child(1) .stat-value {
  color: #3b82f6 !important;
}

/* Success color (Concluídos) */
.modern-courses .stat-item:nth-child(2) .stat-icon-wrapper {
  background: rgba(16, 185, 129, 0.1) !important;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.modern-courses .stat-item:nth-child(2) .stat-card:hover .stat-icon-wrapper {
  background: rgba(16, 185, 129, 0.2) !important;
  border-color: rgba(16, 185, 129, 0.4);
}

.modern-courses .stat-item:nth-child(2) .stat-icon {
  color: #10b981 !important;
}

.modern-courses .stat-item:nth-child(2) .stat-value {
  color: #10b981 !important;
}

/* Info color (Planejados) */
.modern-courses .stat-item:nth-child(3) .stat-icon-wrapper {
  background: rgba(6, 182, 212, 0.1) !important;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.modern-courses .stat-item:nth-child(3) .stat-card:hover .stat-icon-wrapper {
  background: rgba(6, 182, 212, 0.2) !important;
  border-color: rgba(6, 182, 212, 0.4);
}

.modern-courses .stat-item:nth-child(3) .stat-icon {
  color: #06b6d4 !important;
}

.modern-courses .stat-item:nth-child(3) .stat-value {
  color: #06b6d4 !important;
}

/* Warning color (Horas) */
.modern-courses .stat-item:nth-child(4) .stat-icon-wrapper {
  background: rgba(245, 158, 11, 0.1) !important;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.modern-courses .stat-item:nth-child(4) .stat-card:hover .stat-icon-wrapper {
  background: rgba(245, 158, 11, 0.2) !important;
  border-color: rgba(245, 158, 11, 0.4);
}

.modern-courses .stat-item:nth-child(4) .stat-icon {
  color: #f59e0b !important;
}

.modern-courses .stat-item:nth-child(4) .stat-value {
  color: #f59e0b !important;
}

.modern-courses .stat-icon {
  transition: all 0.3s ease;
  background: transparent !important;
  background-color: transparent !important;
}

.modern-courses .stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.modern-courses .stat-content {
  margin-top: 8px;
}

.modern-courses .stat-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
  color: rgb(var(--v-theme-on-surface));
}

.modern-courses .stat-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Progress Section */
.modern-courses .progress-section {
  max-width: 400px;
  margin: 0 auto;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 1.2s;
}

.modern-courses .progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.modern-courses .progress-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-courses .progress-percentage {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(96, 165, 250) !important;
}

.modern-courses .progress-bar {
  border-radius: 4px;
  overflow: hidden;
}

/* Courses Timeline */
.modern-courses .courses-timeline {
  max-width: 1100px;
  margin: 0 auto;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.6s;
  display: none;
}

.modern-courses .courses-expansion-panels {
  background: transparent !important;
}

.modern-courses .year-panel {
  background: rgba(var(--v-theme-surface), 0.95) !important;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(59, 130, 246, 0.3) !important;
  border-radius: 16px !important;
  margin-bottom: 20px !important;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Borda azul para todos os painéis */
.modern-courses .year-panel:hover {
  border-color: rgba(59, 130, 246, 0.6) !important;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

.modern-courses .year-panel-title {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(96, 165, 250, 0.04)) !important;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.08);
  padding: 20px 24px !important;
  min-height: auto !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-courses .year-panel:hover .year-panel-title {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(96, 165, 250, 0.06)) !important;
}

.modern-courses .year-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modern-courses .year-icon {
  color: rgb(96, 165, 250) !important;
  background-color: transparent !important;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-courses .year-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  background: linear-gradient(135deg, rgb(59, 130, 246), rgb(96, 165, 250));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-courses .year-badge {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 12px;
}

.modern-courses .year-panel:hover .year-badge {
  transform: scale(1.05);
}

.modern-courses .year-panel-content {
  padding: 24px 24px 24px 24px !important;
  background: transparent !important;
}

/* Courses List Wrapper with Scroll - Limited to 4 items */
.modern-courses .courses-list-wrapper {
  max-height: 360px;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgb(59, 130, 246) rgba(var(--v-theme-surface-bright), 0.3);
}

.modern-courses .courses-list-wrapper::-webkit-scrollbar {
  width: 6px;
}

.modern-courses .courses-list-wrapper::-webkit-scrollbar-track {
  background: rgba(var(--v-theme-surface-bright), 0.3);
  border-radius: 3px;
}

.modern-courses .courses-list-wrapper::-webkit-scrollbar-thumb {
  background: rgb(59, 130, 246);
  border-radius: 3px;
}

.modern-courses .courses-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgb(37, 99, 235);
}

/* Smooth expansion animation */
.modern-courses .v-expansion-panel-text__wrapper {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.modern-courses .v-expansion-panel__shadow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Courses List inside Panel */
.modern-courses .courses-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeInContent 0.6s ease forwards;
  padding: 8px 0;
}

.v-expansion-panel-text__wrapper {
  padding: 0px !important;
}

.courses-list {
  padding-bottom: 16px !important;
}

@keyframes fadeInContent {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animations */
/* fadeInUp and fadeInScale moved to /assets/css/components.css */

/* Responsive */
@media (max-width: 1024px) {
  .modern-courses {
    padding: 100px 0 60px;
  }

  .courses-container {
    padding: 0 20px;
  }

  .courses-timeline {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .modern-courses {
    padding: 80px 0 60px;
  }

  .courses-container {
    padding: 0 16px;
  }

  .courses-header {
    margin-bottom: 64px;
  }

  .stats-overview {
    margin-bottom: 32px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .progress-section {
    max-width: 300px;
  }

  .courses-timeline {
    padding: 0 8px;
  }

  .year-panel-title {
    padding: 16px !important;
  }

  .year-text {
    font-size: 1.1rem;
  }

  .year-panel-content {
    padding: 16px !important;
  }

  .courses-list {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .modern-courses {
    padding: 60px 0 40px;
  }

  .courses-container {
    padding: 0 16px;
  }

  .stats-overview {
    margin-bottom: 24px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .stat-icon-wrapper {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
  }

  .progress-section {
    max-width: 250px;
  }

  .progress-label {
    font-size: 0.75rem;
  }

  .progress-percentage {
    font-size: 1.125rem;
  }
}

/* Extra small screens */
@media (max-width: 400px) {
  .courses-container {
    padding: 0 12px;
  }

  .modern-courses {
    padding: 50px 0 30px;
  }

  .progress-section {
    max-width: 200px;
  }

  .year-panel {
    margin-bottom: 16px !important;
  }
}
</style>
