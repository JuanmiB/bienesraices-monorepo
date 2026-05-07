import axios from 'axios'

/**
 * Webhook Service
 * Handles external webhook integrations for contact forms
 */

export const WEBHOOK_CONFIG = {
  url: 'https://your-webhook-endpoint.com/api/leads',
  authToken: 'YOUR_SECRET_TOKEN',
  timeout: 10000
}

export interface LeadPayload {
  cliente: {
    nombre: string
    email: string
    telefono: string
  }
  consulta: {
    origen?: string
    zona_interes?: string
    mensaje_crudo: string
  }
}

/**
 * Sends a lead/contact form submission to external webhook
 */
export const sendLeadToWebhook = async (payload: LeadPayload) => {
  try {
    if (!payload.cliente || !payload.consulta) {
      throw new Error('Invalid payload structure: cliente and consulta are required')
    }

    const fullPayload = {
      cliente: {
        nombre: payload.cliente.nombre || '',
        email: payload.cliente.email || '',
        telefono: payload.cliente.telefono || ''
      },
      consulta: {
        origen: payload.consulta.origen || 'Landing Page Comercial',
        zona_interes: payload.consulta.zona_interes || '',
        mensaje_crudo: payload.consulta.mensaje_crudo || ''
      },
      seguridad: {
        token_auth: WEBHOOK_CONFIG.authToken
      }
    }

    const response = await axios.post(WEBHOOK_CONFIG.url, fullPayload, {
      timeout: WEBHOOK_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return {
      success: true,
      data: response.data,
      status: response.status
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Webhook error: ${error.response.status} - ${
          error.response.data?.message || 'Server error'
        }`
      )
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor. Intenta nuevamente.')
    } else {
      throw new Error(error.message || 'Error al enviar la solicitud')
    }
  }
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates phone number (basic validation)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]+$/
  return phone.length >= 8 && phoneRegex.test(phone)
}

export const webhookService = {
  sendLead: sendLeadToWebhook,
  validateEmail,
  validatePhone
}

export default webhookService
