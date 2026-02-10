import { test, expect } from '@playwright/test';

test.describe('Página Principal', () => {
  test('debe cargar la página de inicio', async ({ page }) => {
    await page.goto('/');

    // Verificar que el título esté presente
    await expect(page).toHaveTitle(/Bienes Raices/i);

    // Verificar que el header esté visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('debe mostrar las categorías de propiedades', async ({ page }) => {
    await page.goto('/');

    // Esperar que carguen las categorías
    await page.waitForLoadState('networkidle');

    // Verificar que hay categorías visibles
    const categories = page.locator('[data-testid="category-card"]');
    await expect(categories.first()).toBeVisible({ timeout: 10000 });
  });

  test('debe navegar a la página de propiedades', async ({ page }) => {
    await page.goto('/');

    // Click en el botón/link de propiedades
    await page.click('text=/Ver.*propiedades/i');

    // Verificar que navegó correctamente
    await expect(page).toHaveURL(/\/propiedades/);
  });

  test('debe mostrar el botón de login', async ({ page }) => {
    await page.goto('/');

    // Verificar que el botón/link de login esté visible
    const loginButton = page.locator('text=/Iniciar.*sesión/i').first();
    await expect(loginButton).toBeVisible();
  });
});
