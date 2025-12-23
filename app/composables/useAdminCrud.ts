import { computed } from 'vue'

/**
 * Composable genérico para Admin CRUD
 * Fornece métodos padronizados para qualquer store admin
 */
export function useAdminCrud<T extends Record<string, any>>(store: any) {
  return {
    // Data
    items: computed(
      () =>
        store.allItems ??
        store.items ??
        store.allProjects ??
        store.allSkills ??
        store.allCertifications ??
        store.allCourses ??
        store.allContacts ??
        store.projects ??
        store.skills ??
        store.certifications ??
        store.courses ??
        store.contacts ??
        []
    ),
    loading: computed(() => store.loading),

    // Stats (se disponíveis)
    stats: computed(() => {
      const itemsArray =
        store.allItems ??
        store.items ??
        store.allProjects ??
        store.allSkills ??
        store.allCertifications ??
        store.allCourses ??
        store.allContacts ??
        store.projects ??
        store.skills ??
        store.certifications ??
        store.courses ??
        store.contacts ??
        []

      return {
        total: itemsArray?.length ?? 0,
        activeCount: store.activeCount ?? 0,
        inactiveCount: store.inactiveCount ?? 0,
        categoriesCount: store.categoriesCount ?? 0,
        // Outros stats específicos podem ser acessados diretamente
      }
    }),

    // CRUD methods
    onFetch: () =>
      store.fetchItems?.() ??
      store.fetchProjects?.() ??
      store.fetchSkills?.() ??
      store.fetchCertifications?.() ??
      store.fetchCourses?.() ??
      store.fetchContacts?.() ??
      Promise.resolve(),

    onCreate: (item: Partial<T>) =>
      store.createItem?.(item) ??
      store.createProject?.(item) ??
      store.createSkill?.(item) ??
      store.createCertification?.(item) ??
      store.createCourse?.(item) ??
      store.createContact?.(item) ??
      Promise.resolve(),

    onUpdate: (id: string, item: Partial<T>) =>
      store.updateItem?.(id, item) ??
      store.updateProject?.(id, item) ??
      store.updateSkill?.(id, item) ??
      store.updateCertification?.(id, item) ??
      store.updateCourse?.(id, item) ??
      store.updateContact?.(id, item) ??
      Promise.resolve(),

    onDelete: (id: string) =>
      store.deleteItem?.(id) ??
      store.deleteProject?.(id) ??
      store.deleteSkill?.(id) ??
      store.deleteCertification?.(id) ??
      store.deleteCourse?.(id) ??
      store.deleteContact?.(id) ??
      Promise.resolve(),

    onToggleActive: (item: T) => store.toggleActive?.(item) ?? Promise.resolve(),
  }
}
