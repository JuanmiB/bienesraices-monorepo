import { User } from '../models/index.js'
import { logger } from '../helpers/logger.js'
import cloudinary from '../config/cloudinary.js'

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    // Usar scope 'public' para no exponer datos sensibles en endpoint público
    const usuario = await User.scope('public').findByPk(id)

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    res.status(200).json({
      success: true,
      data: usuario
    })
  } catch (error) {
    logger.error('Error al obtener usuario', { error: error.message, userId: req.params.id })
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatarUrl', 'userType', 'verified', 'active', 'registrationDate', 'lastSession']
    })

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    logger.error('Error al obtener perfil', { error: error.message })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub)
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }

    const { firstName, lastName, phone } = req.body

    if (firstName !== undefined) user.firstName = firstName
    if (lastName !== undefined) user.lastName = lastName
    if (phone !== undefined) user.phone = phone

    await user.save()

    const updatedUser = await User.findByPk(user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatarUrl', 'userType', 'verified', 'active', 'registrationDate', 'lastSession']
    })

    res.status(200).json({ success: true, data: updatedUser })
  } catch (error) {
    logger.error('Error al actualizar perfil', { error: error.message })
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
}

export const uploadAvatar = async (req, res) => {
  try {
    // Verificar que se haya subido un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha proporcionado ninguna imagen'
      })
    }

    const user = await User.findByPk(req.user.sub)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    // Eliminar avatar anterior de Cloudinary si existe
    if (user.avatarUrl) {
      try {
        // Extraer el public_id de la URL de Cloudinary
        const publicId = user.avatarUrl.split('/').slice(-1)[0].split('.')[0]
        await cloudinary.uploader.destroy(`avatars/${publicId}`)
      } catch (error) {
        logger.warn('Error al eliminar avatar anterior', { error: error.message })
      }
    }

    // Subir nueva imagen a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(req.file.buffer)
    })

    // Actualizar usuario con nueva URL de avatar
    user.avatarUrl = result.secure_url
    await user.save()

    res.status(200).json({
      success: true,
      data: {
        avatarUrl: result.secure_url
      },
      message: 'Avatar actualizado correctamente'
    })
  } catch (error) {
    logger.error('Error al subir avatar', { error: error.message })
    res.status(500).json({
      success: false,
      message: 'Error al subir la imagen'
    })
  }
}
