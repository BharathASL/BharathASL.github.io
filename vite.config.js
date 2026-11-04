import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { seoHead } from './scripts/seo-head.js';

export const SITE_URL = 'https://bharathasl.github.io';

const page = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    seoHead({
      siteUrl: SITE_URL,
      siteName: 'Bharath S',
      image: { src: '/social-preview.jpg', width: 1200, height: 630 },
      imageAlt: 'Bharath S, Full-Stack Developer. I build software across web, cloud, data and Android.',
    }),
  ],
  base: '/',
  build: {
    rolldownOptions: {
      input: {
        main: page('./index.html'),
        projects: page('./projects/index.html'),
        notFound: page('./404.html'),
      },
    },
  },
});
