<template>
  <v-app>
    <v-theme-provider>
      <!-- Main content -->
      <v-main>
        <NuxtRouteAnnouncer />
        <NuxtPage />
      </v-main>
    </v-theme-provider>
  </v-app>
</template>

<script setup lang="ts">
const route = useRoute()

// Verificar se está na rota admin
const _isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Configuração de SEO global
useHead({
  htmlAttrs: { lang: 'pt-BR' },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
})
</script>

<style>
/* Global reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-primary);
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--background-primary);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Global transitions */

/* Focus styles for accessibility */
:focus {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Remove focus outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
</style>
