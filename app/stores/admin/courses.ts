import { defineStore } from 'pinia'
import type { Course } from '~/types/admin'

export const useAdminCoursesStore = defineStore('admin-courses', () => {
  // Usa composable genérico para operações CRUD
  const api = useAdminApi<Course>({ endpoint: 'courses' })

  // Getters computados
  const allCourses = computed(() => api.data.value)
  const activeCount = computed(() => api.data.value.filter(c => c.active).length)
  const inactiveCount = computed(() => api.data.value.filter(c => !c.active).length)
  const uniqueYears = computed(() => {
    const years = new Set(
      api.data.value.filter(c => c.date).map(c => new Date(c.date).getFullYear())
    )
    return years.size
  })

  // Cursos ordenados por data (lógica específica de courses)
  const sortedCourses = computed(() => {
    return [...api.data.value].sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  // Wrapper para fetchCourses
  const fetchCourses = async () => {
    const result = await api.fetchAll()
    return result
  }

  return {
    // State
    courses: api.data,
    loading: api.loading,
    error: api.error,

    // Getters
    allCourses,
    sortedCourses,
    activeCount,
    inactiveCount,
    uniqueYears,

    // Actions
    fetchCourses,
    createCourse: api.create,
    updateCourse: api.update,
    deleteCourse: api.remove,
    toggleActive: api.toggleActive,
  }
})
