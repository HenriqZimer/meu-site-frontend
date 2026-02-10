<template>
  <div>
    <v-btn
      variant="outlined"
      prepend-icon="mdi-palette"
      size="small"
      class="mb-2"
      @click="dialog = true"
    >
      Visualizar Ícones Disponíveis
    </v-btn>

    <v-dialog v-model="dialog" max-width="900px" persistent scrollable>
      <v-card class="admin-dialog-card">
        <v-card-title class="admin-dialog-title">
          <v-icon size="24" class="mr-2">mdi-palette</v-icon>
          <span>Galeria de Ícones</span>
        </v-card-title>

        <v-divider />

        <v-card-text class="admin-dialog-content">
          <v-text-field
            v-model="search"
            label="Pesquisar"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="mb-4"
            clearable
          />

          <v-tabs v-model="tab" class="mb-4">
            <v-tab value="devicon">Devicon</v-tab>
            <v-tab value="logos">Logos</v-tab>
            <v-tab value="skill-icons">Skill Icons</v-tab>
            <v-tab value="mdi">Material Design</v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <v-window-item value="devicon">
              <IconGrid :icons="filteredDevicons" prefix="devicon:" @select="onSelectIcon" />
            </v-window-item>

            <v-window-item value="logos">
              <IconGrid :icons="filteredLogos" prefix="logos:" @select="onSelectIcon" />
            </v-window-item>

            <v-window-item value="skill-icons">
              <IconGrid :icons="filteredSkillIcons" prefix="skill-icons:" @select="onSelectIcon" />
            </v-window-item>

            <v-window-item value="mdi">
              <IconGrid :icons="filteredMdiIcons" prefix="mdi-" @select="onSelectIcon" />
            </v-window-item>
          </v-window>
        </v-card-text>

        <v-divider />

        <v-card-actions class="admin-dialog-actions">
          <v-spacer />
          <v-btn variant="tonal" size="large" color="error" class="px-8" @click="dialog = false">
            Fechar
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const dialog = ref(false)
const search = ref('')
const tab = ref('devicon')

interface Props {
  modelValue?: string
}

defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Lista expandida de ícones devicon (tecnologias populares - 150 ícones disponíveis na coleção)
const deviconIcons = [
  // Linguagens de Programação
  'javascript',
  'typescript',
  'python',
  'java',
  'c',
  'cplusplus',
  'csharp',
  'go',
  'rust',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'dart',
  'scala',
  'r',
  'perl',
  'lua',
  'elixir',
  'haskell',
  'clojure',
  'erlang',

  // Frontend Frameworks
  'vuejs',
  'react',
  'angular',
  'svelte',
  'nextjs',
  'nuxtjs',
  'gatsby',
  'ember',
  'backbone',
  'jquery',
  'alpinejs',
  'astro',
  'qwik',

  // Backend & Frameworks
  'nodejs',
  'express',
  'nestjs',
  'fastapi',
  'django',
  'flask',
  'spring',
  'laravel',
  'rails',
  'phoenix',
  'grails',
  'quarkus',

  // Bancos de Dados
  'mongodb',
  'postgresql',
  'mysql',
  'redis',
  'sqlite',
  'mariadb',
  'cassandra',
  'couchdb',
  'dynamodb',
  'neo4j',
  'oracle',
  'sqlserver',
  'elasticsearch',
  'clickhouse',
  'cockroachdb',

  // DevOps & Cloud
  'docker',
  'kubernetes',
  'jenkins',
  'terraform',
  'ansible',
  'prometheus',
  'grafana',
  'nginx',
  'apache',
  'traefik',
  'consul',
  'vault',
  'azure',
  'amazonwebservices',
  'googlecloud',
  'digitalocean',
  'heroku',
  'cloudflare',
  'firebase',
  'supabase',
  'vercel',
  'netlify',
  'argocd',

  // Ferramentas de Build
  'webpack',
  'vite',
  'rollup',
  'parcel',
  'esbuild',
  'babel',
  'gulp',
  'grunt',

  // Testes
  'jest',
  'vitest',
  'mocha',
  'jasmine',
  'cypressio',
  'playwright',
  'selenium',
  'puppeteer',
  'karma',
  'cucumber',

  // Versionamento
  'git',
  'github',
  'gitlab',
  'bitbucket',
  'mercurial',

  // IDEs e Editores
  'vscode',
  'intellij',
  'pycharm',
  'webstorm',
  'androidstudio',
  'xcode',
  'vim',
  'neovim',
  'emacs',
  'atom',
  'sublimetext',

  // CSS & Styling
  'css3',
  'sass',
  'less',
  'tailwindcss',
  'bootstrap',
  'materialui',
  'bulma',
  'vuetify',
  'chakraui',
  'antdesign',

  // Mobile
  'flutter',
  'reactnative',
  'ionic',
  'xamarin',
  'capacitor',
  'cordova',

  // Sistemas Operacionais
  'linux',
  'ubuntu',
  'debian',
  'centos',
  'fedora',
  'archlinux',
  'redhat',
  'alpine',
  'windows11',
  'apple',
  'android',

  // APIs & GraphQL
  'graphql',
  'grpc',
  'swagger',
  'postman',

  // Outras Ferramentas
  'eslint',
  'prettier',
  'npm',
  'yarn',
  'pnpm',
  'homebrew',
  'jira',
  'confluence',
  'slack',
  'discord',
  'notion',
  'figma',
  'sketch',
  'blender',
  'unity',
  'unrealengine',
  'godot',
]

const logosIcons = [
  // Linguagens & Frameworks (logos tem ícones coloridos de alta qualidade)
  'nodejs-icon',
  'python',
  'java',
  'go',
  'rust',
  'typescript-icon',
  'javascript',
  'vue',
  'react',
  'angular-icon',
  'svelte-icon',
  'nuxt-icon',
  'nextjs-icon',
  'astro-icon',
  'vitejs',
  'webpack',

  // Bancos de Dados
  'mongodb-icon',
  'postgresql',
  'mysql-icon',
  'redis',
  'sqlite',
  'elasticsearch',
  'firebase',

  // DevOps & Cloud
  'docker-icon',
  'kubernetes',
  'jenkins',
  'gitlab',
  'github-icon',
  'nginx',
  'apache',
  'linux-tux',
  'ubuntu',
  'debian',
  'aws',
  'azure-icon',
  'google-cloud',
  'digitalocean',
  'heroku-icon',

  // Ferramentas
  'visual-studio-code',
  'intellij-idea',
  'vim',
  'git-icon',
  'bash-icon',
  'rollupjs',
  'babel',
  'eslint',
  'prettier',
  'jest',
  'vitest',
  'cypress-icon',
  'playwright',
  'figma',
  'sketch',
  'adobe-xd',

  // CMS & Plataformas
  'wordpress',
  'shopify',
  'strapi',
  'slack-icon',
  'discord-icon',
  'notion',
]

const skillIconsIcons = [
  // Linguagens (skill-icons tem versões dark/light)
  'nodejs-dark',
  'python-dark',
  'java-dark',
  'golang',
  'rust',
  'typescript',
  'javascript',

  // Frameworks Frontend
  'vuejs-dark',
  'react-dark',
  'angular-dark',
  'svelte',
  'nuxtjs-dark',
  'nextjs-dark',
  'astro',
  'solidjs-dark',

  // Backend
  'django',
  'flask-dark',
  'fastapi',
  'dotnet',
  'spring-dark',
  'laravel-dark',
  'rails',

  // Bancos de Dados
  'mongodb',
  'postgresql-dark',
  'mysql-dark',
  'redis-dark',
  'sqlite',

  // DevOps & Cloud
  'docker',
  'kubernetes',
  'jenkins-dark',
  'gitlab-dark',
  'github-dark',
  'nginx',
  'linux-dark',
  'ubuntu-dark',
  'debian-dark',
  'aws-dark',
  'azure-dark',
  'gcp-dark',
  'vercel-dark',
  'netlify-dark',

  // Ferramentas
  'vscode-dark',
  'idea-dark',
  'vim-dark',
  'neovim-dark',
  'git',
  'webpack-dark',
  'vite-dark',
  'rollup-dark',
  'babel',
  'jest',
  'vitest-dark',
  'cypress-dark',
  'selenium',

  // CSS & UI
  'tailwindcss-dark',
  'bootstrap',
  'sass',
  'css',
  'materialui-dark',
  'styledcomponents',

  // Outros
  'graphql-dark',
  'firebase',
  'supabase-dark',
  'figma-dark',
  'notion-dark',
  'discord',
]

const mdiIcons = [
  // Tecnologias (mdi tem ícones simples monocromáticos)
  'vuejs',
  'react',
  'angular',
  'docker',
  'kubernetes',
  'git',
  'github',
  'gitlab',
  'linux',
  'microsoft-visual-studio-code',
  'vuetify',
  'language-typescript',
  'language-javascript',
  'language-python',
  'language-java',
  'language-go',
  'language-rust',
  'language-csharp',

  // Conceitos
  'database',
  'cloud',
  'server',
  'api',
  'web',
  'code-tags',
  'brain',
  'star-circle',
  'monitor',
  'laptop',
  'cellphone',

  // AWS Services (MDI tem muitos ícones AWS)
  'aws',
]

const filteredDevicons = computed(() => {
  if (!search.value) return deviconIcons
  return deviconIcons.filter(icon => icon.toLowerCase().includes(search.value.toLowerCase()))
})

const filteredLogos = computed(() => {
  if (!search.value) return logosIcons
  return logosIcons.filter(icon => icon.toLowerCase().includes(search.value.toLowerCase()))
})

const filteredSkillIcons = computed(() => {
  if (!search.value) return skillIconsIcons
  return skillIconsIcons.filter(icon => icon.toLowerCase().includes(search.value.toLowerCase()))
})

const filteredMdiIcons = computed(() => {
  if (!search.value) return mdiIcons
  return mdiIcons.filter(icon => icon.toLowerCase().includes(search.value.toLowerCase()))
})

function onSelectIcon(iconName: string) {
  emit('update:modelValue', iconName)
  dialog.value = false
}
</script>

<style scoped>
.admin-dialog-actions .v-btn {
  text-transform: capitalize !important;
}
</style>
