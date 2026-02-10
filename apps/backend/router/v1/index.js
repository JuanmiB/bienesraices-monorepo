import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import propertiesRouter from './propertiesRouter.js'
import usersRouter from './usersRouter.js'
import authRouter from './authRouter.js'

const v1Router = Router()

// Rate limiting más estricto para auth
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5,
  message: { success: false, message: 'Demasiados intentos, intenta más tarde' }
})

v1Router.use('/properties', propertiesRouter)
v1Router.use('/users', usersRouter)
v1Router.use('/auth', authLimiter, authRouter)

export default v1Router
