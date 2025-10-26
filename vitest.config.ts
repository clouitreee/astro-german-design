/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    // Opciones de Vitest
    globals: true,
    environment: 'jsdom', // Simular navegador para pruebas de UI
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // Opcional: Configurar UI
    ui: true,
    open: true,
  },
});
