import { apiClient } from '../client/apiClient'
import type { AxiosResponse } from 'axios'

/**
 * Property Service
 * Handles all property-related API calls
 */

export interface PropertySearchParams {
  page?: number
  limit?: number
  q?: string // search query
  propertyType?: string
  operationType?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  state?: string
  featured?: boolean
  bedrooms?: number
  bathrooms?: number
  minArea?: number
  maxArea?: number
}

export interface Property {
  id: number
  title: string
  description: string
  propertyType: string
  operationType: string
  price: string
  currency: string
  address: string
  city: string
  state: string
  postalCode?: string
  country: string
  latitude?: string
  longitude?: string
  totalArea?: number
  coveredArea?: number
  bedrooms?: number
  bathrooms?: number
  garages?: number
  age?: number
  featured: boolean
  active: boolean
  mainImageUrl?: string
  createdAt: string
  images?: PropertyImage[]
  owner?: PropertyOwner
}

export interface PropertyImage {
  id: number
  url: string
  thumbnailUrl?: string
  isPrimary: boolean
  order: number
}

export interface PropertyOwner {
  id: number
  firstName: string
  lastName: string
  email: string
  avatarUrl?: string
  phone?: string
}

export interface PropertySearchResponse {
  success: boolean
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  data: Property[]
}

export interface PropertyTypesResponse {
  success: boolean
  propertyTypes: Array<{ value: string; label: string }>
  operationTypes: Array<{ value: string; label: string }>
}

export interface ContactPropertyData {
  name: string
  phone: string
  email: string
  message: string
}

export const propertyService = {
  /**
   * Search properties with filters and pagination
   */
  async search(params: PropertySearchParams = {}): Promise<PropertySearchResponse> {
    const response: AxiosResponse<PropertySearchResponse> = await apiClient.get(
      '/api/v1/properties',
      { params }
    )
    return response.data
  },

  /**
   * Get property by ID
   */
  async getById(id: number): Promise<Property> {
    const response: AxiosResponse<{ success: boolean; data: Property }> =
      await apiClient.get(`/api/v1/properties/${id}`)
    return response.data.data
  },

  /**
   * Get property and operation types
   */
  async getTypes(): Promise<PropertyTypesResponse> {
    const response: AxiosResponse<PropertyTypesResponse> = await apiClient.get(
      '/api/v1/properties/types'
    )
    return response.data
  },

  /**
   * Contact property owner
   */
  async contact(
    propertyId: number,
    data: ContactPropertyData
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(
      `/api/v1/properties/${propertyId}/contact`,
      data
    )
    return response.data
  },

  /**
   * Get user's own properties (authenticated)
   */
  async getMyProperties(): Promise<Property[]> {
    const response: AxiosResponse<{ success: boolean; total: number; data: Property[] }> =
      await apiClient.get('/api/v1/users/me/properties')
    return response.data.data
  },

  /**
   * Create new property (authenticated)
   */
  async create(formData: FormData): Promise<Property> {
    const response: AxiosResponse<{ success: boolean; data: Property }> =
      await apiClient.post('/api/v1/users/me/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    return response.data.data
  },

  /**
   * Update property (authenticated)
   */
  async update(id: number, formData: FormData): Promise<Property> {
    const response: AxiosResponse<{ success: boolean; data: Property }> =
      await apiClient.put(`/api/v1/users/me/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    return response.data.data
  },

  /**
   * Delete property (authenticated)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/users/me/properties/${id}`)
  },

  /**
   * Toggle property active status (authenticated)
   */
  async toggleActive(id: number, active: boolean): Promise<void> {
    await apiClient.patch(`/api/v1/users/me/properties/${id}`, { active })
  }
}

export default propertyService
