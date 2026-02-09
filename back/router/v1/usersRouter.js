import { Router } from 'express'
import { getUserById, getMe, updateMe, uploadAvatar } from '../../controllers/usersController.js'
import {
  getMyProperties,
  createProperty,
  getMyProperty,
  updateProperty,
  deleteProperty,
  togglePropertyActive,
  addImages,
  deleteImage,
  setImagePrimary,
  reorderImages
} from '../../controllers/propertiesController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { validateCreatePropiedad, validatePropertyId, handleValidationErrors, validateUserId } from '../../middleware/validation.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { handleMulterError } from '../../middleware/multerError.js'
import upload from '../../config/multer.js'

const usersRouter = Router()

// ─── Rutas /me/* primero — Express matchea por orden ─────────
// Si /:id va antes, "me" queda atrapado como un valor de :id

// GET    /api/v1/users/me
usersRouter.get('/me', authMiddleware, asyncHandler(getMe))

// PUT    /api/v1/users/me
usersRouter.put('/me', authMiddleware, asyncHandler(updateMe))

// POST   /api/v1/users/me/avatar
usersRouter.post(
  '/me/avatar',
  authMiddleware,
  upload.single('avatar'),
  handleMulterError,
  asyncHandler(uploadAvatar)
)

// GET    /api/v1/users/me/properties
usersRouter.get('/me/properties', authMiddleware, asyncHandler(getMyProperties))

// POST   /api/v1/users/me/properties
usersRouter.post(
  '/me/properties',
  authMiddleware,
  upload.array('imagenes', 8),
  handleMulterError,
  validateCreatePropiedad,
  handleValidationErrors,
  asyncHandler(createProperty)
)

// ─── Rutas de imágenes individuales ──────────────────────────
// POST   /api/v1/users/me/properties/:id/images
usersRouter.post(
  '/me/properties/:id/images',
  authMiddleware,
  validatePropertyId,
  handleValidationErrors,
  upload.array('imagenes', 8),
  handleMulterError,
  asyncHandler(addImages)
)

// PUT    /api/v1/users/me/properties/:id/images/reorder   ← antes de :imageId para que no confunda
usersRouter.put(
  '/me/properties/:id/images/reorder',
  authMiddleware,
  validatePropertyId,
  handleValidationErrors,
  asyncHandler(reorderImages)
)

// PUT    /api/v1/users/me/properties/:id/images/:imageId/primary
usersRouter.put(
  '/me/properties/:id/images/:imageId/primary',
  authMiddleware,
  validatePropertyId,
  handleValidationErrors,
  asyncHandler(setImagePrimary)
)

// DELETE /api/v1/users/me/properties/:id/images/:imageId
usersRouter.delete(
  '/me/properties/:id/images/:imageId',
  authMiddleware,
  validatePropertyId,
  handleValidationErrors,
  asyncHandler(deleteImage)
)

// GET    /api/v1/users/me/properties/:id
usersRouter.get('/me/properties/:id', authMiddleware, validatePropertyId, handleValidationErrors, asyncHandler(getMyProperty))

// PUT    /api/v1/users/me/properties/:id
usersRouter.put(
  '/me/properties/:id',
  authMiddleware,
  validatePropertyId,
  handleValidationErrors,
  upload.single('imagen'),
  handleMulterError,
  asyncHandler(updateProperty)
)

// DELETE /api/v1/users/me/properties/:id
usersRouter.delete('/me/properties/:id', authMiddleware, validatePropertyId, handleValidationErrors, asyncHandler(deleteProperty))

// PATCH  /api/v1/users/me/properties/:id   →  body: { active: true/false }
usersRouter.patch('/me/properties/:id', authMiddleware, validatePropertyId, handleValidationErrors, asyncHandler(togglePropertyActive))

// ─── Endpoint público ─────────────────────────────────────
// GET    /api/v1/users/:id
usersRouter.get('/:id', validateUserId, handleValidationErrors, asyncHandler(getUserById))

export default usersRouter
