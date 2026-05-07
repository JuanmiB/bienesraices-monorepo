import { useState } from 'react'
import PropTypes from 'prop-types'
import { sendLeadToWebhook, validateEmail, validatePhone } from '@shared/services/webhookService'

const ContactForm = ({ origen = 'Landing Page Comercial', onSuccess, onError }) => {
  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    zona_interes: '',
    mensaje: ''
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  /**
   * Validates form data
   * @returns {Object} Validation result with isValid and errors
   */
  const validateForm = () => {
    const errors = {}

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Email inválido'
    }

    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es requerido'
    } else if (!validatePhone(formData.telefono)) {
      errors.telefono = 'Teléfono inválido (mínimo 8 dígitos)'
    }

    if (!formData.mensaje.trim()) {
      errors.mensaje = 'El mensaje es requerido'
    } else if (formData.mensaje.trim().length < 10) {
      errors.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate form
    const validation = validateForm()
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0]
      setError(firstError)
      return
    }

    setLoading(true)

    try {
      // Construct payload according to specified structure
      const payload = {
        cliente: {
          nombre: formData.nombre.trim(),
          email: formData.email.trim().toLowerCase(),
          telefono: formData.telefono.trim()
        },
        consulta: {
          origen,
          zona_interes: formData.zona_interes.trim(),
          mensaje_crudo: formData.mensaje.trim()
        }
      }

      // Send to webhook
      const response = await sendLeadToWebhook(payload)

      // Success handling
      setIsSuccess(true)

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          zona_interes: '',
          mensaje: ''
        })
        setIsSuccess(false)
      }, 3000)

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response)
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al enviar el formulario. Intenta nuevamente.'
      setError(errorMessage)

      // Call error callback if provided
      if (onError) {
        onError(err)
      }

      console.error('Contact form error:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles input changes
   * @param {string} field - Field name
   * @returns {Function} Change handler
   */
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }))

    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contáctanos</h2>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              ¡Mensaje Enviado!
            </h3>
            <p className="text-sm text-gray-600">
              Nos pondremos en contacto contigo pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            <div className="min-h-[24px]">
              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange('nombre')}
                disabled={loading}
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange('email')}
                disabled={loading}
                placeholder="juan@ejemplo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                value={formData.telefono}
                onChange={handleChange('telefono')}
                disabled={loading}
                placeholder="+52 123 456 7890"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Zona de Interés */}
            <div>
              <label htmlFor="zona_interes" className="block text-sm font-medium text-gray-700 mb-2">
                Zona de Interés
              </label>
              <input
                type="text"
                id="zona_interes"
                value={formData.zona_interes}
                onChange={handleChange('zona_interes')}
                disabled={loading}
                placeholder="Ej: Polanco, Condesa, Santa Fe..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                id="mensaje"
                value={formData.mensaje}
                onChange={handleChange('mensaje')}
                disabled={loading}
                placeholder="Cuéntanos qué tipo de propiedad estás buscando..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Enviando...
                </>
              ) : (
                'Enviar Mensaje'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

ContactForm.propTypes = {
  origen: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func
}

export default ContactForm
