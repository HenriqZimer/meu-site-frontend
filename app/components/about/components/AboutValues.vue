<template>
  <div class="values-section">
    <div class="text-center mb-8 mb-md-12">
      <h3 class="text-h4 text-md-h3 values-title">
        O que me <span class="text-gradient-error">move</span>
      </h3>
      <p class="values-description text-body-1 mt-4">
        Princípios que guiam minha jornada profissional
      </p>
    </div>

    <v-row>
      <v-col
        v-for="(value, index) in valuesData"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        data-animate="fade-up"
        :data-delay="index * 120"
      >
        <FeatureCard
          :icon="value.icon"
          :title="value.title"
          :description="value.description"
          color="error"
          variant="value"
          :gradient="value.gradient"
          :icon-size="40"
          :animation-delay="index * 0.1"
          custom-class="value-card"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
interface Value {
  title: string
  description: string
  icon: string
  gradient: string
}

const valuesData: Value[] = [
  {
    title: 'Estudo Contínuo',
    description: 'Sempre em busca de novos conhecimentos e tecnologias para me manter atualizado',
    icon: 'mdi-school',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  },
  {
    title: 'Qualidade',
    description: 'Compromisso com a excelência em cada linha de código e processo implementado',
    icon: 'mdi-shield-check',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
  {
    title: 'Inovação',
    description: 'Busco soluções criativas e modernas para resolver problemas complexos',
    icon: 'mdi-rocket-launch',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
  },
  {
    title: 'Colaboração',
    description: 'Trabalho em equipe e comunicação efetiva são fundamentais para o sucesso',
    icon: 'mdi-account-group',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #3730a3 100%)',
  },
  {
    title: 'Performance',
    description: 'Otimização e eficiência são prioridades em todas as soluções que desenvolvo',
    icon: 'mdi-lightning-bolt',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #4338ca 100%)',
  },
  {
    title: 'Comprometimento',
    description: 'Dedicação total para entregar resultados que superem as expectativas',
    icon: 'mdi-target',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #312e81 100%)',
  },
]
</script>

<style scoped>
.values-section {
  margin-top: 64px;
}

.values-title {
  color: rgb(241, 245, 249);
  font-weight: 900;
}

.values-description {
  color: rgb(148, 163, 184);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.value-card {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
  position: relative;
}

.value-card:hover {
  border-color: rgba(239, 68, 68, 0.4);
  box-shadow: 0 24px 64px rgba(239, 68, 68, 0.3) !important;
  transform: translateY(-10px) scale(1.03);
}

.value-card:hover :deep(.feature-icon) {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 8px currentColor);
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 16px currentColor);
  }
}

@media (max-width: 960px) {
  .values-section {
    margin-top: 48px;
  }
}
</style>
