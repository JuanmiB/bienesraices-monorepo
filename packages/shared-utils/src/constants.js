/**
 * Versión de la API
 */
export const API_VERSION = 'v1';

/**
 * Estados de una propiedad
 */
export const PROPERTY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SOLD: 'sold',
  ARCHIVED: 'archived',
};

/**
 * Roles de usuario
 */
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

/**
 * Configuración de paginación
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * Mensajes de error estándar
 */
export const ERROR_MESSAGES = {
  // Auth
  UNAUTHORIZED: 'No autorizado',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  USER_EXISTS: 'El usuario ya existe',
  EMAIL_NOT_CONFIRMED: 'Debes confirmar tu email primero',
  INVALID_TOKEN: 'Token inválido o expirado',

  // General
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error del servidor',
  VALIDATION_ERROR: 'Error de validación',

  // Property
  PROPERTY_NOT_FOUND: 'Propiedad no encontrada',
  PROPERTY_ALREADY_PUBLISHED: 'La propiedad ya está publicada',
  NOT_PROPERTY_OWNER: 'No eres el propietario de esta propiedad',

  // File upload
  FILE_TOO_LARGE: 'El archivo es demasiado grande',
  INVALID_FILE_TYPE: 'Tipo de archivo no válido',
};

/**
 * Códigos de error
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
};

/**
 * Límites de archivos
 */
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

/**
 * Configuración de JWT
 */
export const JWT_CONFIG = {
  EXPIRES_IN: '30d',
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 días en ms
};
