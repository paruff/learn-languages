import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    // `astro preview` daemonizes and exits immediately by default in this
    // Astro version (same background-server model as `astro dev`), which
    // Playwright's process monitor reads as a crash. --ignore-lock is the
    // documented way to skip that lock-file/daemon handoff and run in the
    // foreground instead, which is what webServer's lifecycle needs.
    command: 'npx astro preview --ignore-lock --port 4321',
    url: 'http://localhost:4321/learn-languages/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});