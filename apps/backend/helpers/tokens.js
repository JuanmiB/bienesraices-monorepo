import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const secret = process.env.JWT_SECRET

// Generar un JWT seguro
export function generateToken (user) {
  if (!secret) {
    throw new Error('Falta la clave secreta JWT_SECRET en las variables de entorno.')
  }
  // payload con datos del user (usar firstName o email si no hay nombre)
  const payload = {
    sub: user.id,
    name: user.firstName || user.first_name || user.email,
    avatarUrl: user.avatarUrl || null,
    foto: user.avatarUrl || null // Alias para compatibilidad
  }
  // Configuracion del token
  const options = {
    algorithm: 'HS256',
    expiresIn: '1h'
  }
  // Generar el token
  const token = jwt.sign(payload, secret, options)
  return token
}

export const generateSecureToken = () => {
  // Generador genérico de token aleatorio + expiración (1h).
  // Se usa tanto para el reset de password como para la verificación de cuenta.
  const token = crypto.randomBytes(32).toString('hex')
  const expiration = new Date(Date.now() + 1000 * 60 * 60)
  return { token, expiration }
}
