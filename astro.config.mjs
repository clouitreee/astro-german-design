// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
// import robotsTxt from '@astrojs/robots-txt';
// import image from '@astrojs/image';

export default defineConfig({
  site: 'https://www.your-domain.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    icon(),
    react(),
    sitemap(),
    // robotsTxt(),
    // image({ serviceEntryPoint: '@astrojs/image/sharp' })
  ]
});
