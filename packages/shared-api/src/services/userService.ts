import { apiClient } from '../client/apiClient'
import type { AxiosResponse } from 'axios'

/**
 * User Service
 * Handles user profile and avatar operations
 */

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string
  userType: string
  verified: boolean
  active: boolean
  registrationDate?: string
  lastSession?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  phone?: string
}

export const userService = {
  /**
   * Get current user profile (authenticated)
   */
  async getMe(): Promise<User> {
    const response: AxiosResponse<{ success: boolean; data: User }> =
      await apiClient.get('/api/v1/users/me')
    return response.data.data
  },

  /**
   * Update current user profile (authenticated)
   */
  async updateMe(data: UpdateUserData): Promise<User> {
    const response: AxiosResponse<{ success: boolean; data: User }> =
      await apiClient.put('/api/v1/users/me', data)
    return response.data.data
  },

  /**
   * Upload user avatar (authenticated)
   */
  async uploadAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
    const response: AxiosResponse<{
      success: boolean
      data: { avatarUrl: string }
      message: string
    }> = await apiClient.post('/api/v1/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  },

  /**
   * Get public user profile by ID
   */
  async getById(id: number): Promise<User> {
    const response: AxiosResponse<{ success: boolean; data: User }> =
      await apiClient.get(`/api/v1/users/${id}`)
    return response.data.data
  }
}

export default userService
