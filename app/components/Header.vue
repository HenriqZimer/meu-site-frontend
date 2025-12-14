<template>
  <v-app-bar 
    :elevation="scrolled ? 8 : 0" 
    :color="scrolled ? 'rgba(15, 23, 42, 0.98)' : 'transparent'" 
    app
    :height="mdAndUp ? 80 : 64"
    class="header-bar"
  >
    <v-container fluid class="d-flex align-center px-4 px-md-8">
      <!-- Logo/Brand -->
      <div class="brand-wrapper" @click="scrollToSection('home')">
        <div class="logo-container">
          <v-avatar size="48" rounded="lg" class="logo-avatar">
            <v-img :src="IMAGE_URLS.LOGO" alt="Logo" />
          </v-avatar>
        </div>
        <div class="brand-text">
          <span class="brand-name">Henrique Zimermann</span>
          <span class="brand-title">DevOps & Cloud</span>
        </div>
      </div>

      <v-spacer />

      <!-- Desktop Menu -->
      <nav v-show="mdAndUp" class="nav-menu">
        <v-btn 
          v-for="item in menuItems" 
          :key="item.id" 
          variant="text"
          :class="['nav-item', { 'nav-item-active': activeSection === item.id }]"
          @click="scrollToSection(item.id)"
        >
          <v-icon v-if="item.icon" start size="20">{{ item.icon }}</v-icon>
          {{ item.label }}
        </v-btn>
      </nav>

      <!-- CTA Button -->
      <v-btn 
        v-show="mdAndUp" 
        color="primary" 
        variant="flat" 
        class="cta-button ml-4"
        size="large"
        @click="scrollToSection('contact')"
      >
        <v-icon start size="20">mdi-email-fast-outline</v-icon>
        Fale Comigo
        <v-icon end size="18" class="arrow-icon">mdi-arrow-right</v-icon>
      </v-btn>

      <!-- Mobile Menu Button -->
      <v-btn 
        v-show="!mdAndUp" 
        icon
        variant="text"
        class="mobile-menu-btn"
        @click="drawer = !drawer"
      >
        <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer 
    v-model="drawer" 
    temporary 
    location="right" 
    width="280"
    class="mobile-drawer"
  >
    <div class="drawer-header">
      <div class="d-flex align-center ga-3 pa-4">
        <v-avatar size="56" rounded="lg" class="logo-avatar">
          <v-img :src="IMAGE_URLS.LOGO" alt="Logo" />
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold">Henrique</div>
          <div class="text-caption text-blue-grey-lighten-2">DevOps & Cloud</div>
        </div>
      </div>
    </div>

    <v-divider />

    <v-list nav class="drawer-list">
      <v-list-item 
        v-for="item in menuItems" 
        :key="item.id" 
        :prepend-icon="item.icon" 
        :title="item.label"
        :active="activeSection === item.id"
        class="drawer-item"
        @click="handleDrawerItemClick(item.id)"
      />
    </v-list>

    <div class="drawer-footer pa-4">
      <v-btn 
        color="primary" 
        variant="flat" 
        block
        size="x-large"
        class="mobile-cta-button"
        @click="handleDrawerItemClick('contact')"
      >
        <v-icon start size="22">mdi-email-fast-outline</v-icon>
        Fale Comigo
        <v-icon end size="20" class="mobile-arrow-icon">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { MENU_ITEMS, SCROLL_CONFIG, IMAGE_URLS } from "~/constants";
import { useNavigation } from "~/composables/useNavigation";
import { useDisplay } from 'vuetify';

const { scrollToSection, getActiveSection } = useNavigation();
const { mdAndUp } = useDisplay();

const scrolled = ref(false);
const drawer = ref(false);
const activeSection = ref("home");
const menuItems = MENU_ITEMS;

const handleDrawerItemClick = (id: string) => {
  scrollToSection(id);
  drawer.value = false;
};

const handleScroll = () => {
  scrolled.value = window.scrollY > SCROLL_CONFIG.SCROLL_THRESHOLD;
  const sections = ["home", ...menuItems.map((item) => item.id)];
  activeSection.value = getActiveSection(sections);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.header-bar {
  backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-bar :deep(.v-toolbar__content) {
  padding: 0;
}

/* Brand */
.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.brand-wrapper:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.logo-container {
  position: relative;
}

.logo-avatar {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border: 2px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  transition: all 0.3s ease;
}

.logo-avatar:hover {
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
  transform: scale(1.05);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.brand-name {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 0%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-title {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-item {
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: 0.25px;
  color: #e2e8f0 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  position: relative;
  padding: 0.5rem 1rem !important;
}

.nav-item::before {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: transform 0.3s ease;
}

.nav-item:hover {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #60a5fa !important;
}

.nav-item:hover::before {
  transform: translateX(-50%) scaleX(1);
}

.nav-item-active {
  background: rgba(59, 130, 246, 0.15) !important;
  color: #3b82f6 !important;
}

.nav-item-active::before {
  transform: translateX(-50%) scaleX(1);
}

/* CTA Button */
.cta-button {
  text-transform: none !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  padding: 0 1.75rem !important;
  letter-spacing: 0.25px !important;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%) !important;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 28px rgba(59, 130, 246, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15) inset !important;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%) !important;
}

.cta-button:active {
  transform: translateY(0) scale(0.98);
}

.cta-button .arrow-icon {
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow-icon {
  transform: translateX(4px);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  color: #e2e8f0 !important;
}

/* Mobile Drawer */
.mobile-drawer {
  background: rgba(15, 23, 42, 0.98) !important;
  backdrop-filter: blur(16px);
}

.drawer-header {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.05));
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.drawer-list {
  padding: 0.5rem !important;
}

.drawer-item {
  border-radius: 8px !important;
  margin-bottom: 0.25rem !important;
  transition: all 0.3s ease !important;
}

.drawer-item:hover {
  background: rgba(59, 130, 246, 0.1) !important;
}

.drawer-item.v-list-item--active {
  background: rgba(59, 130, 246, 0.2) !important;
  color: #3b82f6 !important;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(8px);
}

/* Mobile CTA Button */
.mobile-cta-button {
  text-transform: none !important;
  font-weight: 700 !important;
  border-radius: 14px !important;
  letter-spacing: 0.5px !important;
  font-size: 1.0625rem !important;
  padding: 1.25rem 1.5rem !important;
  height: 56px !important;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%) !important;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}

.mobile-cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transition: left 0.6s ease;
}

.mobile-cta-button:active::before {
  left: 100%;
}

.mobile-cta-button:active {
  transform: scale(0.97);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15) inset !important;
}

.mobile-arrow-icon {
  transition: transform 0.3s ease;
}

.mobile-cta-button:active .mobile-arrow-icon {
  transform: translateX(6px);
}

/* Responsive */
@media (max-width: 960px) {
  .brand-name {
    font-size: 0.875rem;
  }
}

@media (max-width: 600px) {
  .logo-avatar {
    width: 40px;
    height: 40px;
  }
}
</style>
