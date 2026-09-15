import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://harukakaya.dev',
  output: 'server',
  adapter: vercel(),
  // Keep the content-layer data store where the dev/vitest runtime reads it.
  cacheDir: './.astro/',
  // The CSP in vercel.json forbids inline <script>/<style>; keep every asset external.
  build: { inlineStylesheets: 'never' },
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    react(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/keystatic'),
      i18n: {
        defaultLocale: 'ja',
        locales: { ja: 'ja-JP', en: 'en' },
      },
    }),
  ],
});
