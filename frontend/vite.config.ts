import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For a GitHub Pages PROJECT site (https://username.github.io/repo-name/),
// base must be '/repo-name/'. Set it via the BASE_PATH env var at build time
// (the included GitHub Actions workflow does this automatically), or hardcode
// it below if you prefer.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
