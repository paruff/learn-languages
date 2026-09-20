import { test, expect } from '@playwright/test';

const REVIEW_URL = '/learn-languages/en-GB/pt-PT/review/';

test.describe('review session', () => {
  test.beforeEach(async ({ page }) => {
    // Start every run from a clean slate — SRS state is localStorage-only,
    // so a prior run's due-card state would otherwise leak between tests.
    await page.goto(REVIEW_URL);
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('reveal shows the answer and grading persists SRS state', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const front = page.locator('#review-front');
    const back = page.locator('#review-back');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const easy = grades.locator('button[data-quality="4"]');

    await expect(progress).toHaveText('1 of 10');
    await expect(front).not.toBeEmpty();
    await expect(back).toBeHidden();
    await expect(grades).toBeHidden();

    await reveal.click();

    await expect(back).toBeVisible();
    await expect(back).not.toBeEmpty();
    await expect(grades).toBeVisible();

    await easy.click();

    // Grading advances to the next card in the same session — the total
    // (denominator) is the session size, not the remaining due count.
    await expect(progress).toHaveText('2 of 10');

    // The SM-2 state actually landed in localStorage, not just the UI.
    const savedKeys = await page.evaluate(() =>
      Object.keys(window.localStorage).filter((key) => key.startsWith('srs:en-GB:pt-PT:forward:'))
    );
    expect(savedKeys).toHaveLength(1);

    const savedState = await page.evaluate(
      (key) => JSON.parse(window.localStorage.getItem(key) ?? '{}'),
      savedKeys[0]
    );
    expect(savedState.repetitions).toBe(1);
    expect(savedState.interval).toBe(1);

    // Reloading re-filters by due date — the graded card (due tomorrow)
    // should no longer appear in today's queue. This is the real proof
    // that SRS state persists across page loads, not just within one.
    await page.reload();
    await expect(progress).toHaveText('1 of 9');
  });
});
