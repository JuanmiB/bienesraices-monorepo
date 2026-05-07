# 📨 Webhook Integration Guide

Complete guide to configure and use the contact form with webhook integration.

## 🎯 Overview

This integration allows you to capture leads from the frontend and send them to an external webhook endpoint via HTTP POST.

**Files created:**
- ✅ `apps/frontend/src/shared/services/webhookService.js` - Webhook service
- ✅ `apps/frontend/src/features/contact/components/ContactForm.jsx` - Form component
- ✅ `apps/frontend/src/features/contact/pages/ContactPage.jsx` - Full page with form
- ✅ Validation helpers and error handling

## 🔧 Configuration Steps

### Step 1: Configure Webhook URL and Token

Edit `apps/frontend/src/shared/services/webhookService.js`:

```javascript
export const WEBHOOK_CONFIG = {
  url: 'https://your-webhook-endpoint.com/api/leads',  // ← Your webhook URL
  authToken: 'YOUR_SECRET_TOKEN',                       // ← Your auth token
  timeout: 10000
}
```

**Production Best Practice:** Use environment variables instead:

```javascript
// In webhookService.js
export const WEBHOOK_CONFIG = {
  url: import.meta.env.VITE_WEBHOOK_URL || 'https://fallback-url.com',
  authToken: import.meta.env.VITE_WEBHOOK_TOKEN || '',
  timeout: 10000
}
```

Then create `apps/frontend/.env.local`:

```env
VITE_WEBHOOK_URL=https://your-webhook-endpoint.com/api/leads
VITE_WEBHOOK_TOKEN=your_actual_secret_token
```

### Step 2: Add Route to Router

Edit `apps/frontend/src/routes/AppRouter.jsx`:

```javascript
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Lazy load the contact page
const ContactPage = lazy(() =>
  import('@features/contact/pages/ContactPage').then(module => ({
    default: module.ContactPage
  }))
)

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* ... existing routes ... */}

          <Route path="/contacto" element={<ContactPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

### Step 3: Add Navigation Link (Optional)

Add a link in your header/navbar:

```javascript
import { Link } from 'react-router-dom'

<Link to="/contacto" className="nav-link">
  Contacto
</Link>
```

## 📋 Payload Structure

The webhook receives this JSON structure:

```json
{
  "cliente": {
    "nombre": "string",
    "email": "string",
    "telefono": "string"
  },
  "consulta": {
    "origen": "string",
    "zona_interes": "string",
    "mensaje_crudo": "string"
  },
  "seguridad": {
    "token_auth": "string"
  }
}
```

**Example payload:**

```json
{
  "cliente": {
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "telefono": "+52 123 456 7890"
  },
  "consulta": {
    "origen": "Landing Page Comercial",
    "zona_interes": "Polanco, CDMX",
    "mensaje_crudo": "Busco departamento de 2 recámaras con estacionamiento"
  },
  "seguridad": {
    "token_auth": "YOUR_SECRET_TOKEN"
  }
}
```

## 🎨 Usage Examples

### Example 1: Standalone Contact Page

Already implemented in `apps/frontend/src/features/contact/pages/ContactPage.jsx`.

Access at: `http://localhost:5173/contacto`

### Example 2: Embed in Home Page

```javascript
// apps/frontend/src/features/home/pages/HomePage.jsx
import { ContactForm } from '@features/contact/components'

function HomePage() {
  return (
    <div>
      <section className="hero">
        {/* Hero content */}
      </section>

      <section className="properties">
        {/* Properties list */}
      </section>

      {/* Add contact form section */}
      <section className="contact py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Déjanos tus datos y te ayudaremos a encontrar la propiedad ideal
          </p>
          <ContactForm
            origen="Home Page - Contact Section"
            onSuccess={(response) => {
              console.log('Lead captured from home page')
            }}
          />
        </div>
      </section>
    </div>
  )
}
```

### Example 3: Property Detail "Contact Seller" Form

```javascript
// apps/frontend/src/features/properties/pages/PropertyDetailPage.jsx
import { ContactForm } from '@features/contact/components'

function PropertyDetailPage() {
  const { property } = useProperty()

  const handleLeadSubmit = (response) => {
    // Track which property generated the lead
    console.log(`Lead for property ${property.id}:`, response)

    // Optional: Send analytics event
    // gtag('event', 'property_inquiry', {
    //   property_id: property.id,
    //   property_price: property.price
    // })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Property details */}
      <div className="property-info">
        <h1>{property.title}</h1>
        <p>{property.description}</p>
        {/* ... */}
      </div>

      {/* Contact seller section */}
      <div className="mt-12 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          Contactar al vendedor
        </h2>
        <ContactForm
          origen={`Propiedad ${property.id} - ${property.title}`}
          onSuccess={handleLeadSubmit}
        />
      </div>
    </div>
  )
}
```

### Example 4: Modal/Popup Contact Form

```javascript
import { useState } from 'react'
import { ContactForm } from '@features/contact/components'

function PropertyCard({ property }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="property-card">
        <h3>{property.title}</h3>
        <button onClick={() => setShowModal(true)}>
          Contactar
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg"
            >
              ✕
            </button>
            <ContactForm
              origen={`Modal - Propiedad ${property.id}`}
              onSuccess={() => {
                setShowModal(false)
                alert('¡Mensaje enviado! Nos contactaremos pronto.')
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
```

## 🔍 Validation Rules

Built-in validation includes:

| Field | Validation |
|-------|------------|
| **Nombre** | Required, min 2 characters |
| **Email** | Required, valid email format |
| **Teléfono** | Required, min 8 digits, allows `+`, `-`, `()`, spaces |
| **Mensaje** | Required, min 10 characters |
| **Zona Interés** | Optional |

## 🚨 Error Handling

The form handles three types of errors:

1. **Validation Errors**: Client-side validation before submission
2. **Network Errors**: Connection issues, timeouts
3. **Server Errors**: Webhook endpoint returns error status

```javascript
<ContactForm
  onError={(error) => {
    // Custom error handling
    if (error.message.includes('Webhook error: 401')) {
      console.error('Authentication failed - check token')
    } else if (error.message.includes('No se pudo conectar')) {
      console.error('Network error - check connection')
    }

    // Optional: Send to error tracking
    // Sentry.captureException(error)
  }}
/>
```

## 🧪 Testing the Integration

### 1. Test with a Mock Webhook

Use a service like [webhook.site](https://webhook.site) for testing:

```javascript
// In webhookService.js (for testing only)
export const WEBHOOK_CONFIG = {
  url: 'https://webhook.site/your-unique-url',
  authToken: 'test-token',
  timeout: 10000
}
```

### 2. Check the Request

1. Fill and submit the form
2. Check webhook.site to see the payload
3. Verify JSON structure is correct

### 3. Test Error Handling

```javascript
// Temporarily use an invalid URL to test error handling
url: 'https://invalid-url-that-does-not-exist.com/api'
```

## 🔐 Security Best Practices

### 1. Environment Variables (Recommended)

```env
# apps/frontend/.env.local (NOT committed to git)
VITE_WEBHOOK_URL=https://your-webhook.com/api/leads
VITE_WEBHOOK_TOKEN=your_secret_token_here
```

```javascript
// webhookService.js
export const WEBHOOK_CONFIG = {
  url: import.meta.env.VITE_WEBHOOK_URL,
  authToken: import.meta.env.VITE_WEBHOOK_TOKEN,
  timeout: 10000
}
```

### 2. HTTPS Only

Ensure webhook endpoint uses HTTPS in production.

### 3. Rate Limiting (Future Enhancement)

Add client-side rate limiting to prevent spam:

```javascript
// In ContactForm.jsx
const [lastSubmit, setLastSubmit] = useState(null)

const handleSubmit = async (e) => {
  e.preventDefault()

  // Rate limit: max 1 submission per minute
  if (lastSubmit && Date.now() - lastSubmit < 60000) {
    setError('Espera 1 minuto antes de enviar otro mensaje')
    return
  }

  // ... rest of submission logic
  setLastSubmit(Date.now())
}
```

### 4. CAPTCHA Integration (Future)

Consider adding reCAPTCHA for production:

```javascript
// Example with react-google-recaptcha
import ReCAPTCHA from 'react-google-recaptcha'

function ContactForm() {
  const [captchaToken, setCaptchaToken] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!captchaToken) {
      setError('Por favor completa el CAPTCHA')
      return
    }

    // Include captcha token in payload
    const payload = {
      ...data,
      captcha: captchaToken
    }

    // Submit...
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}

      <ReCAPTCHA
        sitekey="your-site-key"
        onChange={setCaptchaToken}
      />

      <button type="submit">Enviar</button>
    </form>
  )
}
```

## 📊 Analytics Integration

### Google Analytics Example

```javascript
<ContactForm
  onSuccess={(response) => {
    // Track successful lead submission
    if (window.gtag) {
      window.gtag('event', 'lead_submitted', {
        event_category: 'Contact',
        event_label: 'Contact Form',
        value: 1
      })
    }
  }}
  onError={(error) => {
    // Track errors
    if (window.gtag) {
      window.gtag('event', 'form_error', {
        event_category: 'Contact',
        event_label: error.message
      })
    }
  }}
/>
```

### Facebook Pixel Example

```javascript
<ContactForm
  onSuccess={() => {
    // Track lead event
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Contact Form'
      })
    }
  }}
/>
```

## 🐛 Troubleshooting

### Issue: CORS Error

**Problem:** Browser blocks request due to CORS policy

**Solution:** Webhook endpoint must include CORS headers:

```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Issue: 401 Unauthorized

**Problem:** Webhook rejects request with 401

**Solution:** Verify `token_auth` matches webhook's expected token

### Issue: Form submits but no data received

**Problem:** Webhook receives empty payload

**Solution:** Check webhook expects JSON (not form-data):
- Content-Type must be `application/json`
- Webhook should parse `req.body` as JSON

### Issue: Timeout Errors

**Problem:** Request takes too long

**Solution:** Increase timeout or check webhook performance:

```javascript
export const WEBHOOK_CONFIG = {
  url: '...',
  authToken: '...',
  timeout: 20000 // Increase to 20 seconds
}
```

## 📞 Support

For issues or questions:
1. Check the detailed README: `apps/frontend/src/features/contact/README.md`
2. Review error messages in browser console
3. Test with webhook.site to verify payload structure
4. Check network tab in DevTools for failed requests

## 🚀 Next Steps

- [ ] Configure webhook URL and token
- [ ] Add route to router
- [ ] Test form submission
- [ ] Add analytics tracking
- [ ] Consider adding CAPTCHA for production
- [ ] Add rate limiting
- [ ] Implement error tracking (Sentry, etc.)
