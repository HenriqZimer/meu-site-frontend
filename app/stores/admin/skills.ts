import { defineStore } from 'pinia'
import type { Skill } from '~/types/admin'

export const useAdminSkillsStore = defineStore('admin-skills', () => {
  // Usa composable genérico para operações CRUD
  const api = useAdminApi<Skill>({ endpoint: 'skills' })

  // Getters computados
  const allSkills = computed(() => api.data.value)
  const activeCount = computed(() => api.data.value.filter(s => s.active).length)
  const inactiveCount = computed(() => api.data.value.filter(s => !s.active).length)
  const categoriesCount = computed(() => {
    const uniqueCategories = new Set(api.data.value.map(s => s.category))
    return uniqueCategories.size
  })

  // Skills ordenadas (lógica específica de skills)
  const sortedSkills = computed(() => {
    return [...api.data.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  })

  // Wrapper para fetchSkills
  const fetchSkills = async () => {
    const result = await api.fetchAll()
    return result
  }

  return {
    // State
    skills: api.data,
    loading: api.loading,
    error: api.error,

    // Getters
    allSkills,
    sortedSkills,
    activeCount,
    inactiveCount,
    categoriesCount,

    // Actions
    fetchSkills,
    createSkill: api.create,
    updateSkill: api.update,
    deleteSkill: api.remove,
    toggleActive: api.toggleActive,
  }
})
