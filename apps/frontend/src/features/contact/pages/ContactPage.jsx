import { ContactForm } from '@features/contact/components'

const ContactPage = () => {
  /**
   * Success callback - called when form is submitted successfully
   * @param {Object} response - Response from webhook
   */
  const handleSuccess = (response) => {
    console.log('Lead submitted successfully:', response)
    // You can add analytics tracking here
    // Example: gtag('event', 'lead_submitted', { ... })
  }

  /**
   * Error callback - called when form submission fails
   * @param {Error} error - Error object
   */
  const handleError = (error) => {
    console.error('Lead submission failed:', error)
    // You can add error tracking here
    // Example: Sentry.captureException(error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-gray-600">
            ¿Buscas la propiedad perfecta? Déjanos tus datos y nos pondremos en contacto contigo.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm
          origen="Landing Page Comercial"
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {/* Additional Info */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <p className="text-sm text-gray-600">info@bienesraices.com</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
            <p className="text-sm text-gray-600">+52 55 1234 5678</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Horario</h3>
            <p className="text-sm text-gray-600">Lun - Vie: 9:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
