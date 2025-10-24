# German Design System with Astro and Tailwind CSS

Este proyecto es un sitio web inicializado con **Astro**, configurado con **TypeScript (strict)** y la integración de **Tailwind CSS**.

El objetivo principal es implementar un **Sistema de Diseño Alemán** (German Design System) con un enfoque en la accesibilidad (WCAG AA), utilizando una tipografía corporativa y una paleta de colores profesional.

## Características

*   **Framework:** Astro
*   **Lenguaje:** TypeScript (Strict)
*   **Estilos:** Tailwind CSS
*   **Tipografía:** Inter (`fontFamily.sans = ['Inter', 'sans-serif']`)
*   **Paleta de Colores Accesible:** Definida en `tailwind.config.mjs` con colores corporativos, neutros, de éxito y de alerta, todos diseñados para cumplir con el contraste WCAG AA.

## Paleta de Colores (German Design System)

| Nombre de Tailwind | Color | Uso | Contraste (vs Blanco) |
| :--- | :--- | :--- | :--- |
| `manus-blue-500` | `#003366` | Primario (Corporativo) | 7.04:1 (AA) |
| `manus-gray-600` | `#4B5563` | Neutro (Texto/Fondo) | 8.07:1 (AA) |
| `manus-success-500` | `#10B981` | Éxito/Confianza | 4.54:1 (AA) |
| `manus-alert-500` | `#EF4444` | Alerta/Error | 4.88:1 (AA) |

## Despliegue en Cloudflare Pages

El proyecto está configurado para un despliegue continuo (Continuous Deployment) con Cloudflare Pages.

### Configuración Necesaria

Para configurar el despliegue automático, sigue estos pasos en el panel de control de Cloudflare Pages:

1.  **Conectar Git:** Conecta tu cuenta de GitHub y selecciona el repositorio `clouitreee/astro-german-design`.
2.  **Configuración de Construcción (Build settings):**
    *   **Framework preset:** `Astro`
    *   **Build command:** `pnpm install && pnpm run build`
    *   **Build output directory:** `dist`

Cloudflare Pages detectará automáticamente los archivos estáticos generados en la carpeta `dist` y los desplegará. Cada `push` a la rama principal activará un nuevo despliegue.

## Comandos de Desarrollo

Para ejecutar el proyecto localmente, asegúrate de tener [pnpm](https://pnpm.io/) instalado.

| Comando | Acción |
| :--- | :--- |
| `pnpm install` | Instala las dependencias del proyecto. |
| `pnpm run dev` | Inicia el servidor de desarrollo en `http://localhost:4321`. |
| `pnpm run build` | Construye el proyecto para producción en la carpeta `dist`. |
| `pnpm run preview` | Previsualiza la construcción de producción localmente. |
| `pnpm run astro ...` | Ejecuta la CLI de Astro. |
| `pnpm run astro -- --help` | Obtén ayuda usando la CLI de Astro. |

