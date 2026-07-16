import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://felyalabs.github.io/felya-labs-landing-preview',
  base: '/felya-labs-landing-preview/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    format: 'file',
    inlineStylesheets: 'never'
  }
});
