import { defineStore } from 'pinia'
import type { Skill } from '~/types/admin'

export const useAdminSkillsStore = defineStore('admin-skills', {
  state: () => ({
    skills: [] as Skill[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allSkills: state => state.skills,
    activeCount: state => state.skills.filter(s => s.active).length,
    inactiveCount: state => state.skills.filter(s => !s.active).length,
    categoriesCount: state => {
      const uniqueCategories = new Set(state.skills.map(s => s.category))
      return uniqueCategories.size
    },
  },

  actions: {
    async fetchSkills() {
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const data = await $fetch<Skill[]>(`${config.public.apiUrl}/skills/admin/all`)
        this.skills = data.toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0))
        return data
      } catch (error: any) {
        this.error = error?.message ?? 'Erro ao carregar skills'
        console.error('Erro ao carregar skills:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createSkill(skillData: Omit<Skill, '_id' | 'createdAt' | 'updatedAt'>) {
      try {
        const config = useRuntimeConfig()
        const newSkill = await $fetch<Skill>(`${config.public.apiUrl}/skills`, {
          method: 'POST',
          body: skillData,
        })
        await this.fetchSkills()
        return newSkill
      } catch (error: any) {
        const errorMsg = error?.data?.message ?? error?.message ?? 'Erro ao criar skill'
        console.error('Erro ao criar skill:', error)
        throw new Error(errorMsg)
      }
    },

    async updateSkill(id: string, skillData: Partial<Skill>) {
      try {
        const config = useRuntimeConfig()
        const {
          _id,
          createdAt: _createdAt,
          updatedAt: _updatedAt,
          __v,
          order: _order,
          bgColor: _bgColor,
          ...cleanData
        } = skillData as any

        const updatedSkill = await $fetch<Skill>(`${config.public.apiUrl}/skills/${id}`, {
          method: 'PUT',
          body: cleanData,
        })

        await this.fetchSkills()
        return updatedSkill
      } catch (error: any) {
        const errorMsg = error?.data?.message ?? error?.message ?? 'Erro ao atualizar skill'
        console.error('Erro ao atualizar skill:', error)
        throw new Error(errorMsg)
      }
    },

    async toggleActive(skill: Skill) {
      try {
        const updatedSkill = { ...skill, active: !skill.active }
        await this.updateSkill(skill._id!, updatedSkill)
        return updatedSkill
      } catch (error: any) {
        console.error('Erro ao alterar status da skill:', error)
        throw error
      }
    },

    async deleteSkill(id: string) {
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiUrl}/skills/${id}`, {
          method: 'DELETE',
        })
        await this.fetchSkills()
      } catch (error: any) {
        console.error('Erro ao excluir skill:', error)
        throw error
      }
    },
  },
})
