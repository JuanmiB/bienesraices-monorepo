import express, { urlencoded, json } from 'express'
import passport from './config/passport.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import db from './config/db.js'
import healthRouter from './router/healthRouter.js'
import v1Router from './router/v1/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { logger } from './helpers/logger.js'

const app = express()

// Seguridad: Headers
app.use(helmet())

// Logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// Body parsing
app.use(json())
app.disable('x-powered-by')

// Body parsing con limite
app.use(urlencoded({ extended: true, limit: '10mb' }))

// CORS configurado
// Normalizar FRONTEND_URL para evitar discrepancias por una barra final
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '')
const corsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (health checks, curl, Postman, etc.)
    if (!origin) {
      return callback(null, true)
    }

    // Permitir peticiones desde el frontend configurado
    if (origin.replace(/\/+$/, '') === frontendUrl) {
      return callback(null, true)
    }

    return callback(new Error('CORS no permitido'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

// Rate Limiting para proteger contra ataques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana
  message: 'Demasiadas solicitudes, intenta más tarde'
})
app.use(limiter)

// Passport
app.use(passport.initialize())

// Cookies
app.use(cookieParser())

// Conexión BD
try {
  await db.authenticate()
  await db.sync()
  logger.info('Conexión a base de datos exitosa')
} catch (error) {
  logger.error('Error en la conexión a la base de datos', { error: error.message })
  process.exit(1)
}

// Health & API v1
app.use('/api/health', healthRouter)
app.use('/api/v1', v1Router)

// 404 — debe estar después de todas las rutas
app.use(notFoundHandler)

// Error Handler (siempre al final)
app.use(errorHandler)

const PORT = process.env.PORT || 1234
app.listen(PORT, () => {
  logger.info('✅ Servidor iniciado', { url: `http://localhost:${PORT}` })
})
