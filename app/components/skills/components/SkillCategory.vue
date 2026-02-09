<template>
  <v-card
    :class="cardClasses"
    :elevation="elevation"
    :rounded="rounded"
    :style="cardStyles"
    data-animate="fade-up"
    :data-delay="animationDelay"
  >
    <!-- Header da categoria -->
    <div :class="headerClasses">
      <IconWrapper
        v-if="icon"
        :icon="icon"
        :size="iconSize"
        :color="iconColor"
        :class="iconClasses"
      />
      <h3 :class="titleClasses">{{ title }}</h3>
    </div>

    <!-- Lista de skills -->
    <v-list v-if="skills.length > 0" density="compact" class="bg-transparent skill-list">
      <v-list-item
        v-for="(skill, index) in skills"
        :key="skill.name"
        class="px-0 skill-item"
        :style="`animation-delay: ${animationDelay + 200 + index * 100}ms;`"
        data-animate="fade-left"
      >
        <div class="skill-content">
          <div class="d-flex justify-space-between align-center mb-2">
            <span :class="skillNameClasses">{{ skill.name }}</span>
            <span :class="skillLevelClasses">{{ skill.level }}%</span>
          </div>
          <v-progress-linear
            :model-value="skill.level"
            :color="progressColor"
            :height="progressHeight"
            rounded
            class="skill-progress"
            :style="`animation-delay: ${animationDelay + 400 + index * 100}ms;`"
            data-animate="scale-width"
          />
        </div>
      </v-list-item>
    </v-list>

    <!-- Slot para conteúdo customizado -->
    <div v-if="$slots.default" :class="contentClasses">
      <slot />
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface Skill {
  name: string
  level: number
  icon?: string
}

interface Props {
  title: string
  icon?: string
  skills?: Skill[]
  elevation?: number | string
  rounded?: boolean | string
  animationDelay?: number
  size?: 'small' | 'medium' | 'large'
  progressColor?: string
  minHeight?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  skills: () => [],
  elevation: 2,
  rounded: 'lg',
  animationDelay: 0,
  size: 'medium',
  progressColor: 'primary',
  minHeight: 'auto',
})

const { getResponsiveClasses, isMobile } = useResponsive()

// Classes do card
const cardClasses = computed(() => {
  const classes = ['skill-category-card', 'h-100']

  classes.push(`skill-category--${props.size}`)

  return classes.join(' ')
})

// Estilos do card
const cardStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (props.minHeight && props.minHeight !== 'auto') {
    styles.minHeight =
      typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
  }

  return styles
})

// Classes do header
const headerClasses = computed(() => {
  const paddingMap = {
    small: 'pa-4 pb-2',
    medium: 'pa-6 pb-3',
    large: 'pa-8 pb-4',
  }

  return `d-flex align-center mb-3 ${paddingMap[props.size]}`
})

// Configurações do ícone
const iconSize = computed(() => {
  const sizeMap = {
    small: isMobile.value ? 24 : 28,
    medium: isMobile.value ? 28 : 32,
    large: isMobile.value ? 32 : 36,
  }
  return sizeMap[props.size]
})

const iconColor = computed(() => 'primary')

const iconClasses = computed(() => 'mr-3 skill-icon')

// Classes do título
const titleClasses = computed(() => {
  const sizeMap = {
    small: getResponsiveClasses({
      xs: 'text-body-1 font-weight-bold',
      md: 'text-h6 font-weight-bold',
      default: 'text-body-1 font-weight-bold',
    }),
    medium: getResponsiveClasses({
      xs: 'text-h6 font-weight-bold',
      md: 'text-h6 font-weight-bold',
      default: 'text-h6 font-weight-bold',
    }),
    large: getResponsiveClasses({
      xs: 'text-h6 font-weight-bold',
      md: 'text-h5 font-weight-bold',
      default: 'text-h6 font-weight-bold',
    }),
  }

  return sizeMap[props.size]
})

// Classes dos skills
const skillNameClasses = computed(() => {
  return getResponsiveClasses({
    xs: 'text-body-2 font-weight-medium',
    md: 'text-body-1 font-weight-medium',
    default: 'text-body-2 font-weight-medium',
  })
})

const skillLevelClasses = computed(() => {
  return getResponsiveClasses({
    xs: 'text-body-2 text-medium-emphasis',
    md: 'text-body-1 text-medium-emphasis',
    default: 'text-body-2 text-medium-emphasis',
  })
})

// Configurações da progress bar
const progressHeight = computed(() => {
  const heightMap = {
    small: 4,
    medium: 6,
    large: 8,
  }
  return heightMap[props.size]
})

// Classes do conteúdo customizado
const contentClasses = computed(() => {
  const paddingMap = {
    small: 'pa-4 pt-0',
    medium: 'pa-6 pt-0',
    large: 'pa-8 pt-0',
  }

  return paddingMap[props.size]
})
</script>

<style scoped>
.skill-category-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.skill-category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}

.skill-category--small .skill-list {
  padding-left: 1rem;
  padding-right: 1rem;
}

.skill-category--medium .skill-list {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.skill-category--large .skill-list {
  padding-left: 2rem;
  padding-right: 2rem;
}

.skill-icon {
  transition: all 0.3s ease;
}

.skill-category-card:hover .skill-icon {
  transform: scale(1.1);
  color: rgb(var(--v-theme-primary)) !important;
}

.skill-item {
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateX(-20px);
  animation: fadeInLeft 0.6s ease-out forwards;
}

.skill-content {
  width: 100%;
}

.skill-progress {
  transition: all 0.3s ease;
}

.skill-category-card:hover .skill-progress {
  transform: scaleY(1.2);
}

@keyframes fadeInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsividade */
@media (max-width: 600px) {
  .skill-category-card:hover {
    transform: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
  }

  .skill-category--small .skill-list,
  .skill-category--medium .skill-list,
  .skill-category--large .skill-list {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
