<template>
  <div class="admin-stats-grid">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Componente wrapper para organizar os cards de estatísticas
</script>

<style scoped>
.admin-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .admin-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .admin-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
