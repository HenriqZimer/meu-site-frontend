<template>
  <v-footer class="footer-wrapper" color="rgba(15, 23, 42, 0.98)">
    <v-container class="py-8 py-md-12">
      <v-row>
        <!-- Brand Section -->
        <v-col cols="12" md="4" lg="4">
          <div class="footer-brand">
            <div class="d-flex align-center ga-3 mb-4">
              <v-avatar size="56" rounded="lg" class="brand-avatar">
                <v-img :src="IMAGE_URLS.LOGO" alt="Logo" />
              </v-avatar>
              <div>
                <div class="brand-name">Henrique Zimermann</div>
                <div class="brand-subtitle">DevOps & Cloud</div>
              </div>
            </div>
            <p class="footer-description">
              Automatizando infraestruturas e otimizando processos de desenvolvimento com soluções modernas e
              escaláveis.
            </p>
            <div class="social-links-wrapper mt-4">
              <v-btn v-for="social in socialLinks" :key="social.name" :href="social.href" :icon="social.icon"
                size="small" variant="tonal" color="primary" target="_blank" class="social-btn" width="48"
                :aria-label="social.label" />
            </div>
          </div>
        </v-col>

        <!-- Quick Links -->
        <v-col cols="6" sm="4" md="2" lg="2">
          <div class="footer-section">
            <h3 class="footer-title">Navegação</h3>
            <ul class="footer-links">
              <li v-for="link in quickLinks" :key="link.label">
                <a :href="link.href" class="footer-link" @click.prevent="scrollToSection(link.href)">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </v-col>

        <!-- Contact Info -->
        <v-col cols="6" sm="4" md="3" lg="3">
          <div class="footer-section">
            <h3 class="footer-title">Contato</h3>
            <ul class="footer-links">
              <li>
                <a :href="`https://wa.me/${phoneNumber.replace(/\D/g, '')}`" target="_blank" class="footer-link">
                  <v-icon size="16" class="mr-2">mdi-phone</v-icon>
                  {{ phoneNumber }}
                </a>
              </li>
              <li>
                <span class="footer-link">
                  <v-icon size="16" class="mr-2">mdi-map-marker</v-icon>
                  Santa Catarina, Brasil
                </span>
              </li>
              <li>
                <a :href="`mailto:${email}`" class="footer-link">
                  <v-icon size="16" class="mr-2">mdi-email</v-icon>
                  {{ email }}
                </a>
              </li>
            </ul>
          </div>
        </v-col>

        <!-- Newsletter/CTA -->
        <v-col cols="12" sm="4" md="3" lg="3">
          <div class="footer-section">
            <h3 class="footer-title">Vamos conversar?</h3>
            <p class="footer-cta-text mb-4">
              Tem um projeto em mente? Entre em contato!
            </p>
            <v-btn color="primary" variant="flat" block size="large" class="cta-btn"
              @click="scrollToSection('contact')">
              <v-icon start>mdi-email-fast</v-icon>
              Enviar Mensagem
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Divider -->
      <v-divider class="my-8 footer-divider" />

      <!-- Bottom Bar -->
      <v-row>
        <v-col cols="12" md="6" class="text-center text-md-left">
          <p class="footer-copyright">
            © {{ currentYear }} Henrique Zimermann. Todos os direitos reservados.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-right">
          <span class="footer-tech">
            Desenvolvido com
            <v-icon size="14" color="error" class="mx-1">mdi-heart</v-icon>
            usando <strong>Nuxt 3</strong> & <strong>Vuetify</strong>
          </span>
        </v-col>
      </v-row>
    </v-container>

    <!-- Scroll to Top Button -->
    <v-btn v-show="showScrollTop" icon="mdi-arrow-up" color="primary" size="large" position="fixed" location="bottom end"
      class="scroll-top-btn" @click="scrollToTop" />
  </v-footer>
</template>

<script setup lang="ts">
import { QUICK_LINKS, IMAGE_URLS } from "~/constants";
import { useNavigation } from "~/composables/useNavigation";
import { useSocialLinks } from "~/composables/useSocialLinks";

const currentYear = computed(() => new Date().getFullYear());
const showScrollTop = ref(false);

const { scrollToSection, scrollToTop, shouldShowScrollTop } = useNavigation();
const { footerSocialLinks, contactInfo } = useSocialLinks();

const socialLinks = footerSocialLinks;
const quickLinks = QUICK_LINKS;
const email = contactInfo.email;
const phoneNumber = contactInfo.phone;

const handleScroll = () => {
  if (import.meta.client) {
    showScrollTop.value = shouldShowScrollTop();
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>

<style scoped>
.footer-wrapper {
  backdrop-filter: blur(16px) saturate(180%);
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  position: relative;
  overflow: hidden;
}

.footer-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Brand Section */
.footer-brand {
  max-width: 380px;
}

.brand-avatar {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border: 2px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.brand-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 0%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.25px;
}

.footer-description {
  color: #cbd5e1;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
}

/* Social Links */
.social-links-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.social-btn {
  transition: all 0.3s ease !important;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3) !important;
}

/* Footer Sections */
.footer-section {
  margin-bottom: 1.5rem;
}

.footer-title {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.25rem;
  letter-spacing: 0.25px;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.footer-link:hover {
  color: #3b82f6;
  transform: translateX(4px);
}

/* CTA Section */
.footer-cta-text {
  color: #cbd5e1;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin: 0;
}

.cta-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  border-radius: 10px !important;
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
  transition: all 0.3s ease !important;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4) !important;
}

/* Divider */
.footer-divider {
  border-color: rgba(59, 130, 246, 0.2) !important;
  opacity: 0.6;
}

/* Bottom Bar */
.footer-copyright,
.footer-tech {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

.footer-tech strong {
  color: #60a5fa;
  font-weight: 600;
}

/* Scroll to Top Button */
.scroll-top-btn {
  margin: 1.5rem !important;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4) !important;
  transition: all 0.3s ease !important;
}

.scroll-top-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5) !important;
}

/* Responsive */
@media (max-width: 960px) {
  .footer-brand {
    max-width: 100%;
    margin-bottom: 2rem;
  }
  
  .footer-section {
    margin-bottom: 2rem;
  }
}

@media (max-width: 600px) {
  .brand-avatar {
    width: 48px;
    height: 48px;
  }
  
  .brand-name {
    font-size: 1rem;
  }
  
  .footer-title {
    font-size: 0.8125rem;
  }
  
  .footer-link,
  .footer-description,
  .footer-cta-text {
    font-size: 0.875rem;
  }
  
  .scroll-top-btn {
    margin: 1rem !important;
  }
}
</style>
