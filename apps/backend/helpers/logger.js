// Logger estructurado con niveles
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
}

const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString()
  return `[${timestamp}] [${level}] ${message} ${Object.keys(data).length > 0 ? JSON.stringify(data) : ''}`
}

export const logger = {
  error: (message, data) => console.error(formatLog(LOG_LEVELS.ERROR, message, data)),
  warn: (message, data) => console.warn(formatLog(LOG_LEVELS.WARN, message, data)),
  info: (message, data) => console.log(formatLog(LOG_LEVELS.INFO, message, data)),
  debug: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, data))
    }
  }
}
