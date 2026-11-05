import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

// Turns the 3D scene on in browsers without a graphics card, so tests also cover the page with the canvas.
const fakeGpu = readFileSync(new URL('./support/fake-gpu.js', import.meta.url), 'utf8');
// Turns it off. CI's WebKit has no graphics card but does not say so, and drawing the 3D scene on the CPU makes
// every step very slow, so tests about layout and scrolling run without it.
const noWebgl = readFileSync(new URL('./support/no-webgl.js', import.meta.url), 'utf8');

const THEMES = ['dark', 'light'];

// Collects page errors and console errors, so a test can check none happened.
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  return errors;
}

// Starts with a theme, on the first load only, so a reload still shows what the visitor picked.
async function startWithTheme(page, theme) {
  await page.addInitScript((value) => {
    if (sessionStorage.getItem('test-theme-set')) return;
    localStorage.setItem('theme', value);
    sessionStorage.setItem('test-theme-set', '1');
  }, theme);
}

async function openHome(page, theme) {
  await page.addInitScript(noWebgl);
  await startWithTheme(page, theme);
  await page.goto('/');
  await expect(page.locator('main')).toHaveClass(/is-ready/, { timeout: 30_000 });
}

const hiddenReveals = (page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter((element) => getComputedStyle(element).opacity === '0')
        .length,
  );

// WebKit on CI draws on the CPU and is several times slower, so it gets longer to finish each step.
const patience = (browserName) => (browserName === 'webkit' ? 2 : 1);

// Waits until the page stops changing height, so a scroll is not measured while the layout is still settling.
const settled = (page) =>
  page.waitForFunction(
    () =>
      new Promise((resolve) => {
        const height = document.documentElement.scrollHeight;
        setTimeout(() => resolve(document.documentElement.scrollHeight === height), 300);
      }),
    null,
    { timeout: 20_000, polling: 'raf' },
  );

const noSidewaysScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

for (const theme of THEMES) {
  test.describe(`${theme} theme`, () => {
    test('home page loads with every section', async ({ page }) => {
      const errors = watchErrors(page);
      await openHome(page, theme);

      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Bharath S');
      for (const id of ['about', 'services', 'career', 'work', 'stack', 'contact']) {
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }
      // Either the 3D character or its image stand-in is on the page.
      await expect(page.locator('.scene-layer canvas, .scene__fallback').first()).toBeAttached();
      expect(await noSidewaysScroll(page)).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });

    test('everything is visible after scrolling through', async ({ page, browserName }) => {
      test.slow(browserName === 'webkit');
      await openHome(page, theme);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      // Bigger steps in WebKit: fewer scroll events for its slow CPU drawing, and sections above the screen
      // count as seen anyway.
      const step = browserName === 'webkit' ? 1000 : 500;
      for (let y = 0; y <= height; y += step) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(browserName === 'webkit' ? 150 : 50);
      }
      // Keep checking rather than waiting a fixed time: slow browsers take longer to finish the animations.
      await expect.poll(() => hiddenReveals(page), { timeout: 15_000 * patience(browserName) }).toBe(0);
      expect(await noSidewaysScroll(page)).toBeLessThanOrEqual(0);
    });

    test('projects page lists projects', async ({ page }) => {
      const errors = watchErrors(page);
      await startWithTheme(page, theme);
      await page.goto('/projects/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.locator('.projects-grid .project-card').count()).toBeGreaterThan(0);
      await expect(page.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
      expect(await noSidewaysScroll(page)).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  });
}

test('jumping straight to the end still reveals the sections skipped over', async ({ page }) => {
  // Reduced motion turns off smooth scrolling, so the jump is instant like an End key or scrollbar drag.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openHome(page, 'dark');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => hiddenReveals(page), { timeout: 15_000 }).toBe(0);
});

test('theme toggle switches and remembers the theme', async ({ page }) => {
  await openHome(page, 'dark');
  const toggle = page.getByRole('button', { name: /switch to light theme/i });
  await expect(toggle).toBeEnabled();
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light', { timeout: 10_000 });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('navigation reaches the contact section', async ({ page, browserName }) => {
  test.slow(browserName === 'webkit');
  await openHome(page, 'dark');
  // Narrow screens use the menu button; tablets and up show the links directly.
  const menu = page.getByRole('button', { name: /open menu/i });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Contact' }).click();
  await expect(page.locator('#contact-title')).toBeInViewport({ timeout: 20_000 * patience(browserName) });
});

for (const path of ['/', '/projects/', '/404.html']) {
  test(`back to top returns to the top of ${path}`, async ({ page, browserName }) => {
    // With the 3D scene on, because its canvas once covered the footer and swallowed the click. That is plain
    // CSS stacking, the same in every engine, so WebKit (very slow with 3D in CI) checks the scrolling without it.
    test.slow(browserName === 'webkit');
    await page.addInitScript(browserName === 'webkit' ? noWebgl : fakeGpu);
    await page.goto(path);
    if (path === '/') {
      await expect(page.locator('main')).toHaveClass(/is-ready/, { timeout: 30_000 });
      await expect(page.locator('.loader')).toHaveCount(0, { timeout: 15_000 });
    }
    const toBottom = () =>
      page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    const backToTop = page.getByRole('contentinfo').getByRole('link', { name: /back to top/i });
    const scrollY = () => page.evaluate(() => window.scrollY);

    // Twice, because clicking again from the bottom must work too. A real click, so nothing may cover the link.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await settled(page);
      await toBottom();
      await expect.poll(scrollY).toBeGreaterThan(0);
      await backToTop.click();
      await expect.poll(scrollY, { timeout: 20_000 * patience(browserName) }).toBeLessThan(5);
      // Let the smooth scroll finish: until it does, Lenis overrides any other scrolling.
      await expect(page.locator('html')).not.toHaveClass(/lenis-scrolling/, {
        timeout: 10_000 * patience(browserName),
      });
    }
  });
}

test('unknown addresses show the 404 page', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/doesn.t exist/);
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
});
