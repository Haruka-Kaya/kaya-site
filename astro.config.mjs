import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
