import React, { PropsWithChildren, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initTokenStorage } from '@bienesraices/shared-api'
import { useAuthStore } from '@bienesraices/shared-logic'

/**
 * Main App Provider
 * Initializes token storage and auth state
 */
export function AppProvider({ children }: PropsWithChildren) {
  const { loadStoredAuth } = useAuthStore()

  useEffect(() => {
    // Initialize API client with AsyncStorage for token management
    initTokenStorage({
      getToken: async () => {
        return await AsyncStorage.getItem('auth_token')
      },
      setToken: async (token: string) => {
        await AsyncStorage.setItem('auth_token', token)
      },
      removeToken: async () => {
        await AsyncStorage.removeItem('auth_token')
      }
    })

    // Load stored auth state on app start
    loadStoredAuth?.()
  }, [])

  return <>{children}</>
}

export default AppProvider
