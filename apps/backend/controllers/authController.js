import { User } from '../models/User.js'
import { generateToken } from '../helpers/recoveryPasswordToken.js'
import jwt from 'jsonwebtoken'
import { sendRecoveryEmail, sendVerificationEmail } from '../services/email.js'
import { generateSecureToken } from '../helpers/email.js'
import { logger } from '../helpers/logger.js'
import { ERROR_MESSAGES } from '@bienesraices/shared-utils/constants'
import { isValidEmail } from '@bienesraices/shared-utils/validation'

export const authentication = async (req, res) => {
  // Extraigo email y password del body
  const { email, password } = req.body

  // Validar formato de email
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: ERROR_MESSAGES.VALIDATION_ERROR })
  }

  try {
    // Buscar usuario por email usando método estático
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS })
    }
    // Verificar contraseña (si no usa Google login)
    const isPasswordValid = await user.verifyPassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS })
    }
    // Actualizar última sesión
    await user.updateLastSession()
    // Generar token y configurar cookie
    const token = generateToken(user)
    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production',
      ...(process.env.NODE_ENV === 'production' && { domain: '.bienesraices-s.onrender.com' })
    }
    res.cookie('_token', token, cookieOptions)
    // Respuesta exitosa con campos relevantes
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        type_user: user.type_user,
        verified: user.verified
      }
    })
  } catch (error) {
    logger.error('Error en el proceso de autenticación', { error: error.message, email })
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR })
  }
}
// authController.js
export const verifyAuth = async (req, res) => {
  const token = req.cookies ? req.cookies._token : null

  if (!token) {
    return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.status(200).json({ authenticated: true, user: decoded })
  } catch (error) {
    res.status(401).json({ authenticated: false, message: 'Token no válido o expirado' })
  }
}

export const cerrarSesion = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      ...(process.env.NODE_ENV === 'production' && { domain: '.bienesraices-s.onrender.com' })
    }

    res.clearCookie('_token', cookieOptions)
    return res.status(200).json({ message: 'Sesión cerrada exitosamente' })
  } catch (error) {
    logger.error('Error al cerrar sesión', { error: error.message })
    return res.status(500).json({ message: 'Error al cerrar la sesión' })
  }
}

export const recoverPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'El email es requerido' })
  }
  try {
    const usuario = await User.findByEmail(email)
    if (!usuario) {
      // Responder 200 genérico — no revelar si el email existe
      return res.status(200).json({ message: 'Se envió un email para recuperar la contraseña' })
    }
    // Generar un token seguro
    const { token: recoveryToken, expiration: tokenExpiration } = generateSecureToken()
    // Guardar el token en el usuario
    usuario.recoveryToken = recoveryToken
    usuario.recoveryTokenExpiration = tokenExpiration
    await usuario.save()
    // Enviar email de recuperación
    await sendRecoveryEmail(email, recoveryToken)
    return res.status(200).json({ message: 'Se envió un email para recuperar la contraseña' })
  } catch (error) {
    logger.error('Error al recuperar la contraseña', { error: error.message, email })
    return res.status(500).json({ message: 'Error al recuperar la contraseña' })
  }
}

export const resetPassword = async (req, res) => {
  const { password } = req.body
  const token = req.params.token
  if (!password || !token) {
    return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' })
  }
  try {
    // Buscar al usuario por el token de recuperación
    const usuario = await User.findOne({ where: { recoveryToken: token } })
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado o token inválido' })
    }
    // Verificar expiración del token
    if (!usuario.recoveryTokenExpiration || usuario.recoveryTokenExpiration < new Date()) {
      return res.status(401).json({ message: 'Token expirado' })
    }
    // Actualizar la contraseña (se hashea en el hook)
    usuario.password = password
    usuario.recoveryToken = null
    usuario.recoveryTokenExpiration = null
    await usuario.save()
    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    logger.error('Error al restablecer la contraseña', { error: error.message })
    return res.status(500).json({ message: 'Hubo un error al restablecer la contraseña' })
  }
}

export const verifyToken = async (req, res) => {
  const { token } = req.params
  if (!token) {
    return res.status(400).json({ message: 'No se proporcionó un token' })
  }
  try {
    // Buscar el token de recuperación en la base de datos
    const usuario = await User.findOne({ where: { recoveryToken: token } })
    if (!usuario) {
      return res.status(404).json({ message: 'Token de recuperación no válido o ha expirado' })
    }
    if (!usuario.recoveryTokenExpiration || usuario.recoveryTokenExpiration < new Date()) {
      return res.status(401).json({ message: 'Token no válido o ha expirado' })
    }
    return res.status(200).json({ message: 'Token válido, puede restablecer su contraseña' })
  } catch (error) {
    logger.error('Error al verificar el token', { error: error.message })
    return res.status(500).json({ message: 'Hubo un error al verificar el token' })
  }
}

export const registrarUsuario = async (req, res) => {
  const { firstname, lastName, email, password, phone, usertype } = req.body

  // Validar los campos requeridos
  if (!firstname || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nombre, email y contraseña son obligatorios'
    })
  }

  try {
    // Verificar si el usuario ya está registrado
    const usuarioExistente = await User.findOne({ where: { email } })
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      })
    }

    // Crear token de email de verificacion

    // Crear el nuevo usuario
    const nuevoUsuario = await User.create({
      firstName: firstname,
      lastName: lastName || null,
      email,
      password, // Se hashea automáticamente en el hook beforeCreate
      phone: phone || null,
      userType: usertype || 'buyer',
      verified: false,
      active: false
    })

    const { token: verificationToken, expiration: verificationTokenExpiration } = generateSecureToken()

    nuevoUsuario.verificationToken = verificationToken
    nuevoUsuario.verificationTokenExpiration = verificationTokenExpiration

    await nuevoUsuario.save()
    // Log de auditoría
    logger.info('Nuevo usuario registrado', { email: nuevoUsuario.email, userId: nuevoUsuario.id })

    // Enviar email de verificación
    await sendVerificationEmail(nuevoUsuario.email, verificationToken)
    logger.info('Email de verificación enviado', { email: nuevoUsuario.email })

    // Respuesta exitosa (sin incluir el password)
    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: nuevoUsuario.id,
        firstName: nuevoUsuario.firstName,
        lastName: nuevoUsuario.lastName,
        email: nuevoUsuario.email,
        userType: nuevoUsuario.userType,
        verified: nuevoUsuario.verified
      }
    })
  } catch (error) {
    logger.error('Error al registrar usuario', { error: error.message, email })

    // Manejo de errores específicos de validación
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.errors.map(e => ({
          campo: e.path,
          mensaje: e.message
        }))
      })
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Error al registrar el usuario. Intenta de nuevo más tarde.'
    })
  }
}

export const verifyEmail = async (req, res) => {
  const { token } = req.body
  logger.debug('Verificando email de usuario', { token })

  try {
    const usuario = await User.findOne({
      where: { verificationToken: token }
    })

    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido'
      })
    }

    if (usuario.verificationTokenExpiration < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Token expirado'
      })
    }

    usuario.verified = true
    usuario.active = true
    usuario.verificationToken = null
    usuario.verificationTokenExpiration = null
    await usuario.save()

    return res.json({
      success: true,
      message: 'Cuenta verificada correctamente'
    })
  } catch (error) {
    logger.error('Error al verificar email', { error: error.message, token })
    return res.status(500).json({ message: 'Error interno' })
  }
}
