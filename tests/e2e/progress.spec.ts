import { test, expect } from './fixtures';

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

  test('"next up" picks an unmastered prerequisite, not a dependent node (L12)', async ({
    page,
  }) => {
    await page.goto(PROGRESS_URL);
    // Nothing mastered: A1-CAPAB-001 (needs WANT) must not lead; the card must be a prerequisite-free node.
    const next = page.locator('#progress-next');
    await expect(next).toBeVisible();
    await expect(next).not.toContainText('ability and inability');
    await expect(next).toContainText('(A1)');
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

  test('leads with the A1 Can-Do checklist, later levels collapsed (J3)', async ({ page }) => {
    await page.goto(PROGRESS_URL);
    const levels = page.locator('#progress-cando details');
    await expect(levels.first()).toHaveJSProperty('open', true);
    await expect(levels.first().locator('summary')).toContainText('A1');
    await expect(levels.first().locator('.cando__item').first()).toContainText('Studied');
    await expect(levels.nth(1)).toHaveJSProperty('open', false);
  });

  test('the Listen button plays the recorded pt-PT audio for the answer', async ({ page }) => {
    await page.goto(REVIEW_URL);
    await page.locator('#review-reveal').click();
    const button = page.locator('#review-pronounce');
    await expect(button).toContainText('Listen');
    const audio = page.waitForResponse((r) => r.url().includes('/audio/pt-PT/') && r.ok());
    await button.click();
    await audio;
  });
});
