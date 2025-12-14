<template>
  <a :href="demoUrl || githubUrl" target="_blank" rel="noopener noreferrer" class="project-card-modern"
    :style="cardStyles">
    <!-- Left Border Indicator -->
    <div class="card-border-indicator" />

    <!-- Project Image -->
    <div v-if="image || $slots.image" class="project-image-container">
      <div class="project-image-wrapper">
        <img :src="image" :alt="imageAlt" :loading="lazy ? 'lazy' : 'eager'" class="project-image" />
      </div>

      <!-- Status Badge Overlay -->
      <div class="status-badge-overlay">
        <v-chip v-if="featured" size="small" variant="flat" color="warning" prepend-icon="mdi-star" class="mb-1">
          Destaque
        </v-chip>
      </div>
    </div>

    <!-- Project Content -->
    <div class="project-content">
      <div class="project-header">
        <h3 class="project-title">{{ title }}</h3>
        <p class="project-description">{{ description }}</p>
      </div>

      <!-- Tech Stack -->
      <div v-if="technologies && technologies.length" class="tech-stack">
        <span v-for="tech in technologies.slice(0, 4)" :key="tech" class="tech-tag">
          {{ tech }}
        </span>
        <span v-if="technologies.length > 4" class="tech-more">
          +{{ technologies.length - 4 }}
        </span>
      </div>

      <!-- Action Links -->
      <div class="project-actions">
        <v-btn v-if="demoUrl" variant="text" size="small" color="primary" :href="demoUrl" target="_blank"
          class="action-link" @click.stop>
          <v-icon start size="16">mdi-open-in-new</v-icon>
          Demo
        </v-btn>
        <v-btn v-if="githubUrl" variant="text" size="small" color="primary" :href="githubUrl" target="_blank"
          class="action-link" @click.stop>
          <v-icon start size="16">mdi-github</v-icon>
          Código
        </v-btn>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  technologies?: string[];
  demoUrl?: string;
  githubUrl?: string;
  lazy?: boolean;
  animationDelay?: number;
  featured?: boolean;
  status?: "completed" | "in-progress" | "planning";
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  image: "",
  imageAlt: "",
  technologies: () => [],
  demoUrl: "",
  githubUrl: "",
  lazy: true,
  animationDelay: 0,
  featured: false,
  status: "completed",
});

// Helper methods
// const getStatusIcon = (status: string) => {
//   const icons = {
//     completed: "mdi-check-circle",
//     "in-progress": "mdi-progress-clock",
//     planning: "mdi-lightbulb-outline",
//   };
//   return icons[status as keyof typeof icons] || "mdi-help-circle";
// };

// const getStatusLabel = (status: string) => {
//   const labels = {
//     completed: "Concluído",
//     "in-progress": "Em Andamento",
//     planning: "Planejado",
//   };
//   return labels[status as keyof typeof labels] || "Desconhecido";
// };

// const getStatusColor = (status: string) => {
//   const colors = {
//     completed: "success",
//     "in-progress": "primary",
//     planning: "info",
//   };
//   return colors[status as keyof typeof colors] || "default";
// };

// Computed properties
const cardStyles = computed(() => ({
  "--animation-delay": `${props.animationDelay}ms`,
}));
</script>

<style scoped>
/* === PROJECT CARD === */
.project-card-modern {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: var(--animation-delay);
}

.project-card-modern:hover {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.project-card-modern:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Left Border Indicator */
.card-border-indicator {
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
  z-index: 2;
}

.project-card-modern:hover .card-border-indicator {
  transform: scaleY(1);
}

/* === IMAGE CONTAINER === */
.project-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.05) 0%, rgba(var(--v-theme-surface), 0.02) 100%);
}

.project-image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
}

.project-card-modern:hover .project-image {
  transform: scale(1.05);
}

/* Status Badge Overlay */
.status-badge-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  z-index: 2;
}

/* === CONTENT === */
.project-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.project-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.4;
  margin: 0;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card-modern:hover .project-title {
  color: rgb(var(--v-theme-primary));
}

.project-description {
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* === TECH STACK === */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.tech-tag {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  border-radius: 6px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  transition: all 0.2s ease;
}

.tech-tag:hover {
  background: rgba(var(--v-theme-primary), 0.2);
  transform: translateY(-1px);
}

.tech-more {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  background: transparent;
  color: rgb(var(--v-theme-on-surface-variant));
  border-radius: 6px;
  border: 1px solid rgba(var(--v-theme-on-surface-variant), 0.3);
}

/* === ACTION LINKS === */
.project-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.action-link {
  font-size: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.02em;
}

/* Action Icon */
.card-action {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  opacity: 0;
}

.action-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card-modern:hover .card-action {
  background: rgba(var(--v-theme-primary), 0.2);
  transform: scale(1.1);
  opacity: 1;
}

/* === ANIMATIONS === */
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

/* === RESPONSIVE === */
@media (max-width: 960px) {
  .project-image-container {
    height: 180px;
  }

  .project-content {
    padding: 14px;
  }

  .project-title {
    font-size: 17px;
  }

  .card-action {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 600px) {
  .project-image-container {
    height: 160px;
  }

  .project-content {
    padding: 12px;
    gap: 10px;
  }

  .project-title {
    font-size: 16px;
  }

  .project-description {
    font-size: 13px;
  }

  .tech-stack {
    gap: 6px;
  }

  .tech-tag,
  .tech-more {
    font-size: 10px;
    padding: 3px 8px;
  }

  .card-action {
    display: none;
  }

  .status-badge-overlay {
    top: 8px;
    right: 8px;
  }
}
</style>
