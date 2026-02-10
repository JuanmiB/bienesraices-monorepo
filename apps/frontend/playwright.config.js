import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para tests E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  // Timeout para cada test
  timeout: 30 * 1000,

  // Configuración de expect
  expect: {
    timeout: 5000
  },

  // Ejecutar tests en paralelo
  fullyParallel: true,

  // Fallar en la primera falla en CI
  forbidOnly: !!process.env.CI,

  // Reintentar en CI
  retries: process.env.CI ? 2 : 0,

  // Número de workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: 'html',

  // Configuración compartida para todos los tests
  use: {
    // URL base
    baseURL: 'http://localhost:5173',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Trace on failure
    trace: 'on-first-retry',
  },

  // Configurar proyectos para diferentes navegadores
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Tests en mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Servidor de desarrollo
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
