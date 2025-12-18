import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [svelte()],
  server: {
    host: process.env.HOST,
    port: parseInt(process.env.PORT || '5173'),
    proxy: {
      '/api': {
        target: `http://${process.env.BACKEND_HOST || 'localhost'}:${process.env.BACKEND_PORT || '3000'}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: [
          'color-functions',
          'if-function',
          'legacy-js-api',
          'global-builtin',
          'import',
        ],
      },
    },
  },
});
