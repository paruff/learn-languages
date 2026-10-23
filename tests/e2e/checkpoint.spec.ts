import { test, expect } from './fixtures';

const PAIR = 'en-GB:pt-PT';

test('checkpoint offers unseen items 7+ days after study and records the self-rating', async ({
  page,
}) => {
  await page.goto('/learn-languages/en-GB/pt-PT/checkpoint/');
  await expect(page.locator('#cp-empty')).toBeVisible();

  // Backdate a lesson's study date to 8 days ago.
  const first = await page.evaluate((pair) => {
    const ids: string[] = JSON.parse(localStorage.getItem(`studied:${pair}`)!);
    const d = new Date(Date.now() - 8 * 86_400_000).toISOString().slice(0, 10);
    localStorage.setItem(
      `studied-at:${pair}`,
      JSON.stringify(Object.fromEntries(ids.map((i) => [i, d])))
    );
    return ids[0];
  }, PAIR);
  expect(first).toBeTruthy();

  await page.reload();
  await expect(page.locator('#cp-quiz')).toBeVisible();
  for (let i = 0; i < 5 && (await page.locator('#cp-quiz').isVisible()); i++) {
    await page.fill('#cp-input', 'x');
    await page.click('#cp-form button');
  }
  await expect(page.locator('#cp-rate')).toBeVisible();
  await page.click('#cp-yes');
  await expect(page.locator('#cp-done')).toBeVisible();
  const saved = await page.evaluate(() =>
    Object.keys(localStorage).some((k) => k.startsWith('checkpoint:'))
  );
  expect(saved).toBe(true);
});
