// @ts-check
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://712.com',
  integrations: [
    react(),
    icon(),
    compress({
      css: true,
      html: true,
      js: true,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  output: 'static',
  build: {
    assets: '_assets',
  },
});
