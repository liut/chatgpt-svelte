import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  server: {
    port: 5001,
    proxy: {
      '/api': 'http://localhost:3002',
      '/auth': 'http://localhost:3002'
    }
  }
});
