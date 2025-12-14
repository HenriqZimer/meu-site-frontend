<template>
  <v-container>
    <!-- Header com título e contador -->
    <v-row v-if="showHeader" class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-3">
          <div class="d-flex align-center ga-3">
            <v-icon :icon="icon" :color="color" size="large" />
            <h3 class="text-h5 font-weight-bold">
              {{ title }}
            </h3>
          </div>
          <v-chip :color="color" variant="elevated" size="small">
            {{ badges.length }} {{ badges.length === 1 ? 'certificação' : 'certificações' }}
          </v-chip>
        </div>
        <p v-if="description" class="text-body-1 text-medium-emphasis">
          {{ description }}
        </p>
      </v-col>
    </v-row>

    <!-- Grid de Badges -->
    <v-row align="stretch" justify="center">
      <v-col
        v-for="(badge, index) in badges"
        :key="badge.id || index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <CertificationBadge
          :name="badge.name"
          :issuer="badge.issuer"
          :image="badge.image"
          :link="badge.link"
          :date="badge.date"
          :skills="badge.skills"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
interface Badge {
  id?: string
  name: string
  issuer: string
  image: string
  link: string
  date?: string
  skills?: number
}

interface Props {
  badges: Badge[]
  title?: string
  description?: string
  icon?: string
  color?: string
  showHeader?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Certificações',
  description: '',
  icon: 'mdi-certificate',
  color: 'primary',
  showHeader: true
})
</script>

<style scoped>
/* Nenhum CSS customizado necessário - usando 100% Vuetify */
</style>
