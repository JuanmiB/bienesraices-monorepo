import { Router } from 'express'
import {
  getPropertyTypes,
  listProperties,
  getPropertyById
} from '../../controllers/propertiesController.js'
import { sendContactMessage } from '../../controllers/contactController.js'
import { validatePropertyId, handleValidationErrors } from '../../middleware/validation.js'
import { asyncHandler } from '../../middleware/errorHandler.js'

const propertiesRouter = Router()

// Metadata del recurso
propertiesRouter.get('/types', getPropertyTypes)

// Listado con paginación + filtros vía query params
// GET /api/v1/properties?page=1&limit=10&q=casa&propertyType=house&operationType=sale&minPrice=100&maxPrice=500000&city=Buenos+Aires&state=CABA&featured=true
propertiesRouter.get('/', asyncHandler(listProperties))

// Detalle por ID
propertiesRouter.get('/:id', validatePropertyId, handleValidationErrors, asyncHandler(getPropertyById))

// Contacto con el propietario
propertiesRouter.post('/:id/contact', validatePropertyId, handleValidationErrors, asyncHandler(sendContactMessage))

export default propertiesRouter
