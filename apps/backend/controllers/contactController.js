import { Property, User } from '../models/index.js'
import { logger } from '../helpers/logger.js'
import { transporter } from '../services/email.js'

const escapeHtml = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

export const sendContactMessage = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Nombre, email y mensaje son requeridos' })
    }

    const property = await Property.findByPk(id, {
      include: [{ model: User, as: 'owner', attributes: ['email'] }]
    })

    if (!property) {
      return res.status(404).json({ success: false, message: 'Propiedad no encontrada' })
    }

    const ownerEmail = property.owner?.email
    if (!ownerEmail) {
      return res.status(500).json({ success: false, message: 'No se encontró el propietario' })
    }

    await transporter.sendMail({
      from: '"Bienes Raíces" <no-reply@bienesraices.com>',
      to: ownerEmail,
      subject: `Mensaje sobre: ${property.title}`,
      html: `
        <h2>Mensaje de contacto</h2>
        <p><strong>De:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        ${phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>` : ''}
        <p><strong>Propiedad:</strong> ${escapeHtml(property.title)}</p>
        <hr>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `
    })

    logger.info('Mensaje de contacto enviado', { propertyId: id, ownerEmail })

    res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' })
  } catch (error) {
    logger.error('Error al enviar mensaje de contacto', { error: error.message })
    res.status(500).json({ success: false, message: 'Error al enviar el mensaje' })
  }
}
