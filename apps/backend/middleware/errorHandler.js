// Captura rutas que no matchearon ningún router
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    details: {
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  })
}

// Middleware centralizado para manejo de errores
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Error interno del servidor'

  console.error(`[ERROR ${status}] ${req.method} ${req.path}:`, message)

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack)
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
}

// Envolver rutas asincrónicas para capturar errores
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
