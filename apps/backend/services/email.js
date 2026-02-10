import nodemailer from 'nodemailer'
import { logger } from '../helpers/logger.js'

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  pool: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Envio de email de recuperación de contraseña
export const sendRecoveryEmail = async (email, recoveryToken) => {
  const info = await transporter.sendMail({
    from: '"Bienes Raíces" <no-reply@bienesraices.com>',
    to: email,
    subject: 'Recuperá tu cuenta en BienesRaíces',
    html: `
      <div>
        <h1>Hola</h1>
        <p>Hacé clic en el siguiente enlace para recuperar tu contraseña:</p>
        <a href="${process.env.FRONTEND_URL}/auth/reset-password/${recoveryToken}">
          Recuperar contraseña
        </a>
        <p>Si no solicitaste este cambio, ignorá este correo.</p>
      </div>
    `
  })

  logger.info('Email de recuperación enviado', { email, messageId: info.messageId })
}
// Envio de email de verificación
export const sendVerificationEmail = async (email, token) => {
  const link = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`

  await transporter.sendMail({
    from: '"Bienes Raíces" <no-reply@bienesraices.com>',
    to: email,
    subject: 'Confirmá tu cuenta',
    html: `
      <h2>Confirmación de cuenta</h2>
      <p>Hacé clic para activar tu cuenta:</p>
      <a href="${link}">Confirmar cuenta</a>
    `
  })
}
