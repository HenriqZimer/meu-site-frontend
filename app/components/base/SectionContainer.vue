<template>
  <section :id="id" :class="sectionClasses" :style="sectionStyles">
    <v-container :class="containerClasses" :style="containerStyles">
      <!-- Header da seção -->
      <v-row v-if="showHeader" justify="center" :class="headerRowClasses">
        <v-col cols="12" :class="headerColClasses">
          <div data-animate="fade-up" :data-delay="0">
            <h2 :class="titleClasses">
              {{ title }}
            </h2>
            <p v-if="subtitle" :class="subtitleClasses" data-animate="fade-up" :data-delay="100">
              {{ subtitle }}
            </p>
            <v-divider
              v-if="showDivider"
              :class="dividerClasses"
              :style="dividerStyles"
              data-animate="scale-width"
              :data-delay="200"
            />
          </div>
        </v-col>
      </v-row>

      <!-- Conteúdo principal -->
      <div :class="contentClasses">
        <slot />
      </div>

      <!-- Footer da seção (opcional) -->
      <div v-if="$slots.footer" :class="footerClasses">
        <slot name="footer" />
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  title?: string
  subtitle?: string
  showHeader?: boolean
  showDivider?: boolean
  background?: 'transparent' | 'surface' | 'background' | 'primary' | 'secondary'
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
  textAlign?: 'left' | 'center' | 'right'
  maxWidth?: string | number
  minHeight?: string | number
  fullHeight?: boolean
  containerFluid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  title: '',
  subtitle: '',
  showHeader: true,
  showDivider: true,
  background: 'transparent',
  padding: 'large',
  textAlign: 'center',
  maxWidth: '',
  minHeight: '',
  fullHeight: false,
  containerFluid: false,
})

const { getResponsiveClasses, isMobile } = useResponsive()

// Classes da seção
const sectionClasses = computed(() => {
  const classes = ['section-container']

  // Background
  if (props.background !== 'transparent') {
    classes.push(`bg-${props.background}`)
  }

  // Altura total
  if (props.fullHeight) {
    classes.push('fill-height')
  }

  return classes.join(' ')
})

// Estilos da seção
const sectionStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (props.minHeight) {
    styles.minHeight =
      typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
  }

  return styles
})

// Classes do container
const containerClasses = computed(() => {
  const classes = []

  // Padding responsivo
  const paddingMap = {
    none: '',
    small: getResponsiveClasses({
      xs: 'py-8',
      sm: 'py-10',
      md: 'py-12',
      default: 'py-8',
    }),
    medium: getResponsiveClasses({
      xs: 'py-12',
      sm: 'py-14',
      md: 'py-16',
      default: 'py-12',
    }),
    large: getResponsiveClasses({
      xs: 'py-16',
      sm: 'py-18',
      md: 'py-20',
      default: 'py-16',
    }),
    xlarge: getResponsiveClasses({
      xs: 'py-20',
      sm: 'py-24',
      md: 'py-28',
      default: 'py-20',
    }),
  }

  classes.push(paddingMap[props.padding])

  // Container fluido
  if (props.containerFluid) {
    classes.push('fluid')
  }

  return classes.filter(Boolean).join(' ')
})

// Estilos do container
const containerStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (props.maxWidth) {
    styles.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
  }

  return styles
})

// Classes do header
const headerRowClasses = computed(() => {
  const classes = ['mb-12']

  if (isMobile.value) {
    classes.push('mb-8')
  }

  return classes.join(' ')
})

const headerColClasses = computed(() => {
  return `text-${props.textAlign}`
})

// Classes do título
const titleClasses = computed(() => {
  return getResponsiveClasses({
    xs: 'text-h4 font-weight-bold mb-4',
    sm: 'text-h3 font-weight-bold mb-4',
    md: 'text-h2 font-weight-bold mb-6',
    default: 'text-h4 font-weight-bold mb-4',
  })
})

// Classes do subtítulo
const subtitleClasses = computed(() => {
  return getResponsiveClasses({
    xs: 'text-body-1 text-medium-emphasis mb-6',
    sm: 'text-h6 text-medium-emphasis mb-6',
    md: 'text-h5 text-medium-emphasis mb-8',
    default: 'text-body-1 text-medium-emphasis mb-6',
  })
})

// Classes e estilos do divider
const dividerClasses = computed(() => {
  const classes = ['mx-auto', 'mt-6']

  if (props.textAlign === 'left') {
    classes.splice(classes.indexOf('mx-auto'), 1)
    classes.push('me-auto')
  } else if (props.textAlign === 'right') {
    classes.splice(classes.indexOf('mx-auto'), 1)
    classes.push('ms-auto')
  }

  return classes.join(' ')
})

const dividerStyles = computed(() => ({
  maxWidth: '200px',
}))

// Classes do conteúdo
const contentClasses = computed(() => {
  return 'section-content'
})

// Classes do footer
const footerClasses = computed(() => {
  const classes = ['mt-8']

  if (isMobile.value) {
    classes.push('mt-6')
  }

  return classes.join(' ')
})
</script>

<style scoped>
.section-container {
  position: relative;
  overflow: hidden;
}

.section-content {
  position: relative;
  z-index: 1;
}

/* Responsividade para espaçamentos */
@media (max-width: 600px) {
  .section-container {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
