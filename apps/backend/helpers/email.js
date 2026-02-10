import crypto from 'crypto'

export const generateSecureToken = () => {
  // Crear un token único para la verificación de email
  const token = crypto.randomBytes(32).toString('hex')
  const expiration = new Date(Date.now() + 1000 * 60 * 60)
  return { token, expiration }
}
