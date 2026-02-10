import type { Ref } from 'vue'

/**
 * Base interface que todos os modelos devem estender
 * Garante que _id existe para operações de update/delete
 */
interface BaseModel {
  _id: string

  [key: string]: any
}

interface UseAdminApiOptions<T> {
  endpoint: string
  initialData?: T[]
}

interface UseAdminApiReturn<T> {
  data: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchAll: () => Promise<T[]>
  create: (item: Omit<T, '_id' | 'createdAt' | 'updatedAt'>) => Promise<T>
  update: (id: string, item: Partial<T>) => Promise<T>
  remove: (id: string) => Promise<void>
  toggleActive: (item: T & { active: boolean }) => Promise<T>
}

/**
 * Composable genérico para operações CRUD com API Admin
 *
 * Elimina duplicação de código entre stores admin
 * Centraliza error handling e autenticação
 *
 * @example
 * ```typescript
 * // Em stores/admin/projects.ts
 * const api = useAdminApi<Project>({ endpoint: 'projects' })
 *
 * return {
 *   projects: api.data,
 *   loading: api.loading,
 *   fetchProjects: api.fetchAll,
 *   createProject: api.create,
 * }
 * ```
 *
 * @template T - Tipo do modelo, deve estender BaseModel para garantir _id
 */
export function useAdminApi<T extends BaseModel>(
  options: UseAdminApiOptions<T>
): UseAdminApiReturn<T> {
  const { endpoint, initialData = [] } = options
  const config = useRuntimeConfig()

  const data = ref<T[]>(initialData) as Ref<T[]>
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Busca todos os itens do endpoint
   * GET /api/{endpoint}/admin/all
   */
  const fetchAll = async (): Promise<T[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<T[]>(`${config.public.apiUrl}/${endpoint}/admin/all`, {
        headers: getAuthHeaders(),
      })

      data.value = response as T[]
      return response as T[]
    } catch (err: unknown) {
      const errorMsg =
        (err as any)?.data?.message ?? (err as any)?.message ?? `Erro ao carregar ${endpoint}`
      error.value = errorMsg

      if (import.meta.dev) {
        console.error(`[useAdminApi] fetchAll ${endpoint}:`, err as any)
      }

      throw new Error(errorMsg)
    } finally {
      loading.value = false
    }
  }

  /**
   * Cria um novo item
   * POST /api/{endpoint}
   */
  const create = async (item: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T> => {
    try {
      const newItem = await $fetch<T>(`${config.public.apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: item,
      })

      await fetchAll() // Recarrega lista
      return newItem as T
    } catch (err: unknown) {
      const errorMsg =
        (err as any)?.data?.message ?? (err as any)?.message ?? `Erro ao criar ${endpoint}`

      if (import.meta.dev) {
        console.error(`[useAdminApi] create ${endpoint}:`, err as any)
      }

      throw new Error(errorMsg)
    }
  }

  /**
   * Atualiza um item existente
   * PUT /api/{endpoint}/{id}
   */
  const update = async (id: string, item: Partial<T>): Promise<T> => {
    try {
      // Remove campos imutáveis

      const { _id, _createdAt, _updatedAt, __v, ...cleanData } = item as any

      const updatedItem = await $fetch<T>(`${config.public.apiUrl}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: cleanData,
      })

      await fetchAll() // Recarrega lista
      return updatedItem as T
    } catch (err: unknown) {
      const errorMsg =
        (err as any)?.data?.message ?? (err as any)?.message ?? `Erro ao atualizar ${endpoint}`

      if (import.meta.dev) {
        console.error(`[useAdminApi] update ${endpoint}:`, err as any)
      }

      throw new Error(errorMsg)
    }
  }

  /**
   * Deleta um item
   * DELETE /api/{endpoint}/{id}
   */
  const remove = async (id: string): Promise<void> => {
    try {
      await $fetch(`${config.public.apiUrl}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      await fetchAll() // Recarrega lista
    } catch (err: unknown) {
      const errorMsg =
        (err as any)?.data?.message ?? (err as any)?.message ?? `Erro ao deletar ${endpoint}`

      if (import.meta.dev) {
        console.error(`[useAdminApi] remove ${endpoint}:`, err as any)
      }

      throw new Error(errorMsg)
    }
  }

  /**
   * Alterna o estado active de um item
   * Apenas funciona se o item tiver propriedade 'active'
   */
  const toggleActive = async (item: T & { active: boolean }): Promise<T> => {
    // Type-safe: garante que item tem _id (de BaseModel) e active
    // Usamos Partial<T> e fazemos cast explícito para evitar erro de tipo
    return await update(item._id, { active: !item.active } as unknown as Partial<T>)
  }

  return {
    data,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    toggleActive,
  }
}

/**
 * Helper para obter headers de autenticação
 * Busca token do localStorage (apenas no client-side)
 */
function getAuthHeaders(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
  }
  return {}
}

/**
 * Helper para verificar se está autenticado
 */
export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('admin_token')
  }
  return false
}
