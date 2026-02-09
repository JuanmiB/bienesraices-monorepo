import multer from 'multer'

const storage = multer.memoryStorage() // Almacena la imagen en memoria temporalmente

// Validación de archivos
const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true) // Aceptar archivo
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, WebP, GIF)'), false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter
})

export default upload
