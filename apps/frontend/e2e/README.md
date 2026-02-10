# E2E Testing con Playwright

Este directorio contiene los tests End-to-End (E2E) para la aplicación frontend usando Playwright.

## 📋 ¿Qué son los tests E2E?

Los tests E2E (End-to-End) prueban la aplicación completa desde la perspectiva del usuario, simulando interacciones reales con el navegador. A diferencia de los unit tests, los E2E tests:

- ✅ Prueban el flujo completo de la aplicación
- ✅ Funcionan con CSS y estilos reales
- ✅ Detectan problemas de integración
- ✅ Validan la experiencia del usuario
- ✅ Prueban frontend + backend juntos

## 🚀 Primeros Pasos

### 1. Instalar Navegadores

La primera vez que uses Playwright, debes instalar los navegadores:

```bash
npx playwright install
```

### 2. Ejecutar Tests

```bash
# Ejecutar todos los tests (headless)
npm run test:e2e

# Ver tests en UI mode (recomendado para desarrollo)
npm run test:e2e:ui

# Ejecutar con navegador visible
npm run test:e2e:headed

# Debug mode (paso a paso)
npm run test:e2e:debug

# Solo en Chromium (más rápido para desarrollo)
npm run test:e2e:chromium

# Ver reporte HTML de la última ejecución
npm run test:e2e:report
```

## 📁 Estructura de Tests

```
e2e/
├── home.spec.js         # Tests de la página principal
├── auth.spec.js         # Tests de autenticación (login, registro)
├── properties.spec.js   # Tests de búsqueda y propiedades
└── README.md           # Este archivo
```

## 📝 Anatomía de un Test

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // 1. Navegar a una página
    await page.goto('/');

    // 2. Interactuar con elementos
    await page.click('button[type="submit"]');
    await page.fill('input[name="email"]', 'test@test.com');

    // 3. Hacer aserciones
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Bienvenido')).toBeVisible();
  });
});
```

## 🎯 Tests Incluidos

### home.spec.js
- ✅ Carga de página principal
- ✅ Visualización de categorías
- ✅ Navegación a propiedades
- ✅ Botón de login visible

### auth.spec.js
- ✅ Formulario de login visible
- ✅ Validación de campos vacíos
- ✅ Escritura en campos
- ✅ Navegación a registro
- ✅ Navegación a recuperar contraseña
- ✅ Estado de carga
- ✅ Formulario de registro
- ✅ Validación de campos requeridos

### properties.spec.js
- ✅ Carga de lista de propiedades
- ✅ Filtros de búsqueda
- ✅ Visualización de tarjetas
- ✅ Click en propiedad
- ✅ Página de detalle
- ✅ Botón de contacto

## 🔧 Configuración

La configuración está en `playwright.config.js`:

- **Navegadores**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL**: http://localhost:5173
- **Timeout**: 30 segundos por test
- **Reintentos**: 2 en CI, 0 en local
- **Screenshots**: Solo en fallos
- **Video**: Retenido solo en fallos

## 💡 Mejores Prácticas

### 1. Selectores Recomendados (en orden de preferencia)

```javascript
// ✅ Mejor: Por role y nombre accesible
await page.getByRole('button', { name: 'Iniciar Sesión' });

// ✅ Bueno: Por label
await page.getByLabel('Email');

// ✅ Bueno: Por texto
await page.getByText('Crear cuenta');

// ⚠️ Aceptable: Por test id
await page.locator('[data-testid="submit-button"]');

// ❌ Evitar: Por clases CSS (frágil)
await page.locator('.btn-primary');
```

### 2. Esperar Correctamente

```javascript
// ✅ Esperar a que un elemento esté visible
await expect(page.getByText('Cargando')).toBeVisible();

// ✅ Esperar navegación
await page.waitForURL('/dashboard');

// ✅ Esperar que la red esté idle
await page.waitForLoadState('networkidle');
```

### 3. Organizar Tests

```javascript
test.describe('Feature', () => {
  // Setup común
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('test 1', async ({ page }) => {
    // ...
  });

  test('test 2', async ({ page }) => {
    // ...
  });
});
```

## 🐛 Debugging

### Ver tests en modo UI (recomendado)
```bash
npm run test:e2e:ui
```

### Debug paso a paso
```bash
npm run test:e2e:debug
```

### Ver trace de un test fallido
1. Ejecuta los tests normalmente
2. Abre el reporte: `npm run test:e2e:report`
3. Click en el test fallido
4. Click en "Trace" para ver grabación

### Pausar ejecución
```javascript
test('debug test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // 🛑 Pausa aquí
  // ...
});
```

## 📊 CI/CD

En CI (GitHub Actions, etc.), los tests se ejecutan automáticamente:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

## 🚨 Tests Fallando?

### 1. Servidor no está corriendo
```bash
# Asegúrate de que el dev server esté arriba
npm run dev
```

### 2. Backend no disponible
Los tests E2E requieren el backend funcionando si hacen requests API.

### 3. Datos de prueba
Algunos tests asumen que existen datos (propiedades, usuarios). Considera:
- Crear fixtures de datos
- Usar un entorno de testing con datos conocidos
- Mockar las APIs si es necesario

## 📚 Recursos

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [API Reference](https://playwright.dev/docs/api/class-test)

## 🎯 Próximos Pasos

1. ✅ Tests básicos de navegación (HECHO)
2. ⏳ Tests de flujo completo de login
3. ⏳ Tests de creación de propiedad
4. ⏳ Tests de búsqueda y filtros
5. ⏳ Tests de perfil de usuario
6. ⏳ Visual regression testing

---

**Última actualización:** 2026-02-10
