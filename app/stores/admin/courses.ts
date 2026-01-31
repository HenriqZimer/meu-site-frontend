import { defineStore } from 'pinia'
import type { Course } from '~/types/admin'

export const useAdminCoursesStore = defineStore('admin-courses', {
  state: () => ({
    courses: [] as Course[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allCourses: state => state.courses,
    activeCount: state => state.courses.filter(c => c.active).length,
    inactiveCount: state => state.courses.filter(c => !c.active).length,
    uniqueYears: state => {
      const years = new Set(
        state.courses.filter(c => c.date).map(c => new Date(c.date).getFullYear())
      )
      return years.size
    },
  },

  actions: {
    async fetchCourses() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const data = await $fetch<Course[]>(`${config.public.apiUrl}/courses/admin/all`)
        this.courses = data.toSorted((a, b) => {
          if (!a.date) return 1
          if (!b.date) return -1
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        return data
      } catch (error: any) {
        this.error = error?.message ?? 'Erro ao carregar cursos'
        console.error('Erro ao carregar cursos:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCourse(courseData: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>) {
      try {
        const config = useRuntimeConfig()
        const newCourse = await $fetch<Course>(`${config.public.apiUrl}/courses`, {
          method: 'POST',
          body: courseData,
        })
        await this.fetchCourses()
        return newCourse
      } catch (error: any) {
        const errorMsg = error?.data?.message ?? error?.message ?? 'Erro ao criar curso'
        console.error('Erro ao criar curso:', error)
        throw new Error(errorMsg)
      }
    },

    async updateCourse(id: string, courseData: Partial<Course>) {
      try {
        const config = useRuntimeConfig()
        const {
          _id,
          createdAt: _createdAt,
          updatedAt: _updatedAt,
          year: _year,
          month: _month,
          order: _order,
          __v,
          ...cleanData
        } = courseData as any

        const updatedCourse = await $fetch<Course>(`${config.public.apiUrl}/courses/${id}`, {
          method: 'PUT',
          body: cleanData,
        })

        await this.fetchCourses()
        return updatedCourse
      } catch (error: any) {
        const errorMsg = error?.data?.message ?? error?.message ?? 'Erro ao atualizar curso'
        console.error('Erro ao atualizar curso:', error)
        throw new Error(errorMsg)
      }
    },

    async toggleActive(course: Course) {
      try {
        const updatedCourse = { ...course, active: !course.active }
        await this.updateCourse((course as any)._id!, updatedCourse)
        return updatedCourse
      } catch (error: any) {
        console.error('Erro ao alterar status do curso:', error)
        throw error
      }
    },

    async deleteCourse(id: string) {
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiUrl}/courses/${id}`, {
          method: 'DELETE',
        })
        await this.fetchCourses()
      } catch (error: any) {
        console.error('Erro ao excluir curso:', error)
        throw error
      }
    },
  },
})
