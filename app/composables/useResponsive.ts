/**
 * Composable unificado para responsividade
 * Sistema centralizado de breakpoints e utilitários responsivos
 */

import { ref, computed, onMounted, onUnmounted, readonly } from "vue";

// Types
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ResponsiveValue<T = any> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  default?: T;
}

export interface ScreenSize {
  width: number;
  height: number;
}

// Breakpoints padronizados do design system
export const BREAKPOINTS: Breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1264,
  xl: 1904,
} as const;

export const useResponsive = () => {
  // Estado reativo
  const screenSize = ref<ScreenSize>({ width: 0, height: 0 });

  // Computed properties para breakpoints
  const currentBreakpoint = computed(() => {
    const width = screenSize.value.width;
    if (width >= BREAKPOINTS.xl) return "xl";
    if (width >= BREAKPOINTS.lg) return "lg";
    if (width >= BREAKPOINTS.md) return "md";
    if (width >= BREAKPOINTS.sm) return "sm";
    return "xs";
  });

  // Breakpoint checks
  const isXs = computed(() => screenSize.value.width < BREAKPOINTS.sm);
  const isSm = computed(
    () =>
      screenSize.value.width >= BREAKPOINTS.sm &&
      screenSize.value.width < BREAKPOINTS.md
  );
  const isMd = computed(
    () =>
      screenSize.value.width >= BREAKPOINTS.md &&
      screenSize.value.width < BREAKPOINTS.lg
  );
  const isLg = computed(
    () =>
      screenSize.value.width >= BREAKPOINTS.lg &&
      screenSize.value.width < BREAKPOINTS.xl
  );
  const isXl = computed(() => screenSize.value.width >= BREAKPOINTS.xl);

  // Aliases semânticos
  const isMobile = computed(() => isXs.value);
  const isTablet = computed(() => isSm.value || isMd.value);
  const isDesktop = computed(() => isLg.value || isXl.value);

  // Mobile-first breakpoint checks
  const smAndUp = computed(() => screenSize.value.width >= BREAKPOINTS.sm);
  const mdAndUp = computed(() => screenSize.value.width >= BREAKPOINTS.md);
  const lgAndUp = computed(() => screenSize.value.width >= BREAKPOINTS.lg);
  const xlAndUp = computed(() => screenSize.value.width >= BREAKPOINTS.xl);

  // Mobile-last breakpoint checks
  const smAndDown = computed(() => screenSize.value.width < BREAKPOINTS.md);
  const mdAndDown = computed(() => screenSize.value.width < BREAKPOINTS.lg);
  const lgAndDown = computed(() => screenSize.value.width < BREAKPOINTS.xl);

  // Orientation
  const isLandscape = computed(
    () => screenSize.value.width > screenSize.value.height
  );
  const isPortrait = computed(
    () => screenSize.value.width <= screenSize.value.height
  );

  // Device detection
  const isTouchDevice = computed(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  });

  // Update screen size
  const updateScreenSize = () => {
    if (typeof window !== "undefined") {
      screenSize.value = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
  };

  // Responsive value resolver
  const getResponsiveValue = <T>(values: ResponsiveValue<T>): T => {
    // Prioridade: breakpoint específico > aliases semânticos > default
    const bp = currentBreakpoint.value;

    if (values[bp] !== undefined) return values[bp]!;

    if (isMobile.value && values.mobile !== undefined) return values.mobile;
    if (isTablet.value && values.tablet !== undefined) return values.tablet;
    if (isDesktop.value && values.desktop !== undefined) return values.desktop;

    return values.default as T;
  };

  // Grid system
  const getGridCols = (breakpointCols: ResponsiveValue<number>) => {
    return getResponsiveValue(breakpointCols);
  };

  // Spacing system
  const getSpacing = (spacingValues: ResponsiveValue<string | number>) => {
    const value = getResponsiveValue(spacingValues);
    return typeof value === "number" ? `${value}px` : value;
  };

  // Typography system
  const getTextSize = (sizeValues: ResponsiveValue<string>) => {
    return getResponsiveValue(sizeValues);
  };

  // Classes CSS responsivas
  const getResponsiveClasses = (
    classMap: ResponsiveValue<string | string[]>
  ) => {
    const classes = getResponsiveValue(classMap);
    return Array.isArray(classes) ? classes.join(" ") : classes || "";
  };

  // Media query helper
  const mediaQuery = (
    breakpoint: keyof Breakpoints,
    direction: "up" | "down" = "up"
  ) => {
    const value = BREAKPOINTS[breakpoint];
    return direction === "up"
      ? `(min-width: ${value}px)`
      : `(max-width: ${value - 1}px)`;
  };

  // CSS custom properties
  const getCSSCustomProperty = (property: string, fallback?: string) => {
    if (typeof document === "undefined") return fallback;
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(property)
        .trim() || fallback
    );
  };

  // Layout helpers
  const layoutHelpers = computed(() => ({
    // Grid columns baseado no breakpoint
    gridCols: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
    }[currentBreakpoint.value],

    // Padding do container
    containerPadding: getResponsiveValue({
      mobile: "1rem",
      tablet: "1.5rem",
      desktop: "2rem",
    }),

    // Gap entre elementos
    gap: getResponsiveValue({
      mobile: "0.75rem",
      tablet: "1rem",
      desktop: "1.5rem",
    }),

    // Altura do header
    headerHeight: getResponsiveValue({
      mobile: "64px",
      tablet: "72px",
      desktop: "80px",
    }),
  }));

  // Performance optimization
  let resizeTimer: ReturnType<typeof setTimeout>;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateScreenSize, 100); // Debounce
  };

  // Lifecycle
  onMounted(() => {
    updateScreenSize();
    window.addEventListener("resize", handleResize, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimer);
  });

  return {
    // Estado
    screenSize: readonly(screenSize),
    currentBreakpoint,

    // Breakpoint checks
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,

    // Aliases semânticos
    isMobile,
    isTablet,
    isDesktop,

    // Mobile-first
    smAndUp,
    mdAndUp,
    lgAndUp,
    xlAndUp,

    // Mobile-last
    smAndDown,
    mdAndDown,
    lgAndDown,

    // Orientation & device
    isLandscape,
    isPortrait,
    isTouchDevice,

    // Utilities
    getResponsiveValue,
    getGridCols,
    getSpacing,
    getTextSize,
    getResponsiveClasses,
    mediaQuery,
    getCSSCustomProperty,
    layoutHelpers,

    // Constants
    BREAKPOINTS,
  };
};
