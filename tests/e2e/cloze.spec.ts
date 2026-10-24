import { test, expect } from './fixtures';

const REVIEW_URL = '/learn-languages/en-GB/pt-PT/review/';

// Seeds every card as a due item with two successful reviews in a row (mature),
// then checks the cloze (L24): the sentence with the answer blanked, translation shown.
test('a mature item appears as a cloze of its example sentence', async ({ page }) => {
  await page.goto(REVIEW_URL);
  await page.evaluate(() => {
    window.localStorage.clear();
    const data = JSON.parse(document.getElementById('review-data')!.textContent!);
    for (const item of data.items) {
      window.localStorage.setItem(
        `srs:en-GB:pt-PT:forward:${item.target.id}`,
        JSON.stringify({
          interval: 6,
          easeFactor: 2.5,
          repetitions: 2,
          dueDate: '2000-01-01T00:00:00.000Z',
        })
      );
    }
    window.localStorage.setItem('new-cap:en-GB:pt-PT', '9999');
  });
  await page.reload();

  const front = page.locator('#review-front');
  const translation = page.locator('#review-cloze-translation');
  // Terms inflected in their sentence stay plain; step past them to the first cloze.
  for (let i = 0; i < 15 && !(await translation.isVisible()); i++) {
    await page.locator('#review-reveal').click();
    await page.locator('#review-grades button[data-quality="4"]').click();
  }
  await expect(translation).toBeVisible();

  await expect(front).toContainText('_____');
  await expect(translation).not.toBeEmpty();
  await page.locator('#review-reveal').click();
  await expect(page.locator('#review-back')).toBeVisible();
});
