import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://felya-labs.github.io/felya-website-preview',
  base: '/felya-website-preview/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    format: 'file',
    inlineStylesheets: 'never'
  }
});
