import axios from 'axios'

// ============================================
// CONFIGURATION CONSTANTS
// ============================================
export const WEBHOOK_CONFIG = {
  url: 'https://your-webhook-endpoint.com/api/leads',
  authToken: 'YOUR_SECRET_TOKEN',
  timeout: 10000 // 10 seconds
}

/**
 * Sends a lead/contact form submission to the external webhook
 * @param {Object} payload - The payload to send
 * @param {Object} payload.cliente - Client information
 * @param {string} payload.cliente.nombre - Client name
 * @param {string} payload.cliente.email - Client email
 * @param {string} payload.cliente.telefono - Client phone
 * @param {Object} payload.consulta - Query information
 * @param {string} payload.consulta.origen - Origin of the query
 * @param {string} payload.consulta.zona_interes - Zone of interest
 * @param {string} payload.consulta.mensaje_crudo - Raw message
 * @returns {Promise<Object>} Response from the webhook
 * @throws {Error} If the request fails
 */
export const sendLeadToWebhook = async (payload) => {
  try {
    // Validate payload structure
    if (!payload.cliente || !payload.consulta) {
      throw new Error('Invalid payload structure: cliente and consulta are required')
    }

    // Construct the complete payload with security token
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

    // Send POST request to webhook
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
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      throw new Error(
        `Webhook error: ${error.response.status} - ${
          error.response.data?.message || 'Server error'
        }`
      )
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No se pudo conectar con el servidor. Intenta nuevamente.')
    } else {
      // Error in request setup
      throw new Error(error.message || 'Error al enviar la solicitud')
    }
  }
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates phone number (basic validation)
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
export const validatePhone = (phone) => {
  // Accepts formats: +1234567890, 123-456-7890, (123) 456-7890, etc.
  const phoneRegex = /^[\d\s\-+()]+$/
  return phone.length >= 8 && phoneRegex.test(phone)
}
