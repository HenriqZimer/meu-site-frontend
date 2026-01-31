<template>
  <div class="admin-header">
    <div class="header-content">
      <div class="header-left">
        <div class="header-icon-wrapper">
          <v-icon icon="mdi-view-dashboard" size="28" />
        </div>
        <div class="header-text">
          <h1 class="header-title">Painel Administrativo</h1>
          <p class="header-subtitle">
            <v-icon size="14" class="mr-1">mdi-shield-check</v-icon>
            Gerenciamento de Conteúdo
          </p>
        </div>
      </div>
      <div class="header-actions">
        <div class="user-info">
          <v-icon size="20" class="mr-2">mdi-account-circle</v-icon>
          <span class="user-name">Admin</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Header sem emit de logout (agora está na sidebar)
</script>

<style scoped>
.admin-header {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  max-width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.header-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15));
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 0.8125rem;
  margin: 0;
  color: #94a3b8;
  font-weight: 500;
  display: flex;
  align-items: center;
  letter-spacing: 0.3px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #e2e8f0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e2e8f0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }

  .header-left {
    width: 100%;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
