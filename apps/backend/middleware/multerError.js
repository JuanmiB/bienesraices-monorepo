export const handleMulterError = (err, req, res, next) => {
  if (err instanceof Error) {
    if (err.message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      })
    }
    if (err.message.includes('Tipo de archivo no permitido')) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }
  }
  next(err)
}
