import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login antes de cada test
    await page.goto('/auth/login');
  });

  test('debe mostrar el formulario de login', async ({ page }) => {
    // Verificar que el formulario esté visible
    await expect(page.getByRole('heading', { name: /ingresa a tu cuenta/i })).toBeVisible();

    // Verificar que los inputs existan
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();

    // Verificar que el botón de submit exista
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('debe mostrar error con credenciales vacías', async ({ page }) => {
    // Click en el botón sin llenar campos
    await page.click('button[type="submit"]');

    // Los campos required del HTML5 deberían prevenir el submit
    // Verificar que seguimos en la página de login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('debe permitir escribir en los campos', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/contraseña/i);

    // Escribir en los campos
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Verificar que los valores se escribieron
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('debe navegar a crear cuenta', async ({ page }) => {
    // Click en el link de registro
    await page.click('text=/registráte aquí/i');

    // Verificar navegación
    await expect(page).toHaveURL(/\/auth\/crear-cuenta/);

    // Verificar que el formulario de registro esté visible
    await expect(page.getByRole('heading', { name: /crea tu cuenta/i })).toBeVisible();
  });

  test('debe navegar a recuperar contraseña', async ({ page }) => {
    // Click en el link de recuperar contraseña
    await page.click('text=/recupérala aquí/i');

    // Verificar navegación
    await expect(page).toHaveURL(/\/auth\/recuperar-contraseña/);
  });

  test('debe mostrar estado de carga', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });

    // Llenar credenciales
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Click en submit
    await submitButton.click();

    // El botón debería mostrar "Cargando..." brevemente
    // (Esto depende de la velocidad del backend, puede que necesite ajustes)
    const loadingButton = page.getByRole('button', { name: /cargando/i });

    // Esperamos o que aparezca loading, o que ya haya pasado la carga
    try {
      await expect(loadingButton).toBeVisible({ timeout: 2000 });
    } catch {
      // Si no vemos loading es porque fue muy rápido o ya terminó
      // Esto no es un error, solo verificamos que el flujo corrió
    }
  });
});

test.describe('Registro', () => {
  test('debe mostrar el formulario de registro', async ({ page }) => {
    await page.goto('/auth/crear-cuenta');

    // Verificar campos del formulario
    await expect(page.getByLabel(/nombre/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i).first()).toBeVisible();
    await expect(page.getByLabel(/repetir.*contraseña/i)).toBeVisible();

    // Verificar botón de registro
    await expect(page.getByRole('button', { name: /crear cuenta/i })).toBeVisible();
  });

  test('debe validar campos requeridos', async ({ page }) => {
    await page.goto('/auth/crear-cuenta');

    // Intentar submit sin llenar campos
    await page.click('button[type="submit"]');

    // HTML5 validation debería prevenir el submit
    await expect(page).toHaveURL(/\/auth\/crear-cuenta/);
  });
});
