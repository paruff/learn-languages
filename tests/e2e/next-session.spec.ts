import { test, expect } from './fixtures';

// Spec L21: skippable, shown on the next visit, .ics downloads with no network request.
test('next-session prompt: skippable, remembered, .ics is local (L21)', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (r) => {
    if (!r.url().startsWith('http://localhost')) external.push(r.url());
  });

  async function finishSession(): Promise<void> {
    const reveal = page.locator('#review-reveal');
    while (await reveal.isVisible()) {
      await reveal.click();
      await page.locator('#review-grades button[data-quality="4"]').click();
      const cont = page.locator('#review-correction-continue');
      if (await cont.isVisible()) await cont.click();
    }
  }

  await page.goto('/learn-languages/en-GB/pt-PT/review/');
  await finishSession();
  const form = page.locator('#review-nextform');
  await expect(form).toBeVisible();
  await page.locator('#review-nextform-skip').click();
  await expect(form).toBeHidden();
  await expect(page.locator('#review-plan')).toBeHidden();

  await page.reload();
  await finishSession();
  await page.locator('#review-nextform-text').fill('On the 08:10 bus');
  const download = page.waitForEvent('download');
  await page.locator('#review-nextform-ics').click();
  expect((await download).suggestedFilename()).toBe('acquira-next-session.ics');
  await expect(page.locator('#review-plan')).toContainText('On the 08:10 bus');

  await page.goto('/learn-languages/en-GB/pt-PT/lessons/');
  await expect(page.locator('[data-plan]')).toContainText('On the 08:10 bus');
  expect(external).toEqual([]);
});
