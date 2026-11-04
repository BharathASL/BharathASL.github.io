import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const page = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rolldownOptions: {
      input: {
        main: page('./index.html'),
        projects: page('./projects/index.html'),
      },
    },
  },
});
