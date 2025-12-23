import { defineStore } from 'pinia'
import type { Project } from '~/types/admin'

export const useAdminProjectsStore = defineStore('admin-projects', {
  state: () => ({
    projects: [] as Project[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allProjects: state => state.projects,
    activeCount: state => state.projects.filter(p => p.active).length,
    inactiveCount: state => state.projects.filter(p => !p.active).length,
    categoriesCount: state => {
      const uniqueCategories = new Set(state.projects.map(p => p.category))
      return uniqueCategories.size
    },
  },

  actions: {
    async fetchProjects() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const data = await $fetch<Project[]>(`${config.public.apiUrl}/projects/admin/all`)
        this.projects = data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        return data
      } catch (error: any) {
        this.error = error?.message ?? 'Erro ao carregar projetos'
        console.error('Erro ao carregar projetos:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProject(projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) {
      try {
        const config = useRuntimeConfig()
        const newProject = await $fetch<Project>(`${config.public.apiUrl}/projects`, {
          method: 'POST',
          body: projectData,
        })
        await this.fetchProjects()
        return newProject
      } catch (error: any) {
        const errorMsg = error?.data?.message ?? error?.message ?? 'Erro ao criar projeto'
        console.error('Erro ao criar projeto:', error)
        throw new Error(errorMsg)
      }
    },

    async updateProject(id: string, projectData: Partial<Project>) {
      try {
        const config = useRuntimeConfig()
        const {
          _id,
          createdAt: _createdAt,
          updatedAt: _updatedAt,
          __v,
          order: _order,
          ...cleanData
        } = projectData as any

        const updatedProject = await $fetch<Project>(`${config.public.apiUrl}/projects/${id}`, {
          method: 'PUT',
          body: cleanData,
        })

        await this.fetchProjects()
        return updatedProject
      } catch (error: any) {
        const errorMsg = error?.data?.message ?? error?.message ?? 'Erro ao atualizar projeto'
        console.error('Erro ao atualizar projeto:', error)
        throw new Error(errorMsg)
      }
    },

    async toggleActive(project: Project) {
      try {
        const updatedProject = { ...project, active: !project.active }
        await this.updateProject(project._id!, updatedProject)
        return updatedProject
      } catch (error: any) {
        console.error('Erro ao alterar status do projeto:', error)
        throw error
      }
    },

    async deleteProject(id: string) {
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiUrl}/projects/${id}`, {
          method: 'DELETE',
        })
        await this.fetchProjects()
      } catch (error: any) {
        console.error('Erro ao excluir projeto:', error)
        throw error
      }
    },
  },
})
