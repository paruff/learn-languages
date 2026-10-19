import { test, expect } from '@playwright/test';

const REVIEW_URL = '/learn-languages/en-GB/it-IT/review/';
const GREET_LESSON_URL = '/learn-languages/en-GB/it-IT/lessons/A1-GREET-001/';

test.describe('it-IT A1 review session', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REVIEW_URL);
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('loads the EN→IT A1 review flow and persists SRS state', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const front = page.locator('#review-front');
    const back = page.locator('#review-back');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const easy = grades.locator('button[data-quality="4"]');

    await expect(progress).toBeVisible();
    await expect(front).not.toBeEmpty();
    await expect(back).toBeHidden();

    await reveal.click();
    await expect(back).toBeVisible();
    await easy.click();

    const savedKeys = await page.evaluate(() =>
      Object.keys(window.localStorage).filter((key) => key.startsWith('srs:en-GB:it-IT:forward:'))
    );
    expect(savedKeys.length).toBeGreaterThan(0);
  });

  test('lesson pages render an Italian A1 greeting set', async ({ page }) => {
    await page.goto(GREET_LESSON_URL);
    await expect(page.locator('.lesson__title')).toBeVisible();
    await expect(page.locator('.vocab-item__term').first()).toContainText(/hello/i);
    await expect(page.locator('.vocab-item__term').first()).toContainText(/ciao/i);
  });
});
