import { create } from 'zustand'
import { propertyService, type Property, type PropertySearchParams } from '@bienesraices/shared-api'

/**
 * Property Store
 * Manages property list, search, filters, and pagination
 */

export interface PropertyFilters {
  q?: string // search query
  propertyType?: string
  operationType?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  state?: string
  bedrooms?: number
  bathrooms?: number
  minArea?: number
  maxArea?: number
  featured?: boolean
}

interface PropertyState {
  // State
  properties: Property[]
  filters: PropertyFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  loading: boolean
  error: string | null

  // Actions
  searchProperties: (filters?: PropertyFilters, page?: number) => Promise<void>
  applyFilters: (filters: PropertyFilters) => Promise<void>
  clearFilters: () => Promise<void>
  loadMore: () => Promise<void>
  setFilter: (key: keyof PropertyFilters, value: any) => void
  setError: (error: string | null) => void
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  // Initial state
  properties: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  loading: false,
  error: null,

  // Search properties
  searchProperties: async (filters?: PropertyFilters, page: number = 1) => {
    set({ loading: true, error: null })
    try {
      const searchParams: PropertySearchParams = {
        ...get().filters,
        ...filters,
        page,
        limit: get().pagination.limit
      }

      const response = await propertyService.search(searchParams)

      set({
        properties: page === 1 ? response.data : [...get().properties, ...response.data],
        pagination: response.pagination,
        loading: false
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al buscar propiedades'
      set({
        error: errorMessage,
        loading: false
      })
      throw error
    }
  },

  // Apply filters and search
  applyFilters: async (filters: PropertyFilters) => {
    set({ filters, pagination: { ...get().pagination, page: 1 } })
    await get().searchProperties(filters, 1)
  },

  // Clear all filters
  clearFilters: async () => {
    set({ filters: {}, pagination: { ...get().pagination, page: 1 } })
    await get().searchProperties({}, 1)
  },

  // Load more properties (pagination)
  loadMore: async () => {
    const { pagination } = get()
    if (pagination.hasNextPage && !get().loading) {
      await get().searchProperties(get().filters, pagination.page + 1)
    }
  },

  // Set individual filter
  setFilter: (key: keyof PropertyFilters, value: any) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    }))
  },

  // Set error
  setError: (error: string | null) => {
    set({ error })
  }
}))

export default usePropertyStore
