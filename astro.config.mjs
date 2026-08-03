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
      CSS: true,
      HTML: true,
      JavaScript: true,
      // SVGO breaks animated SVGs (collapses nested <g transform> groups that
      // the SMIL <animateTransform> nodes pivot on). Keep SVGs byte-identical.
      SVG: false,
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
