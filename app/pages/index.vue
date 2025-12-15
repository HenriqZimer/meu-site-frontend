<template>
  <div class="page-wrapper">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <Hero />

      <!-- About Section -->
      <About />

      <!-- Portfolio Section -->
      <Portfolio />

      <!-- Skills Section -->
      <Skills />

      <!-- Certifications Section -->
      <Certifications />

      <!-- Courses Section -->
      <Courses />

      <!-- Contact Section -->
      <Contact />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
// Variáveis de ambiente para SEO
const config = useRuntimeConfig()
const siteName = config.public.siteName
const _siteDescription = config.public.siteDescription
const siteUrl = config.public.siteUrl

// Configuração de SEO e meta tags
useHead({
  title: `${siteName} - DevOps & Cloud`,
  meta: [
    {
      name: 'description',
      content: `Portfólio de ${siteName}, DevOps & Cloud especializado em resolver problemas de infraestrutura com soluções automatizadas usando CI/CD, Kubernetes e tecnologias cloud.`,
    },
    {
      name: 'keywords',
      content:
        'devops engineer, cloud specialist, kubernetes, docker, aws, ci/cd, infraestrutura, automação, containers, cloud computing, terraform, monitoramento',
    },
    { property: 'og:title', content: `${siteName} - DevOps & Cloud` },
    {
      property: 'og:description',
      content: `DevOps & Cloud focado em resolver problemas de infraestrutura com soluções automatizadas. Especialista em CI/CD, Kubernetes e tecnologias cloud para ambientes produtivos.`,
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${siteName} - DevOps & Cloud` },
    {
      name: 'twitter:description',
      content: `DevOps & Cloud especializado em infraestrutura automatizada, CI/CD pipelines, Kubernetes e soluções cloud escaláveis.`,
    },
    // Metadados técnicos adicionais
    { name: 'author', content: 'Henrique Zimermann' },
    {
      name: 'robots',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
    { name: 'googlebot', content: 'index, follow' },
    { name: 'theme-color', content: '#3b82f6' },
    { name: 'msapplication-TileColor', content: '#3b82f6' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: siteUrl },
    // Open Graph images
    { rel: 'image_src', href: `${siteUrl}/og-image.jpg` },
    // Schema.org structured data
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'DevOps & Cloud Engineering Insights',
      href: `${siteUrl}/rss.xml`,
    },
  ],
  script: [
    // Schema.org structured data
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Henrique Zimermann',
        jobTitle: 'DevOps & Cloud',
        description:
          'DevOps & Cloud, especializado em resolver problemas de infraestrutura com soluções automatizadas usando CI/CD, Kubernetes e tecnologias cloud',
        url: siteUrl,
        sameAs: ['https://github.com/henriqzimer', 'https://linkedin.com/in/henrique-zimermann'],
        knowsAbout: [
          'DevOps',
          'Cloud Computing',
          'Kubernetes',
          'Docker',
          'AWS',
          'CI/CD',
          'Infrastructure Automation',
          'Container Orchestration',
          'Monitoring',
          'Infrastructure as Code',
        ],
        hasOccupation: {
          '@type': 'Occupation',
          name: 'DevOps & Cloud',
          occupationLocation: {
            '@type': 'City',
            name: 'Balneário Piçarras',
            addressRegion: 'SC',
            addressCountry: 'BR',
          },
        },
      }),
    },
  ],
})
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}

.main-content {
  flex: 1;
  width: 100%;
}

/* Smooth scroll behavior */
:global(html) {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

@media (max-width: 1024px) {
  .section-spacer {
    margin-top: 100px;
  }

  :global(html) {
    scroll-padding-top: 64px;
  }
}

@media (max-width: 768px) {
  .section-spacer {
    margin-top: 80px;
  }
}

@media (max-width: 480px) {
  .section-spacer {
    margin-top: 60px;
  }
}
</style>
