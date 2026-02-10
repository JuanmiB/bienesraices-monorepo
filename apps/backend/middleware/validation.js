import { body, param, query, validationResult } from 'express-validator'

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(err => ({
        campo: err.param,
        mensaje: err.msg
      }))
    })
  }
  next()
}

// Validaciones para Autenticación
export const validateRegister = [
  body('firstname')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número')
]

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
]

export const validateRecoverPassword = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
]

export const validateResetPassword = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número')
]

// Validaciones para Propiedades
export const validateCreatePropiedad = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 5, max: 255 })
    .withMessage('El título debe tener entre 5 y 255 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('propertyType')
    .notEmpty()
    .withMessage('El tipo de propiedad es requerido')
    .isIn(['house', 'apartment', 'land', 'commercial', 'office', 'warehouse'])
    .withMessage('Tipo de propiedad inválido'),
  body('operationType')
    .notEmpty()
    .withMessage('El tipo de operación es requerido')
    .isIn(['sale', 'rent', 'temporary'])
    .withMessage('Tipo de operación inválido'),
  body('price')
    .notEmpty()
    .withMessage('El precio es requerido')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('currency')
    .optional()
    .isIn(['USD', 'ARS', 'EUR'])
    .withMessage('Moneda inválida'),
  body('totalArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El área total debe ser un número positivo'),
  body('coveredArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El área cubierta debe ser un número positivo'),
  body('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Los dormitorios deben ser un número no negativo'),
  body('bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Los baños deben ser un número no negativo'),
  body('garages')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Los garages deben ser un número no negativo'),
  body('age')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La antigüedad debe ser un número no negativo'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La dirección es demasiado larga'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La ciudad es demasiado larga'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La provincia/estado es demasiado largo'),
  body('postalCode')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El código postal es demasiado largo'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El país es demasiado largo'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitud inválida'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitud inválida'),
  body('status')
    .optional()
    .isIn(['available', 'reserved', 'sold', 'rented'])
    .withMessage('Estado inválido'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured debe ser booleano')
]

// Validaciones para parámetros
export const validatePropertyId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de propiedad inválido')
]

export const validateUserId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido')
]

// Mantener validateUUID para otros casos si se necesita
export const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('ID inválido')
]

export const validateCategoryId = [
  param('id')
    .isInt()
    .withMessage('ID de categoría inválido')
]

export const validateSearchQuery = [
  query('query')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('La búsqueda debe tener entre 1 y 100 caracteres'),
  query('category')
    .optional()
    .trim()
]
