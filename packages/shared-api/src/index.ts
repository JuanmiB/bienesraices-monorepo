/**
 * @bienesraices/shared-api
 * Platform-agnostic API client and services for web and mobile
 */

// Export API client
export { apiClient, initTokenStorage, handleApiError } from './client/apiClient'
export type { TokenStorage } from './client/apiClient'

// Export services
export { authService } from './services/authService'
export { propertyService } from './services/propertyService'
export { userService } from './services/userService'
export { webhookService, sendLeadToWebhook, validateEmail, validatePhone, WEBHOOK_CONFIG } from './services/webhookService'

// Export types
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  VerifyResponse
} from './services/authService'

export type {
  PropertySearchParams,
  Property,
  PropertyImage,
  PropertyOwner,
  PropertySearchResponse,
  PropertyTypesResponse,
  ContactPropertyData
} from './services/propertyService'

export type {
  User,
  UpdateUserData
} from './services/userService'

export type {
  LeadPayload
} from './services/webhookService'
