<template>
  <section
    :id="id"
    :class="['modern-section', sectionClass, themeClass]"
    :style="{ background: backgroundColor }"
  >
    <!-- Decorative top border -->
    <div class="section-border-top" />

    <v-container :class="containerClass">
      <!-- Section Header -->
      <div v-if="!noHeader" :class="headerCentered ? 'text-center' : 'text-left'">
        <SectionHeader
          v-if="badge || titlePrefix || titleHighlight || description"
          :badge="badge"
          :icon="badgeIcon"
          :badge-color="badgeColor"
          :title-prefix="titlePrefix"
          :title-highlight="titleHighlight"
          :description="description"
          :centered="headerCentered"
        />
      </div>

      <!-- Section Content -->
      <div class="section-content">
        <slot />
      </div>
    </v-container>

    <!-- Decorative background -->
    <div v-if="decorative" class="section-bg-decoration" />
  </section>
</template>

<script setup lang="ts">
interface Props {
  id: string
  badge?: string
  badgeIcon?: string
  badgeColor?: string
  titlePrefix?: string
  titleHighlight?: string
  description?: string
  sectionClass?: string
  containerClass?: string
  headerCentered?: boolean
  noHeader?: boolean
  theme?: 'default' | 'primary' | 'dark' | 'gradient'
  backgroundColor?: string
  decorative?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  badge: '',
  badgeIcon: '',
  badgeColor: 'primary',
  titlePrefix: '',
  titleHighlight: '',
  description: '',
  sectionClass: 'py-16 py-md-20',
  containerClass: '',
  headerCentered: true,
  noHeader: false,
  theme: 'default',
  backgroundColor: '',
  decorative: true,
})

const themeClass = computed(() => {
  switch (props.theme) {
    case 'primary':
      return 'section-theme-primary'
    case 'dark':
      return 'section-theme-dark'
    case 'gradient':
      return 'section-theme-gradient'
    default:
      return ''
  }
})
</script>

<style scoped>
/* ===================================
   MODERN SECTION BASE
   =================================== */
.modern-section {
  position: relative;
  background: rgb(15, 23, 42);
  overflow: hidden;
}

.section-border-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
}

.section-content {
  position: relative;
  z-index: 1;
}

/* ===================================
   SECTION THEMES
   =================================== */
.section-theme-primary {
  background: linear-gradient(135deg, rgb(15, 23, 42) 0%, rgba(30, 41, 59, 0.95) 100%);
}

.section-theme-dark {
  background: rgb(10, 15, 30);
}

.section-theme-gradient {
  background: linear-gradient(
    135deg,
    rgb(15, 23, 42) 0%,
    rgb(30, 41, 59) 50%,
    rgb(15, 23, 42) 100%
  );
}

/* ===================================
   DECORATIVE BACKGROUND
   =================================== */
.section-bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%);
  animation: floatingBackground 20s ease-in-out infinite;
}

/* ===================================
   ANIMATIONS
   =================================== */
@keyframes floatingBackground {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -30px) scale(1.1);
  }

  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}

/* ===================================
   RESPONSIVE
   =================================== */
@media (max-width: 960px) {
  .modern-section {
    padding-top: 80px !important;
    padding-bottom: 80px !important;
  }
}

@media (max-width: 600px) {
  .modern-section {
    padding-top: 60px !important;
    padding-bottom: 60px !important;
  }
}
</style>
