import { test, expect } from '@playwright/test';

// Spec M1, M2: after practising, the learner can see retention and build a shareable report.
test('progress shows a retention note and a PII-free session report after a review (M1, M2)', async ({
  page,
}) => {
  await page.goto('/learn-languages/en-GB/pt-PT/review/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.locator('#review-reveal').click();
  await page.locator('#review-grades button[data-quality="3"]').click();

  await page.goto('/learn-languages/en-GB/pt-PT/progress/');
  await expect(page.locator('#retention')).toContainText('Come back a week');
  await page.locator('#report-comment').fill('Clear and quick');
  await page.getByText('See exactly what will be sent').click();
  const preview = page.locator('#report-preview');
  await expect(preview).toContainText('"reviews": 1');
  await expect(preview).toContainText('Clear and quick');
  await expect(page.locator('#report-email')).toHaveAttribute('href', /^mailto:.*body=/);
});
