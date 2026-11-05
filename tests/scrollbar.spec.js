import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const fakeGpu = readFileSync(new URL('./support/fake-gpu.js', import.meta.url), 'utf8');

// Desktop browsers on Windows and Linux show a scrollbar that takes up width. With the 3D loader running,
// anything measured while it locked scrolling used to end up one scrollbar too wide and scroll sideways.
test('no sideways scroll with a visible scrollbar and the 3D loader', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'scrollbars', 'Needs the project that shows scrollbars');
  await page.addInitScript(fakeGpu);
  await page.goto('/');
  await expect(page.locator('main')).toHaveClass(/is-ready/, { timeout: 30_000 });
  await expect(page.locator('.scene-layer canvas')).toBeAttached();
  // Wait until the loader has gone and scrolling is unlocked, which is when the scrollbar comes back.
  await expect(page.locator('.loader')).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator('html')).not.toHaveClass(/is-loading/);

  const scrollbar = await page.evaluate(() => window.innerWidth - document.documentElement.clientWidth);
  expect(scrollbar).toBeGreaterThan(0);

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 600) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(150);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `sideways overflow at scroll position ${y}`).toBeLessThanOrEqual(0);
  }
});
