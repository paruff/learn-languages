import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.integration.test.{ts,tsx}'],
    setupFiles: ['./vitest.integration.setup.ts'],
  },
});