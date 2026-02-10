import { Router } from 'express'
import {
  authentication,
  verifyAuth,
  cerrarSesion,
  recoverPassword,
  resetPassword,
  verifyToken,
  registrarUsuario,
  verifyEmail
} from '../../controllers/authController.js'
import {
  validateRegister,
  validateLogin,
  validateRecoverPassword,
  validateResetPassword,
  handleValidationErrors
} from '../../middleware/validation.js'
import { asyncHandler } from '../../middleware/errorHandler.js'

const authRouter = Router()

// ─── Sesión ──────────────────────────────────────────────────
authRouter.post('/login', validateLogin, handleValidationErrors, asyncHandler(authentication))
authRouter.post('/logout', asyncHandler(cerrarSesion))
authRouter.get('/verify', asyncHandler(verifyAuth))

// ─── Registro ─────────────────────────────────────────────────
authRouter.post('/register', validateRegister, handleValidationErrors, asyncHandler(registrarUsuario))

// ─── Verificación de email ────────────────────────────────────
// POST en lugar de GET — esta operación muta estado (verified, active)
authRouter.post('/email/verify', asyncHandler(verifyEmail))

// ─── Recuperación de contraseña ──────────────────────────────
authRouter.post('/password/recover', validateRecoverPassword, handleValidationErrors, asyncHandler(recoverPassword))
authRouter.get('/password/reset/:token', asyncHandler(verifyToken))
authRouter.post('/password/reset/:token', validateResetPassword, handleValidationErrors, asyncHandler(resetPassword))

export default authRouter
