import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

/**
 * Platform-agnostic API client configuration
 * Works for both web (Vite) and mobile (Expo)
 */

// Platform detection helper
const isWeb = typeof window !== 'undefined' && typeof window.document !== 'undefined'
const isMobile = !isWeb

// Get API URL based on platform
const getApiUrl = (): string => {
  // Try to get from environment variables
  // For web with Vite: VITE_API_URL (injected at build time)
  // For mobile with Expo: EXPO_PUBLIC_API_URL
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ||
                 process.env.VITE_API_URL ||
                 'http://localhost:1234'

  return apiUrl
}

/**
 * Main API client instance
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  // Web uses cookies for auth, mobile doesn't
  withCredentials: isWeb
})

/**
 * Storage interface for tokens
 * Implementation will differ between web (localStorage) and mobile (AsyncStorage)
 */
export interface TokenStorage {
  getToken: () => Promise<string | null>
  setToken: (token: string) => Promise<void>
  removeToken: () => Promise<void>
}

// Token storage instance (to be set by platform-specific code)
let tokenStorage: TokenStorage | null = null

/**
 * Initialize token storage
 * Must be called before making authenticated requests
 */
export const initTokenStorage = (storage: TokenStorage) => {
  tokenStorage = storage
}

/**
 * Request interceptor
 * Adds JWT token to Authorization header for mobile
 * Web uses cookies via withCredentials
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (isMobile && tokenStorage) {
      const token = await tokenStorage.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 * Handles common errors and token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (tokenStorage) {
        await tokenStorage.removeToken()
      }
    }
    return Promise.reject(error)
  }
)

/**
 * Helper to handle API errors consistently
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      return error.response.data?.message || 'Error del servidor'
    } else if (error.request) {
      // Request made but no response
      return 'No se pudo conectar con el servidor'
    }
  }
  return 'Error inesperado'
}

export default apiClient
