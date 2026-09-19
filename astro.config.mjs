// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://paruff.github.io',
  base: '/learn-languages',
  output: 'static',
  build: {
    assets: 'assets',
  },
  integrations: [mdx()],
});