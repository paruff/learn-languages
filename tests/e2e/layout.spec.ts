import { test, expect } from './fixtures';

// Spec U4: the four grade buttons never leave an orphan on a second row.
for (const width of [320, 375, 1280]) {
  test(`grade buttons are even at ${width}px wide (U4)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/learn-languages/en-GB/pt-PT/review/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page.locator('#review-reveal').click();
    const boxes = await page.locator('#review-grades button').evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { y: Math.round(r.top), w: Math.round(r.width) };
      })
    );
    expect(boxes).toHaveLength(4);
    const rows = new Set(boxes.map((b) => b.y)).size;
    // one row, or exactly 2x2: never 3+1
    expect(rows === 1 || rows === 2).toBe(true);
    if (rows === 2) expect(boxes.filter((b) => b.y === boxes[0].y)).toHaveLength(2);
    expect(
      Math.max(...boxes.map((b) => b.w)) - Math.min(...boxes.map((b) => b.w))
    ).toBeLessThanOrEqual(1);
  });
}
