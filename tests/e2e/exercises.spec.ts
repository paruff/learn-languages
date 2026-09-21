import { test, expect } from '@playwright/test';

const EXERCISES_URL = '/learn-languages/en-GB/pt-PT/exercises/A1-GREET-001/';

test.describe('exercises session', () => {
  test('fill-blank and multiple-choice give correct/incorrect feedback, session completes with a tally', async ({
    page,
  }) => {
    await page.goto(EXERCISES_URL);

    const progress = page.locator('#exercises-progress');
    const complete = page.locator('#exercises-complete');

    // Exercise 1: audio (reveal-only, per PR scope — not scored).
    await expect(progress).toHaveText('Exercise 1 of 4');
    await page.locator('.exercise:not([hidden]) .exercise__reveal').click();
    await page.locator('.exercise:not([hidden]) .exercise__next').click();

    // Exercise 2: fill-blank — answer correctly (case-insensitive).
    await expect(progress).toHaveText('Exercise 2 of 4');
    await page.locator('.exercise:not([hidden]) .exercise__input').fill('bom');
    await page.locator('.exercise:not([hidden]) .exercise__form button[type="submit"]').click();
    await expect(page.locator('.exercise:not([hidden]) .exercise__feedback')).toHaveText(
      'Correct!'
    );
    await page.locator('.exercise:not([hidden]) .exercise__next').click();

    // Exercise 3: matching (reveal-only, per PR scope — not scored).
    await expect(progress).toHaveText('Exercise 3 of 4');
    await page.locator('.exercise:not([hidden]) .exercise__reveal').click();
    await page.locator('.exercise:not([hidden]) .exercise__next').click();

    // Exercise 4: multiple-choice — answer incorrectly on purpose.
    await expect(progress).toHaveText('Exercise 4 of 4');
    await page.locator('.exercise:not([hidden]) .exercise__option[data-value="Boa tarde"]').click();
    await expect(page.locator('.exercise:not([hidden]) .exercise__feedback')).toContainText(
      'the answer is "Boa noite"'
    );
    await page.locator('.exercise:not([hidden]) .exercise__next').click();

    // Only the fill-blank counted toward the tally (reveal-only types aren't scored).
    await expect(complete).toBeVisible();
    await expect(complete).toHaveText('Done — 1/4 correct.');
  });

  test('a lesson without exercises does not show the practice-exercises link', async ({ page }) => {
    await page.goto('/learn-languages/en-GB/pt-PT/lessons/A1-FOOD-001/');
    await expect(page.getByRole('link', { name: 'Practice exercises →' })).toHaveCount(0);
  });

  test('a lesson with exercises links to the exercises page', async ({ page }) => {
    await page.goto('/learn-languages/en-GB/pt-PT/lessons/A1-GREET-001/');
    await expect(page.getByRole('link', { name: 'Practice exercises →' })).toHaveAttribute(
      'href',
      EXERCISES_URL
    );
  });
});
