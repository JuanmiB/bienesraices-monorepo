/**
 * @bienesraices/shared-logic
 * Platform-agnostic business logic and state management for web and mobile
 */

// Export stores
export { useAuthStore } from './auth/authStore'
export { usePropertyStore } from './property/propertyStore'
export { useFavoritesStore } from './property/favoritesStore'

// Export hooks
export { useFormState } from './forms/useFormState'
export type { UseFormStateReturn, FormValues } from './forms/useFormState'

// Export types
export type { PropertyFilters } from './property/propertyStore'
