import { test, expect } from '@playwright/test';

const REVIEW_URL = '/learn-languages/en-GB/fr-FR/review/';
const GREET_LESSON_URL = '/learn-languages/en-GB/fr-FR/lessons/A1-GREET-001/';
const FOOD_LESSON_URL = '/learn-languages/en-GB/fr-FR/lessons/A1-FOOD-001/';

test.describe('fr-FR A1 review session', () => {
  test.beforeEach(async ({ page }) => {
    // SRS state is localStorage-only — clear it so prior runs don't leak.
    await page.goto(REVIEW_URL);
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('reveal/grade persists SRS state under the fr-FR pair key', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const front = page.locator('#review-front');
    const back = page.locator('#review-back');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const easy = grades.locator('button[data-quality="4"]');

    // Session size parsed dynamically — never hardcode content counts.
    const progressText = await progress.textContent();
    const totalCount = Number(progressText?.match(/of (\d+)$/)?.[1]);
    expect(totalCount).toBeGreaterThan(0);

    await expect(progress).toHaveText(`1 of ${totalCount}`);
    await expect(front).not.toBeEmpty();
    await expect(back).toBeHidden();

    await reveal.click();
    await expect(back).toBeVisible();
    await expect(easy).toBeVisible();
    await easy.click();

    await expect(progress).toHaveText(`2 of ${totalCount}`);

    const savedKeys = await page.evaluate(() =>
      Object.keys(window.localStorage).filter((key) => key.startsWith('srs:en-GB:fr-FR:forward:'))
    );
    expect(savedKeys).toHaveLength(1);
  });

  test('a full session grades out and shows the summary', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const summary = page.locator('#review-summary');
    const easy = grades.locator('button[data-quality="4"]');

    const progressText = await progress.textContent();
    const totalCount = Number(progressText?.match(/of (\d+)$/)?.[1]);
    expect(totalCount).toBeGreaterThan(0);

    for (let i = 0; i < totalCount; i++) {
      await reveal.click();
      await easy.click();
    }

    await expect(summary).toBeVisible();
    await expect(summary).toContainText(`${totalCount}/${totalCount} correct first try`);
  });

  test('greeting lesson pairs English prompts with aligned French answers', async ({ page }) => {
    await page.goto(GREET_LESSON_URL);
    const terms = page.locator('.vocab-item__term');
    // en-GB seq 002 is "Good morning" — must pair with "Bonjour",
    // NOT the skeleton's old "Bonsoir" (Good evening) — the seq-alignment
    // bug this epic fixes.
    await expect(terms.nth(1)).toContainText('Good morning');
    await expect(terms.nth(1)).toContainText('Bonjour');
    await expect(terms.nth(1)).not.toContainText('Bonsoir');
    await expect(terms.nth(2)).toContainText('Good evening');
    await expect(terms.nth(2)).toContainText('Bonsoir');
  });

  test('A1 food lesson exists for en-GB→fr-FR with French vocabulary', async ({ page }) => {
    await page.goto(FOOD_LESSON_URL);
    await expect(page.locator('.lesson__title')).toBeVisible();
    await expect(page.locator('.vocab-item__term').first()).toContainText('water');
    await expect(page.locator('.vocab-item__term').first()).toContainText('eau');
  });
});
