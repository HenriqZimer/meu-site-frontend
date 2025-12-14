<template>
  <div class="modern-course-item" :class="itemClasses" :style="itemStyles" role="listitem">
    <a :href="course.link" target="_blank" rel="noopener noreferrer" class="course-link"
      :aria-label="`Abrir detalhes do curso ${course.name}`">
      <!-- Course Image/Icon -->
      <div class="course-image-container">
        <div v-if="course.image" class="course-image-wrapper">
          <img :src="course.image" :alt="`Logo ${course.platform}`" class="course-image" loading="lazy" />
        </div>
        <div v-else class="course-icon-wrapper" :style="iconWrapperStyles">
          <v-icon :icon="course.icon || defaultIcon" :color="course.color || 'primary'" size="32" />
        </div>
      </div>

      <!-- Course Info -->
      <div class="course-info">
        <div class="course-header-info">
          <h3 class="course-name">{{ course.name }}</h3>
          <div class="course-meta">
            <span class="course-platform">
              <v-icon icon="mdi-school-outline" size="14" />
              {{ course.platform }}
            </span>
            <span v-if="course.duration" class="course-duration">
              <v-icon icon="mdi-clock-outline" size="14" />
              {{ course.duration }}
            </span>
          </div>
          <div v-if="course.instructor" class="course-instructor">
            <v-icon icon="mdi-account-tie" size="14" />
            {{ course.instructor }}
          </div>
        </div>

        <!-- Progress Bar for In-Progress Courses -->
        <div v-if="type === 'in-progress' && course.progress !== undefined" class="course-progress">
          <div class="progress-info">
            <span class="progress-label">Progresso</span>
            <span class="progress-value">{{ course.progress }}%</span>
          </div>
          <v-progress-linear :model-value="course.progress" color="primary" bg-color="surface-variant" height="6"
            rounded class="progress-bar" />
        </div>

        <!-- Status Badge -->
        <div v-if="showStatus" class="course-status">
          <v-chip :color="statusConfig.color" :prepend-icon="statusConfig.icon" size="small" variant="flat"
            class="status-chip">
            {{ statusConfig.label }}
          </v-chip>
        </div>
      </div>

      <!-- External Link Icon -->
      <div class="course-action">
        <v-icon icon="mdi-open-in-new" size="20" class="external-icon" color="primary" />
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Types
interface Course {
  name: string;
  platform: string;
  instructor?: string;
  duration?: string;
  icon?: string;
  color?: string;
  image?: string;
  link: string;
  progress?: number;
}

// Props
interface Props {
  course: Course;
  index: number;
  animationDelay?: number;
  type: "completed" | "in-progress" | "planned";
  showStatus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  animationDelay: 0,
  showStatus: true,
});

// Composables
const { isMobile } = useResponsive();

// Computed
const defaultIcon = computed(() => {
  if (props.type === "completed") return "mdi-check-circle";
  if (props.type === "planned") return "mdi-target";
  return "mdi-progress-clock";
});

const itemClasses = computed(() => [
  `course-item--${props.type}`,
  {
    "course-item--mobile": isMobile.value,
  },
]);

const itemStyles = computed(() => ({
  "--animation-delay": `${props.animationDelay}ms`,
  "--index": props.index,
}));

const iconWrapperStyles = computed(() => ({
  background: props.course.color
    ? `color-mix(in srgb, var(--v-theme-${props.course.color}) 20%, transparent)`
    : 'rgba(var(--v-theme-primary), 0.1)',
}));

const statusConfig = computed(() => {
  if (props.type === "completed") {
    return {
      label: "Concluído",
      icon: "mdi-check-circle",
      color: "success",
    };
  } else if (props.type === "planned") {
    return {
      label: "Planejado",
      icon: "mdi-target",
      color: "info",
    };
  } else {
    return {
      label: "Em Andamento",
      icon: "mdi-progress-clock",
      color: "primary",
    };
  }
});
</script>

<style scoped>
.modern-course-item {
  margin-bottom: 16px;
  opacity: 1;
}

.course-link {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.course-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg,
      rgb(var(--v-theme-primary)),
      rgb(var(--v-theme-secondary)));
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.course-link:hover {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-color: rgba(var(--v-theme-primary), 0.3);
  transform: translateX(4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.course-link:hover::before {
  transform: scaleY(1);
}

.course-link:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Image/Icon Container */
.course-image-container {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
}

.course-image-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.course-link:hover .course-image {
  transform: scale(1.1);
}

.course-icon-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.course-link:hover .course-icon-wrapper {
  transform: scale(1.05) rotate(5deg);
}

/* Course Info */
.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.course-header-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.course-name {
  font-size: 16px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.4;
  margin: 0;
  transition: color 0.3s ease;
}

.course-link:hover .course-name {
  color: rgb(var(--v-theme-primary));
}

.course-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
}

.course-platform,
.course-duration,
.course-instructor {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant));
}

.course-instructor {
  font-style: italic;
}

/* Progress Bar */
.course-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 11px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-value {
  font-size: 12px;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.progress-bar {
  border-radius: 4px;
}

/* Status */
.course-status {
  display: flex;
  align-items: center;
}

.status-chip {
  font-size: 11px;
  font-weight: 600;
  height: 24px !important;
  padding: 0 10px !important;
}

/* Action Icon */
.course-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.external-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.course-link:hover .course-action {
  background: rgba(var(--v-theme-primary), 0.2);
  transform: scale(1.1);
}

.course-link:hover .external-icon {
  transform: rotate(45deg);
}

/* Type Specific Styles */
.course-item--completed .course-link::before {
  background: linear-gradient(180deg,
      rgb(var(--v-theme-success)),
      color-mix(in srgb, rgb(var(--v-theme-success)) 70%, black));
}

.course-item--in-progress .course-link::before {
  background: linear-gradient(180deg,
      rgb(var(--v-theme-primary)),
      rgb(var(--v-theme-secondary)));
}

/* Responsive */
@media (max-width: 960px) {
  .course-link {
    padding: 14px;
    gap: 12px;
  }

  .course-image-container {
    width: 56px;
    height: 56px;
  }

  .course-name {
    font-size: 15px;
  }

  .course-action {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 600px) {
  .modern-course-item {
    margin-bottom: 12px;
  }

  .course-link {
    padding: 12px;
    gap: 12px;
  }

  .course-image-container {
    width: 48px;
    height: 48px;
  }

  .course-name {
    font-size: 14px;
  }

  .course-meta {
    gap: 8px;
  }

  .course-platform,
  .course-duration,
  .course-instructor {
    font-size: 11px;
  }

  .course-action {
    display: none;
  }
}
</style>
