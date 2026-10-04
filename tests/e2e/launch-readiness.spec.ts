import { test, expect } from '@playwright/test';

const REVIEW_URL = '/learn-languages/en-GB/pt-PT/review/';
const PROGRESS_URL = '/learn-languages/en-GB/pt-PT/progress/';

test.describe('launch readiness', () => {
  test('makes no third-party requests (spec S3)', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      const host = new URL(req.url()).hostname;
      if (host !== 'localhost' && !req.url().startsWith('data:')) external.push(req.url());
    });
    await page.goto(REVIEW_URL, { waitUntil: 'networkidle' });
    expect(external).toEqual([]);
  });

  test('review page still works offline after one online visit (spec Q7)', async ({
    page,
    context,
    browserName,
  }) => {
    // Playwright's WebKit/Firefox don't reliably route offline requests via SW.
    test.skip(browserName !== 'chromium', 'Service-worker offline emulation is Chromium-only');
    await page.goto(REVIEW_URL);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload(); // first controlled load populates the cache
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('#review-progress')).toBeVisible();
    await context.setOffline(false);
  });

  test('unknown paths show an in-app 404 with a way back', async ({ page }) => {
    const response = await page.goto('/learn-languages/no-such-page/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to Acquira' })).toBeVisible();
  });

  test('progress backup downloads and restores (spec S5)', async ({ page }) => {
    await page.goto(PROGRESS_URL);
    await page.evaluate(() => {
      window.localStorage.clear();
      window.localStorage.setItem(
        'srs:en-GB:pt-PT:forward:test-item',
        JSON.stringify({ interval: 6, easeFactor: 2.5, repetitions: 2, dueDate: '2026-01-01' })
      );
    });

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Download backup' }).click(),
    ]);
    const path = await download.path();

    await page.evaluate(() => window.localStorage.clear());
    await page.locator('#backup-import').setInputFiles(path);
    await expect(page.locator('#backup-status')).toContainText('Restored 1 saved items');
    expect(
      await page.evaluate(() => window.localStorage.getItem('srs:en-GB:pt-PT:forward:test-item'))
    ).toContain('"interval":6');
  });

  test('review page survives corrupt saved progress (spec S7)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(REVIEW_URL);
    await page.evaluate(() => {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key?.startsWith('srs:')) window.localStorage.setItem(key, '{corrupt');
      }
      window.localStorage.setItem('pairPreference', '{corrupt');
      window.localStorage.setItem('calibration-breaks:en-GB:pt-PT', '{corrupt');
    });
    await page.reload();
    await expect(page.locator('#review-progress')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
