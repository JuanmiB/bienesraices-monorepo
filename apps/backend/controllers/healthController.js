import db from '../config/db.js'

export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
}

export const dbHealthCheck = async (req, res) => {
  try {
    await db.authenticate()

    res.status(200).json({
      success: true,
      status: 'ok',
      database: {
        connected: true,
        dialect: db.options.dialect,
        host: db.options.host
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'error',
      database: {
        connected: false,
        error: error.message
      },
      timestamp: new Date().toISOString()
    })
  }
}
