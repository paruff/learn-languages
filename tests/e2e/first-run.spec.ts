import { test, expect } from '@playwright/test';

// Spec Q9, U1-U3, U5, U6: the path a stranger takes on their first visit.
const HOME = '/learn-languages/';

test.describe('first run', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME);
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('home says Learn Portuguese and Start lands on en-GB→pt-PT (U1)', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Learn Portuguese with Science'
    );
    await page.getByRole('link', { name: /Start your first lesson/ }).click();
    await expect(page).toHaveURL(/\/en-GB\/pt-PT\/lessons\/$/);
  });

  test('a saved pair is honoured by Start and the nav (U1)', async ({ page }) => {
    await page.evaluate(() =>
      window.localStorage.setItem(
        'pairPreference',
        JSON.stringify({ sourceLang: 'en-GB', targetLang: 'es-ES' })
      )
    );
    await page.reload();
    await page.getByRole('link', { name: /Start your first lesson/ }).click();
    await expect(page).toHaveURL(/\/en-GB\/es-ES\/lessons\/$/);
  });

  test('page opts out of browser auto-translation (U2)', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('translate', 'no');
    await expect(page.locator('meta[name="google"][content="notranslate"]')).toHaveCount(1);
  });

  test('nav marks the current section on every page (U3)', async ({ page }) => {
    const base = '/learn-languages/en-GB/pt-PT';
    for (const [path, name] of [
      ['lessons/', 'Lessons'],
      ['review/', 'Practice'],
      ['progress/', 'Progress'],
    ]) {
      await page.goto(`${base}/${path}`);
      const current = page.locator('.nav__link[aria-current="page"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(name);
    }
  });

  test('a lesson shows where you are: Lessons › its Can-Do title (U3)', async ({ page }) => {
    await page.goto('/learn-languages/en-GB/pt-PT/lessons/');
    await page.locator('a[href*="/lessons/A1-"]').first().click();
    const crumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumb.getByRole('link', { name: 'Lessons' })).toBeVisible();
    await expect(crumb.locator('[aria-current="page"]')).toHaveText(
      (await page.locator('h1').textContent())!.trim()
    );
    await expect(page.locator('.nav__link[aria-current="page"]')).toHaveText('Lessons');
  });

  test('every page offers a feedback link (U5)', async ({ page }) => {
    const link = page.locator('footer a[href^="mailto:"]');
    await expect(link).toHaveCount(1);
  });

  test('pair selector shows names, not codes, and keeps you on the same page type (U6)', async ({
    page,
  }) => {
    await page.goto('/learn-languages/en-GB/pt-PT/progress/');
    const target = page.locator('#pair-selector-target');
    await expect(target.locator('option:checked')).toHaveText('Portuguese');
    await target.selectOption('es-ES');
    await expect(page).toHaveURL(/\/en-GB\/es-ES\/progress\/$/);
  });
});
