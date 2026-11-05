import { defineConfig, devices } from '@playwright/test';

// Smoke tests across browsers and screen sizes, against the production build.
// Run locally with `npm run test:browsers` (needs `npx playwright install` once).
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // CI runners are small, and WebKit there is slow and can crash when tests share the machine, so run one at a time.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: undefined, viewport: { width: 1366, height: 768 } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
    { name: 'safari', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
    { name: 'wide', use: { ...devices['Desktop Chrome'], viewport: { width: 2560, height: 1440 } } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
    { name: 'iphone', use: { ...devices['iPhone 15'] } },
    // iPad size in Chromium: CI's WebKit draws on the CPU and is too slow at this high-density size to be reliable.
    // WebKit itself is covered by the safari and iphone projects.
    { name: 'tablet', use: { ...devices['iPad (gen 7)'], browserName: 'chromium' } },
    // A desktop with a visible scrollbar and the 3D scene on, at 4K with 150% scaling.
    {
      name: 'scrollbars',
      testMatch: 'scrollbar.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 2560, height: 1300 },
        deviceScaleFactor: 1.5,
        launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] },
      },
    },
  ],
});
