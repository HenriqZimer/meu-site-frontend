<template>
  <div :class="containerClasses" data-animate="fade-up" :data-delay="baseDelay">
    <div :class="gridClasses">
      <div v-for="(item, index) in items" :key="index" :class="itemClasses" data-animate="fade-up"
        :data-delay="index * delayIncrement">
        <div :class="cardClasses" :style="getCardStyle(item)">
          <div :class="iconWrapperClasses">
            <v-icon :icon="item.icon" :color="item.color || 'primary'" :size="iconSize" class="stat-icon" />
          </div>
          <div class="stat-content">
            <div v-if="item.title" class="stat-title">{{ item.title }}</div>
            <div v-if="item.value !== undefined" class="stat-value" :class="item.color ? `text-${item.color}` : ''">
              {{ item.value }}
            </div>
            <div class="stat-label">{{ item.label || item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { GRID_LAYOUTS, ANIMATION_DELAYS } from "~/constants";

export interface Stat {
  icon: string;
  value?: string | number;
  label?: string;
  title?: string;
  description?: string;
  color?: string;
  variant?: 'past' | 'present' | 'future';
}

interface Props {
  items: Stat[];
  stats?: Stat[]; // Backward compatibility
  layout?: { cols: number; sm: number; md?: number; lg?: number };
  iconSize?: string | number;
  baseDelay?: number;
  delayIncrement?: number;
  customClass?: string;
  variant?: 'stats' | 'cards' | 'story';
  columns?: { xs?: number; sm?: number; md?: number; lg?: number };
}

const props = withDefaults(defineProps<Props>(), {
  layout: () => GRID_LAYOUTS.STATS,
  iconSize: 32,
  baseDelay: ANIMATION_DELAYS.CONTENT,
  delayIncrement: 100,
  customClass: "",
  variant: 'stats',
  columns: () => ({ xs: 1, sm: 2, md: 3, lg: 4 }),
});

// Backward compatibility: use stats if items not provided
const items = computed(() => props.items || props.stats || []);

const containerClasses = computed(() => [
  "stats-overview",
  `stats-overview--${props.variant}`,
  props.customClass,
]);

const gridClasses = computed(() => {
  const classes = ['stats-grid'];
  if (props.variant === 'story') {
    classes.push('stats-grid--story');
  }
  return classes;
});

const itemClasses = computed(() => {
  const classes = ['stat-item'];
  if (props.variant === 'story') {
    classes.push('stat-item--story');
  }
  return classes;
});

const cardClasses = computed(() => {
  const classes = ['stat-card'];
  if (props.variant === 'story') {
    classes.push('stat-card--story');
  }
  return classes;
});

const iconWrapperClasses = computed(() => {
  const classes = ['stat-icon-wrapper'];
  if (props.variant === 'story') {
    classes.push('stat-icon-wrapper--story');
  }
  return classes;
});

const getCardStyle = (item: Stat) => {
  if (props.variant === 'story' && item.variant) {
    const colorMap = {
      past: 'rgba(139, 92, 246, 0.1)',
      present: 'rgba(59, 130, 246, 0.1)',
      future: 'rgba(34, 211, 238, 0.1)'
    };
    return {
      '--variant-color': colorMap[item.variant] || ''
    };
  }
  return {};
};
</script>

<style scoped>
.stats-overview {
  margin: 32px auto;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Grid Layout */
.stats-grid {
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
}

.stats-grid--story {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

/* Item Wrapper */
.stat-item {
  flex: 0 0 auto;
  width: 280px;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.stat-item--story {
  min-height: 220px;
  width: auto;
  flex: 1 1 300px;
}

/* Card Styles */
.stat-card {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  min-height: 120px;
}

.stat-card--story {
  flex-direction: column;
  align-items: flex-start;
  padding: 32px;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.stat-card--story::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-card--story:hover::before {
  transform: scaleX(1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.stat-card--story:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.25);
  border-color: rgb(96, 165, 250);
}

/* Icon Wrapper */
.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.stat-icon-wrapper--story {
  border: 2px solid rgba(59, 130, 246, 0.3);
  background: transparent;
}

.stat-icon {
  transition: transform 0.3s ease;
  background: transparent !important;
  background-color: transparent !important;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-card--story:hover .stat-icon-wrapper {
  transform: scale(1.1);
}

/* Icon colors for story variants */
.stat-card--story[style*="past"] .stat-icon-wrapper {
  border-color: rgb(139, 92, 246);
}

.stat-card--story[style*="past"] .stat-icon {
  color: rgb(139, 92, 246) !important;
}

.stat-card--story[style*="present"] .stat-icon-wrapper {
  border-color: rgb(59, 130, 246);
}

.stat-card--story[style*="present"] .stat-icon {
  color: rgb(59, 130, 246) !important;
}

.stat-card--story[style*="future"] .stat-icon-wrapper {
  border-color: rgb(34, 211, 238);
}

.stat-card--story[style*="future"] .stat-icon {
  color: rgb(34, 211, 238) !important;
}

/* Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-card--story .stat-content {
  width: 100%;
}

.stat-title {
  font-size: 20px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 12px;
  letter-spacing: -0.025em;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;
  color: rgb(var(--v-theme-on-surface));
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.6;
}

.stat-card--story .stat-label {
  font-size: 16px;
  line-height: 1.6;
}

/* Responsive breakpoints */
/* Extra large screens */
@media (min-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .stats-grid--story {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large screens */
@media (min-width: 1024px) and (max-width: 1399px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .stats-grid--story {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Tablets */
@media (min-width: 768px) and (max-width: 1023px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .stats-grid--story {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-card--story {
    padding: 28px;
  }
}

/* Small tablets fix for 3 items (2+1 layout) */
@media (min-width: 768px) and (max-width: 900px) {
  .stats-grid--story {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

/* Mobile */
@media (max-width: 767px) {
  .stats-overview {
    margin: 24px 0;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stats-grid--story {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .stat-card {
    padding: 16px;
    gap: 12px;
  }

  .stat-card--story {
    padding: 24px;
    min-height: auto;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .stat-title {
    font-size: 18px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-label {
    font-size: 13px;
  }

  .stat-card--story .stat-label {
    font-size: 15px;
  }
}

/* Extra small mobile */
@media (max-width: 480px) {
  .stat-card {
    padding: 14px;
    gap: 10px;
  }

  .stat-card--story {
    padding: 20px;
  }

  .stat-icon-wrapper {
    width: 44px;
    height: 44px;
  }

  .stat-title {
    font-size: 17px;
  }

  .stat-value {
    font-size: 22px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-card--story .stat-label {
    font-size: 14px;
  }
}

/* Animation */
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
</style>
