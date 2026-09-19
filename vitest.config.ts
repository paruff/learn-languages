import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.astro',
        'src/content/**',
        '**/*.d.ts',
        '*.config.*',
        'prettier.config.*',
        'eslint.config.*',
        'src/components/audio-player/**',
        'vitest.integration.setup.ts',
        '.astro/**',
        'src/content.config.ts',
      ],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 80,
        statements: 80,
      },
    },
  },
});
