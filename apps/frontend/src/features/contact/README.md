# Contact Form with Webhook Integration

This module provides a complete contact form solution with webhook integration for lead capture.

## 📁 Files Created

```
features/contact/
├── components/
│   ├── ContactForm.jsx      # Main contact form component
│   └── index.js             # Component exports
├── pages/
│   ├── ContactPage.jsx      # Full contact page with form
│   └── index.js             # Page exports
└── README.md                # This file

shared/services/
├── webhookService.js        # Webhook service with HTTP POST logic
└── index.js                 # Service exports
```

## 🚀 Quick Start

### 1. Configure Webhook URL and Auth Token

Edit `apps/frontend/src/shared/services/webhookService.js`:

```javascript
export const WEBHOOK_CONFIG = {
  url: 'https://your-actual-webhook-url.com/api/leads',  // ← Change this
  authToken: 'YOUR_ACTUAL_SECRET_TOKEN',                 // ← Change this
  timeout: 10000
}
```

### 2. Add Route to Your Router

Edit `apps/frontend/src/routes/AppRouter.jsx` to add the contact route:

```javascript
import { lazy } from 'react'

const ContactPage = lazy(() => import('@features/contact/pages/ContactPage'))

// In your routes array:
{
  path: '/contacto',
  element: <ContactPage />
}
```

### 3. Use the Form Component

**Option A: Use the full page component**
```javascript
import { ContactPage } from '@features/contact/pages'

// Use in your router (see step 2)
```

**Option B: Use just the form component**
```javascript
import { ContactForm } from '@features/contact/components'

function MyPage() {
  return (
    <div>
      <ContactForm
        origen="Landing Page Comercial"
        onSuccess={(response) => console.log('Success!', response)}
        onError={(error) => console.error('Error:', error)}
      />
    </div>
  )
}
```

## 📦 Payload Structure

The form sends data in this exact JSON structure:

```json
{
  "cliente": {
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "telefono": "+52 123 456 7890"
  },
  "consulta": {
    "origen": "Landing Page Comercial",
    "zona_interes": "Polanco",
    "mensaje_crudo": "Busco departamento de 2 recámaras..."
  },
  "seguridad": {
    "token_auth": "YOUR_SECRET_TOKEN"
  }
}
```

## 🎯 Component Props

### ContactForm

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `origen` | `string` | `"Landing Page Comercial"` | Source/origin of the lead |
| `onSuccess` | `function` | `undefined` | Callback when submission succeeds |
| `onError` | `function` | `undefined` | Callback when submission fails |

**Example:**
```javascript
<ContactForm
  origen="Página de Propiedades"
  onSuccess={(response) => {
    // Track analytics
    gtag('event', 'lead_submitted', {
      event_category: 'Contact',
      event_label: response.status
    })
  }}
  onError={(error) => {
    // Track errors
    Sentry.captureException(error)
  }}
/>
```

## 🔧 Advanced Usage

### Custom Styling

The form uses Tailwind classes. To customize:

```javascript
// Fork ContactForm.jsx and modify classes
<button
  type="submit"
  className="w-full bg-blue-600 text-white ..." // ← Change colors
>
```

### Validation Rules

Current validation (in `webhookService.js`):

- **Email**: Must be valid format (`user@domain.com`)
- **Phone**: Minimum 8 digits, allows `+`, `-`, `()`, spaces
- **Name**: Minimum 2 characters
- **Message**: Minimum 10 characters

To modify validation, edit the `validateForm()` function in `ContactForm.jsx`.

### Different Origen Values

Pass different `origen` values based on where the form is used:

```javascript
// In property detail page
<ContactForm origen="Detalle de Propiedad" />

// In home page
<ContactForm origen="Landing Page Principal" />

// In blog
<ContactForm origen="Blog Post" />
```

## 🌐 API Service

### Using the Webhook Service Directly

```javascript
import { sendLeadToWebhook } from '@shared/services'

const payload = {
  cliente: {
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    telefono: '+52 123 456 7890'
  },
  consulta: {
    origen: 'API Direct Call',
    zona_interes: 'Condesa',
    mensaje_crudo: 'Interesado en...'
  }
}

try {
  const response = await sendLeadToWebhook(payload)
  console.log('Success:', response)
} catch (error) {
  console.error('Error:', error)
}
```

### Validation Helpers

```javascript
import { validateEmail, validatePhone } from '@shared/services'

const isValidEmail = validateEmail('test@example.com') // true
const isValidPhone = validatePhone('+52 123 456 7890') // true
```

## 🔒 Security Notes

1. **Token Storage**: The `token_auth` is currently stored in the frontend code. For production:
   - Consider moving to environment variables (`VITE_WEBHOOK_TOKEN`)
   - Or fetch token from your backend API before submission

2. **HTTPS Only**: Ensure webhook endpoint uses HTTPS in production

3. **Rate Limiting**: Consider adding rate limiting to prevent spam

## 🧪 Testing

### Manual Testing

1. Start dev server: `npm run dev`
2. Navigate to `/contacto`
3. Fill form and submit
4. Check browser console for webhook response
5. Verify webhook endpoint received data

### Unit Tests (Future)

```javascript
// Example test structure
import { render, screen, fireEvent } from '@testing-library/react'
import ContactForm from './ContactForm'

test('submits form with correct payload', async () => {
  render(<ContactForm />)

  fireEvent.change(screen.getByLabelText(/nombre/i), {
    target: { value: 'Juan Pérez' }
  })
  // ... more assertions
})
```

## 🐛 Troubleshooting

**Form doesn't submit:**
- Check browser console for errors
- Verify webhook URL is correct
- Check network tab for failed requests

**CORS errors:**
- Webhook endpoint must have correct CORS headers
- Add your frontend URL to webhook's allowed origins

**Validation errors:**
- Check that all required fields are filled
- Verify email/phone format is correct

**Timeout errors:**
- Default timeout is 10 seconds
- Increase in `WEBHOOK_CONFIG.timeout` if needed

## 📝 Example Integration in Existing Pages

### Add to Home Page

```javascript
// apps/frontend/src/features/home/pages/HomePage.jsx
import { ContactForm } from '@features/contact/components'

function HomePage() {
  return (
    <div>
      {/* ... existing content ... */}

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            ¿Buscas una propiedad?
          </h2>
          <ContactForm origen="Home Page - Contact Section" />
        </div>
      </section>
    </div>
  )
}
```

### Add to Property Detail Page

```javascript
// In property detail page
import { ContactForm } from '@features/contact/components'

function PropertyDetailPage() {
  const { property } = useProperty()

  return (
    <div>
      {/* ... property details ... */}

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Contactar al vendedor</h3>
        <ContactForm
          origen={`Propiedad ${property.id}`}
          onSuccess={() => {
            // Track property interest
            console.log('Lead for property:', property.id)
          }}
        />
      </div>
    </div>
  )
}
```

## 🎨 Customization Examples

### Minimal Version (No Zona de Interés)

Fork `ContactForm.jsx` and remove the zona_interes field:

```javascript
// Remove this block from the JSX:
{/* Zona de Interés */}
<div>
  <label htmlFor="zona_interes" ...>
    Zona de Interés
  </label>
  <input ... />
</div>

// Update payload construction:
consulta: {
  origen,
  zona_interes: '', // Always empty
  mensaje_crudo: formData.mensaje.trim()
}
```

### Pre-fill Property Info

```javascript
<ContactForm
  origen="Propiedad XYZ"
  defaultMessage={`Estoy interesado en la propiedad en ${property.address}`}
/>
```

Then update `ContactForm.jsx` to accept `defaultMessage` prop.

## 📚 Related Documentation

- [Axios Documentation](https://axios-http.com/)
- [React Forms Best Practices](https://react.dev/reference/react-dom/components/form)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

To improve this module:
1. Add unit tests with Vitest
2. Add E2E tests with Playwright
3. Improve validation logic
4. Add internationalization (i18n)
5. Add reCAPTCHA integration
