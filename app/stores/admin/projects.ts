import { defineStore } from 'pinia'
import type { Project } from '~/types/admin'

export const useAdminProjectsStore = defineStore('admin-projects', () => {
  // Usa composable genérico para operações CRUD
  const api = useAdminApi<Project>({ endpoint: 'projects' })

  // Getters computados
  const allProjects = computed(() => api.data.value)
  const activeCount = computed(() => api.data.value.filter(p => p.active).length)
  const inactiveCount = computed(() => api.data.value.filter(p => !p.active).length)
  const categoriesCount = computed(() => {
    const uniqueCategories = new Set(api.data.value.map(p => p.category))
    return uniqueCategories.size
  })

  // Projetos ordenados (lógica específica de projects)
  const sortedProjects = computed(() => {
    return [...api.data.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  })

  // Wrapper para fetchProjects que aplica ordenação
  const fetchProjects = async () => {
    const result = await api.fetchAll()
    // Dados já são ordenados via computed sortedProjects
    return result
  }

  return {
    // State
    projects: api.data,
    loading: api.loading,
    error: api.error,

    // Getters
    allProjects,
    sortedProjects,
    activeCount,
    inactiveCount,
    categoriesCount,

    // Actions
    fetchProjects,
    createProject: api.create,
    updateProject: api.update,
    deleteProject: api.remove,
    toggleActive: api.toggleActive,
  }
})
