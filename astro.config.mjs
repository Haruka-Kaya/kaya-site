import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://harukakaya.dev',
  output: 'server',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: 'manual',
  },
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
