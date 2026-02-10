import { Router } from 'express'
import { healthCheck, dbHealthCheck } from '../controllers/healthController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const healthRouter = Router()

healthRouter.get('/', healthCheck)
healthRouter.get('/db', authMiddleware, asyncHandler(dbHealthCheck))

export default healthRouter
