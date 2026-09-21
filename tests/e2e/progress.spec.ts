import { test, expect } from '@playwright/test';

const REVIEW_URL = '/learn-languages/en-GB/pt-PT/review/';
const PROGRESS_URL = '/learn-languages/en-GB/pt-PT/progress/';

test.describe('progress page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REVIEW_URL);
    await page.evaluate(() => window.localStorage.clear());
  });

  test('grading a card records calibration history (issue #46)', async ({ page }) => {
    await page.reload();
    await page.locator('#review-reveal').click();
    await page.locator('button[data-quality="3"]').click();

    const keys = await page.evaluate(() =>
      Object.keys(window.localStorage).filter((k) => k.startsWith('calibration-last-grade:'))
    );
    expect(keys).toHaveLength(1);

    const stored = await page.evaluate(
      (key) => JSON.parse(window.localStorage.getItem(key) ?? '{}'),
      keys[0]
    );
    expect(stored.quality).toBe(3);
  });

  test('shows a calibration note when recent over-confidence breaks exist', async ({ page }) => {
    await page.evaluate(() => {
      window.localStorage.setItem(
        'calibration-breaks:en-GB:pt-PT',
        JSON.stringify([new Date().toISOString().slice(0, 10)])
      );
    });
    await page.goto(PROGRESS_URL);

    const calibration = page.locator('#progress-calibration');
    await expect(calibration).toBeVisible();
    await expect(calibration).toContainText('1 item you rated confidently needed a re-grade');
  });

  test('hides the calibration note when there are no recent breaks', async ({ page }) => {
    await page.goto(PROGRESS_URL);
    await expect(page.locator('#progress-calibration')).toBeHidden();
  });
});
