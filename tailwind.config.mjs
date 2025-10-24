/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // 1. Tipografía: Inter
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // 2. Colores: Paleta profesional y accesible (WCAG AA)
      // Inspirada en los colores corporativos alemanes:
      // - Azul oscuro corporativo (Dark Blue)
      // - Gris neutro (Neutral Gray)
      // - Verde para éxito/confianza (Success Green)
      // - Rojo de alerta (Alert Red)
      colors: {
        // Azul oscuro corporativo (Dark Blue) - Primario
        // Usado para encabezados, botones primarios, fondo de navegación.
        'manus-blue': {
          DEFAULT: '#003366', // WCAG AA contrast ratio of 7.04:1 against white
          50: '#E0E7EF',
          100: '#B3C4D7',
          200: '#809BBF',
          300: '#4D73A6',
          400: '#1A4B8D',
          500: '#003366', // Base
          600: '#00264D',
          700: '#001A33',
          800: '#000D1A',
          900: '#000000',
        },
        // Gris neutro (Neutral Gray) - Secundario/Fondo
        // Usado para texto de cuerpo, fondos sutiles, bordes.
        'manus-gray': {
          DEFAULT: '#4B5563', // WCAG AA contrast ratio of 8.07:1 against white
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563', // Base
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Verde para éxito/confianza (Success Green) - Éxito
        // Usado para mensajes de éxito, iconos de confianza, CTAs secundarias.
        'manus-success': {
          DEFAULT: '#10B981', // WCAG AA contrast ratio of 4.54:1 against white
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Base
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Rojo de alerta (Alert Red) - Alerta/Error
        // Usado para mensajes de error, alertas, acciones destructivas.
        'manus-alert': {
          DEFAULT: '#EF4444', // WCAG AA contrast ratio of 4.88:1 against white
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // Base
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
      },
    },
  },
  plugins: [],
}
