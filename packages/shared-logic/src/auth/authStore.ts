import { create } from 'zustand'
import { authService, type User, type LoginCredentials, type RegisterData } from '@bienesraices/shared-api'

/**
 * Authentication Store
 * Platform-agnostic auth state management using Zustand
 *
 * Note: Token persistence is handled separately by platform-specific code
 * - Web: localStorage via initTokenStorage
 * - Mobile: AsyncStorage via initTokenStorage
 */

interface AuthState {
  // State
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  recoverPassword: (email: string) => Promise<void>
  resetPassword: (newPassword: string, token: string) => Promise<void>
  setToken: (token: string | null) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,

  // Login action
  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const response = await authService.login({ email, password })

      set({
        isAuthenticated: true,
        user: {
          ...response.user,
          userType: response.user.type_user || 'buyer',
          active: true
        },
        token: response.token || null,
        loading: false,
        error: null
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión'
      set({
        error: errorMessage,
        loading: false,
        isAuthenticated: false
      })
      throw error
    }
  },

  // Register action
  register: async (data: RegisterData) => {
    set({ loading: true, error: null })
    try {
      const response = await authService.register(data)

      set({
        user: {
          ...response.user,
          userType: response.user.type_user || 'buyer',
          active: true
        },
        loading: false,
        error: null,
        // User needs to verify email before being authenticated
        isAuthenticated: false
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrarse'
      set({
        error: errorMessage,
        loading: false
      })
      throw error
    }
  },

  // Logout action
  logout: async () => {
    set({ loading: true })
    try {
      await authService.logout()

      set({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cerrar sesión'
      set({
        error: errorMessage,
        loading: false
      })
      throw error
    }
  },

  // Refresh user data
  refreshUser: async () => {
    set({ loading: true })
    try {
      const response = await authService.verify()

      const user: User = {
        id: response.user.sub,
        firstName: response.user.name,
        lastName: '',
        email: response.user.email,
        avatarUrl: response.user.avatarUrl || response.user.foto,
        userType: '',
        verified: true,
        active: true
      }

      set({
        isAuthenticated: true,
        user,
        loading: false
      })
    } catch (error) {
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      })
    }
  },

  // Recover password
  recoverPassword: async (email: string) => {
    set({ loading: true, error: null })
    try {
      await authService.recoverPassword(email)
      set({ loading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al recuperar contraseña'
      set({
        error: errorMessage,
        loading: false
      })
      throw error
    }
  },

  // Reset password
  resetPassword: async (newPassword: string, token: string) => {
    set({ loading: true, error: null })
    try {
      await authService.resetPassword(token, newPassword)

      set({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al restablecer contraseña'
      set({
        error: errorMessage,
        loading: false
      })
      throw error
    }
  },

  // Set token (called after login or when loading from storage)
  setToken: (token: string | null) => {
    set({ token })
  },

  // Set error
  setError: (error: string | null) => {
    set({ error })
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  }
}))

export default useAuthStore
