import { computed } from 'vue'

/**
 * Composable genérico para Admin CRUD
 * Fornece métodos padronizados para qualquer store admin
 */

export function useAdminCrud<T extends Record<string, any>>(store: any) {
  // Helper para buscar valores de diferentes propriedades

  const getStoreValue = (keys: string[], fallback: any = []) => {
    for (const key of keys) {
      if (store[key] !== undefined && store[key] !== null) {
        return store[key]
      }
    }
    return fallback
  }

  const getStoreMethod = (
    keys: string[],

    fallback: () => Promise<any> = () => Promise.resolve()
  ) => {
    for (const key of keys) {
      if (typeof store[key] === 'function') {
        return store[key]
      }
    }
    return fallback
  }

  const itemKeys = [
    'allItems',
    'items',
    'allProjects',
    'allSkills',
    'allCertifications',
    'allCourses',
    'allContacts',
    'projects',
    'skills',
    'certifications',
    'courses',
    'contacts',
  ]

  return {
    // Data
    items: computed(() => getStoreValue(itemKeys, [])),
    loading: computed(() => store.loading),

    // Stats (se disponíveis)
    stats: computed(() => {
      const itemsArray = getStoreValue(itemKeys, [])

      return {
        total: itemsArray?.length ?? 0,
        activeCount: store.activeCount ?? 0,
        inactiveCount: store.inactiveCount ?? 0,
        categoriesCount: store.categoriesCount ?? 0,
      }
    }),

    // CRUD methods
    onFetch: () =>
      getStoreMethod([
        'fetchItems',
        'fetchProjects',
        'fetchSkills',
        'fetchCertifications',
        'fetchCourses',
        'fetchContacts',
      ])(),

    onCreate: (item: Partial<T>) =>
      getStoreMethod([
        'createItem',
        'createProject',
        'createSkill',
        'createCertification',
        'createCourse',
        'createContact',
      ])(item),

    onUpdate: (id: string, item: Partial<T>) =>
      getStoreMethod([
        'updateItem',
        'updateProject',
        'updateSkill',
        'updateCertification',
        'updateCourse',
        'updateContact',
      ])(id, item),

    onDelete: (id: string) =>
      getStoreMethod([
        'deleteItem',
        'deleteProject',
        'deleteSkill',
        'deleteCertification',
        'deleteCourse',
        'deleteContact',
      ])(id),

    onToggleActive: (item: T) => getStoreMethod(['toggleActive'])(item),
  }
}
