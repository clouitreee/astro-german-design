// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import robotsTxt from '@astrojs/robots-txt';
import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
  // TODO: ¡Reemplazar por el dominio de producción final antes de desplegar!
  site: 'https://www.techhilfepro.de', // Using the remote's value as the placeholder for now
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [icon(), react(), sitemap(), robotsTxt(), image({ serviceEntryPoint: '@astrojs/image/sharp' })]
});
