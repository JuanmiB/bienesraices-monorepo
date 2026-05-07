# 💡 Webhook Integration - Code Examples

Practical examples for different use cases.

## 📝 Table of Contents

1. [Basic Form Usage](#basic-form-usage)
2. [Programmatic API Calls](#programmatic-api-calls)
3. [Custom Forms](#custom-forms)
4. [Integration Patterns](#integration-patterns)
5. [Advanced Scenarios](#advanced-scenarios)

---

## Basic Form Usage

### Example 1: Simple Contact Page

```javascript
import { ContactForm } from '@features/contact/components'

function ContactPage() {
  return (
    <div className="container mx-auto py-12">
      <ContactForm origen="Contact Page" />
    </div>
  )
}

export default ContactPage
```

### Example 2: With Success/Error Callbacks

```javascript
import { ContactForm } from '@features/contact/components'
import { useState } from 'react'

function ContactPage() {
  const [submitCount, setSubmitCount] = useState(0)

  const handleSuccess = (response) => {
    console.log('Form submitted successfully!', response)
    setSubmitCount(prev => prev + 1)

    // Optional: Show toast notification
    // toast.success('¡Mensaje enviado exitosamente!')
  }

  const handleError = (error) => {
    console.error('Form submission failed:', error)

    // Optional: Show error notification
    // toast.error(error.message)
  }

  return (
    <div className="container mx-auto py-12">
      <ContactForm
        origen="Contact Page"
        onSuccess={handleSuccess}
        onError={handleError}
      />

      {submitCount > 0 && (
        <p className="text-center mt-4 text-sm text-gray-500">
          Formularios enviados: {submitCount}
        </p>
      )}
    </div>
  )
}
```

---

## Programmatic API Calls

### Example 3: Send Lead Without Form

```javascript
import { sendLeadToWebhook } from '@shared/services'

async function sendQuickLead() {
  const payload = {
    cliente: {
      nombre: 'María García',
      email: 'maria@ejemplo.com',
      telefono: '+52 555 123 4567'
    },
    consulta: {
      origen: 'API Direct',
      zona_interes: 'Roma Norte',
      mensaje_crudo: 'Interesada en departamentos de lujo'
    }
  }

  try {
    const response = await sendLeadToWebhook(payload)
    console.log('Lead sent successfully:', response)
    return response
  } catch (error) {
    console.error('Failed to send lead:', error)
    throw error
  }
}
```

### Example 4: Batch Lead Submission

```javascript
import { sendLeadToWebhook } from '@shared/services'

async function sendMultipleLeads(leads) {
  const results = []

  for (const lead of leads) {
    try {
      const response = await sendLeadToWebhook({
        cliente: lead.cliente,
        consulta: {
          origen: 'Batch Import',
          zona_interes: lead.zona_interes,
          mensaje_crudo: lead.mensaje
        }
      })

      results.push({ success: true, data: response })

      // Wait 1 second between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      results.push({ success: false, error: error.message })
    }
  }

  return results
}

// Usage
const leads = [
  {
    cliente: { nombre: 'Juan', email: 'juan@test.com', telefono: '123456789' },
    zona_interes: 'Polanco',
    mensaje: 'Busco casa'
  },
  // ... more leads
]

sendMultipleLeads(leads).then(results => {
  console.log('Results:', results)
})
```

---

## Custom Forms

### Example 5: Minimal Quick Contact Form

```javascript
import { useState } from 'react'
import { sendLeadToWebhook, validateEmail } from '@shared/services'

function QuickContactForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setMessage('Email inválido')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await sendLeadToWebhook({
        cliente: {
          nombre: 'Lead Rápido',
          email: email,
          telefono: 'N/A'
        },
        consulta: {
          origen: 'Quick Subscribe',
          zona_interes: '',
          mensaje_crudo: 'Suscripción rápida a newsletter'
        }
      })

      setMessage('¡Gracias! Te contactaremos pronto.')
      setEmail('')
    } catch (error) {
      setMessage('Error. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        className="flex-1 px-4 py-2 border rounded"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Enviando...' : 'Suscribirse'}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  )
}
```

### Example 6: Property Inquiry Form

```javascript
import { useState } from 'react'
import { sendLeadToWebhook } from '@shared/services'
import PropTypes from 'prop-types'

function PropertyInquiryForm({ property }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await sendLeadToWebhook({
        cliente: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
        },
        consulta: {
          origen: `Propiedad ${property.id}`,
          zona_interes: property.location,
          mensaje_crudo: `Interesado en ${property.title}. Mensaje: ${formData.mensaje}`
        }
      })

      setStatus('success')
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
        setStatus('idle')
      }, 3000)
    } catch (error) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-semibold">
          ¡Consulta enviada! El vendedor te contactará pronto.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-lg">Consultar sobre esta propiedad</h3>

      <input
        type="text"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded"
      />

      <input
        type="tel"
        placeholder="Teléfono"
        value={formData.telefono}
        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded"
      />

      <textarea
        placeholder="¿Cuándo te gustaría agendar una visita?"
        value={formData.mensaje}
        onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
        rows={3}
        className="w-full px-4 py-2 border rounded"
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar Consulta'}
      </button>

      {status === 'error' && (
        <p className="text-red-600 text-sm">
          Error al enviar. Intenta nuevamente.
        </p>
      )}
    </form>
  )
}

PropertyInquiryForm.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string
  }).isRequired
}

export default PropertyInquiryForm
```

---

## Integration Patterns

### Example 7: Newsletter Signup with Webhook

```javascript
import { useState } from 'react'
import { sendLeadToWebhook, validateEmail } from '@shared/services'

function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      alert('Email inválido')
      return
    }

    setLoading(true)

    try {
      await sendLeadToWebhook({
        cliente: {
          nombre: 'Newsletter Subscriber',
          email: email,
          telefono: 'N/A'
        },
        consulta: {
          origen: 'Newsletter',
          zona_interes: interests.join(', '),
          mensaje_crudo: `Suscripción a newsletter. Intereses: ${interests.join(', ')}`
        }
      })

      setResult('success')
      setEmail('')
      setInterests([])
    } catch (error) {
      setResult('error')
    } finally {
      setLoading(false)
    }
  }

  const toggleInterest = (interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">
        Suscríbete a nuestro newsletter
      </h3>

      {result === 'success' ? (
        <div className="text-green-600">
          ¡Gracias por suscribirte!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-2 border rounded"
            required
          />

          <div>
            <p className="text-sm font-medium mb-2">Intereses:</p>
            <div className="space-x-2">
              {['Casas', 'Departamentos', 'Terrenos', 'Locales'].map(interest => (
                <label key={interest} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                    className="mr-1"
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700"
          >
            {loading ? 'Enviando...' : 'Suscribirse'}
          </button>

          {result === 'error' && (
            <p className="text-red-600 text-sm">Error. Intenta nuevamente.</p>
          )}
        </form>
      )}
    </div>
  )
}
```

### Example 8: Button Click Lead Capture

```javascript
import { sendLeadToWebhook } from '@shared/services'

function DownloadBrochureButton({ property }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)

    try {
      // Capture lead before download
      await sendLeadToWebhook({
        cliente: {
          nombre: 'Brochure Download',
          email: 'anonymous@download.com',
          telefono: 'N/A'
        },
        consulta: {
          origen: 'Brochure Download',
          zona_interes: property.location,
          mensaje_crudo: `Downloaded brochure for property ${property.id}`
        }
      })

      // Then trigger download
      window.open(property.brochureUrl, '_blank')
    } catch (error) {
      console.error('Failed to track download:', error)
      // Still allow download even if tracking fails
      window.open(property.brochureUrl, '_blank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
    >
      {loading ? 'Preparando...' : 'Descargar Brochure'}
    </button>
  )
}
```

---

## Advanced Scenarios

### Example 9: Multi-Step Form with Webhook

```javascript
import { useState } from 'react'
import { sendLeadToWebhook } from '@shared/services'

function MultiStepContactForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1
    propertyType: '',
    budget: '',
    // Step 2
    nombre: '',
    email: '',
    telefono: '',
    // Step 3
    zona_interes: '',
    mensaje: ''
  })

  const handleSubmit = async () => {
    try {
      await sendLeadToWebhook({
        cliente: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
        },
        consulta: {
          origen: 'Multi-Step Form',
          zona_interes: formData.zona_interes,
          mensaje_crudo: `Tipo: ${formData.propertyType}, Presupuesto: ${formData.budget}, Mensaje: ${formData.mensaje}`
        }
      })

      setStep(4) // Success step
    } catch (error) {
      alert('Error al enviar formulario')
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3>Paso 1: ¿Qué buscas?</h3>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Selecciona...</option>
              <option value="casa">Casa</option>
              <option value="depto">Departamento</option>
              <option value="terreno">Terreno</option>
            </select>

            <input
              type="text"
              placeholder="Presupuesto (ej: $2,000,000)"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />

            <button
              onClick={() => setStep(2)}
              disabled={!formData.propertyType || !formData.budget}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Siguiente
            </button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3>Paso 2: Tus datos</h3>
            {/* Contact fields */}
            <input
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            {/* More fields... */}

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.nombre || !formData.email}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Siguiente
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3>Paso 3: Detalles adicionales</h3>
            {/* Additional fields */}

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Atrás
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Enviar
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center">
            <h3 className="text-green-600 font-bold text-xl">
              ¡Gracias!
            </h3>
            <p>Nos pondremos en contacto pronto.</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`w-1/3 h-2 rounded ${
                s <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {renderStep()}
    </div>
  )
}
```

### Example 10: Validation Before Webhook

```javascript
import { sendLeadToWebhook, validateEmail, validatePhone } from '@shared/services'

async function submitWithValidation(formData) {
  // Custom validations
  const errors = []

  if (!formData.nombre || formData.nombre.length < 2) {
    errors.push('Nombre debe tener al menos 2 caracteres')
  }

  if (!validateEmail(formData.email)) {
    errors.push('Email inválido')
  }

  if (!validatePhone(formData.telefono)) {
    errors.push('Teléfono inválido')
  }

  if (formData.mensaje.length < 10) {
    errors.push('Mensaje muy corto (mínimo 10 caracteres)')
  }

  // Check for spam keywords
  const spamKeywords = ['viagra', 'casino', 'lottery']
  const hasSpam = spamKeywords.some(keyword =>
    formData.mensaje.toLowerCase().includes(keyword)
  )

  if (hasSpam) {
    errors.push('Mensaje contiene contenido no permitido')
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '))
  }

  // All validations passed, send to webhook
  return await sendLeadToWebhook({
    cliente: {
      nombre: formData.nombre.trim(),
      email: formData.email.trim().toLowerCase(),
      telefono: formData.telefono.trim()
    },
    consulta: {
      origen: formData.origen || 'Contact Form',
      zona_interes: formData.zona_interes,
      mensaje_crudo: formData.mensaje.trim()
    }
  })
}

// Usage
try {
  await submitWithValidation(formData)
  console.log('Success!')
} catch (error) {
  console.error('Validation failed:', error.message)
}
```

---

## 🎓 Best Practices

1. **Always validate before submission**
2. **Provide user feedback** (loading states, success/error messages)
3. **Clear sensitive data** after successful submission
4. **Track analytics** on form submissions
5. **Implement rate limiting** to prevent spam
6. **Use HTTPS** for webhook endpoints
7. **Handle errors gracefully** with user-friendly messages
8. **Test with mock endpoints** before production
9. **Add CAPTCHA** for public forms
10. **Log errors** for debugging but don't expose to users
