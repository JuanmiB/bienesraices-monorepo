import { apiClient } from '../client/apiClient'
import type { AxiosResponse } from 'axios'

/**
 * Authentication Service
 * Handles all auth-related API calls
 */

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstname: string
  lastName: string
  email: string
  password: string
  phone?: string
  usertype?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    avatarUrl?: string
    type_user?: string
    verified: boolean
  }
}

export interface VerifyResponse {
  authenticated: boolean
  user: {
    sub: number
    email: string
    name: string
    avatarUrl?: string
    foto?: string
  }
}

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      '/api/v1/auth/login',
      credentials
    )
    return response.data
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      '/api/v1/auth/register',
      data
    )
    return response.data
  },

  /**
   * Verify current authentication status
   */
  async verify(): Promise<VerifyResponse> {
    const response: AxiosResponse<VerifyResponse> = await apiClient.get(
      '/api/v1/auth/verify'
    )
    return response.data
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await apiClient.post('/api/v1/auth/logout')
  },

  /**
   * Request password recovery email
   */
  async recoverPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/api/v1/auth/password/recover', {
      email
    })
    return response.data
  },

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post(
      `/api/v1/auth/password/reset/${token}`,
      { password }
    )
    return response.data
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/api/v1/auth/email/verify', {
      token
    })
    return response.data
  }
}

export default authService
