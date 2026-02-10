<template>
  <div class="journey-timeline">
    <v-row>
      <v-col
        v-for="(item, index) in storyItems"
        :key="index"
        cols="12"
        md="4"
        class="timeline-item"
        :data-animate="index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'"
        :data-delay="index * 150"
      >
        <FeatureCard
          :icon="item.icon"
          :title="item.title"
          :description="item.description"
          :color="item.color"
          :variant="item.variant"
          :animation-delay="index * 0.2"
        />
      </v-col>
    </v-row>

    <!-- Connecting Line -->
    <div class="timeline-line d-none d-md-block" />
  </div>
</template>

<script setup lang="ts">
interface StoryItem {
  icon: string
  title: string
  description: string
  color: string
  variant: string
}

const storyItems: StoryItem[] = [
  {
    icon: 'mdi-history',
    title: 'Minha História',
    description:
      'Iniciei minha trajetória profissional desenvolvendo soft skills essenciais, mas minha paixão pela tecnologia impulsionou uma transição de carreira acelerada. Em curto prazo, evoluí de estagiário para Assistente de Infraestrutura Sênior, atuando em migrações críticas, redução de custos e administração de servidores Windows e Linux.',
    color: 'purple',
    variant: 'past',
  },
  {
    icon: 'mdi-cogs',
    title: 'Presente',
    description:
      'Atuo fortemente como SRE e DevOps em ambientes Cloud (AWS, Azure, Oracle) e On-premise. Além da atuação técnica com CI/CD, Docker e Terraform, exerço liderança comunitária como AWS Cloud Club Captain na Univali e organizador do DevOpsDays Floripa, fomentando a cultura tech na região.',
    color: 'primary',
    variant: 'present',
  },
  {
    icon: 'mdi-rocket-launch',
    title: 'Futuro',
    description:
      'Meu foco é a especialização contínua em arquiteturas Cloud Native e orquestração de containers com Kubernetes. Busco construir soluções cada vez mais escaláveis e resilientes, aplicando conceitos avançados de observabilidade e automação para entregar alta performance ao negócio.',
    color: 'cyan',
    variant: 'future',
  },
]
</script>

<style scoped>
.journey-timeline {
  position: relative;
  padding: 40px 0;
  margin-bottom: 64px;
}

.timeline-item {
  will-change: transform, opacity;
}

.timeline-item:nth-child(1) {
  transition-delay: 0ms;
}

.timeline-item:nth-child(2) {
  transition-delay: 150ms;
}

.timeline-item:nth-child(3) {
  transition-delay: 300ms;
}

.timeline-line {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 60%;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(168, 85, 247, 0.5),
    rgba(59, 130, 246, 0.5),
    rgba(6, 182, 212, 0.5)
  );
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-line::before,
.timeline-line::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgb(59, 130, 246);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}

.timeline-line::before {
  left: 0;
  transform: translateX(-50%);
}

.timeline-line::after {
  right: 0;
  transform: translateX(50%);
}

@media (max-width: 960px) {
  .timeline-line {
    display: none !important;
  }

  .journey-timeline {
    margin-bottom: 40px;
  }
}
</style>
