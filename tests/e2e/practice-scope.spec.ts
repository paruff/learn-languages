import { test, expect } from '@playwright/test';

const BASE = '/learn-languages/en-GB/pt-PT';

// Spec J2 (#207): practise only what you've studied.
test.describe('lesson-scoped practice', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/review/`);
    await page.evaluate(() => window.localStorage.clear());
  });

  test('a fresh learner who opened no lesson is pointed to a lesson, not a quiz', async ({
    page,
  }) => {
    await page.goto(`${BASE}/review/`);
    await expect(page.locator('#review-card')).toBeHidden();
    await expect(page.locator('#review-no-studied')).toBeVisible();
    await page.locator('#review-first-lesson').click();
    await expect(page).toHaveURL(/\/lessons\/[A-Z0-9-]+\/$/);
  });

  test('opening Greetings then practising shows only greetings words', async ({ page }) => {
    await page.goto(`${BASE}/lessons/A1-GREET-001/`);
    const lessonTerms = (await page.locator('.vocab-item__term').allTextContents()).join(' ');
    await page.getByRole('link', { name: /Practice these words/ }).click();
    await expect(page).toHaveURL(/review\/\?lesson=A1-GREET-001/);

    await expect(page.locator('#review-card')).toBeVisible();
    const total = Number(
      (await page.locator('#review-progress').textContent())?.match(/of (\d+)$/)?.[1]
    );
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) {
      const front = (await page.locator('#review-front').textContent()) ?? '';
      expect(lessonTerms).toContain(front);
      await page.locator('#review-reveal').click();
      await page.locator('#review-grades button[data-quality="4"]').click();
    }

    // Plain Practice afterwards draws from the studied lesson only (nothing left due today).
    await page.goto(`${BASE}/review/`);
    await expect(page.locator('#review-no-studied')).toBeHidden();
  });
});
