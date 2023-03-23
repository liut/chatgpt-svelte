import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { markdown } from 'svelte-preprocess-markdown';

const base = process.env.APP_BASE || ''

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    preprocess({
      postcss: true
    }),
    markdown()
  ],

  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: '/index.html'
    }),
    appDir: 'app',
    paths: { base }
  }
};

export default config;
