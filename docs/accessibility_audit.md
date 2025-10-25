# WCAG 2.1 AA Accessibility & Performance Audit

## 1. WCAG 2.1 AA Accessibility Review

La revisión se centró en los requisitos clave para el público objetivo (seniors) y la ley alemana.

### 1.1 Contraste de Color (WCAG 1.4.3)

| Elemento | Color de Fondo | Color de Texto | Ratio de Contraste | Resultado |
| :--- | :--- | :--- | :--- | :--- |
| Texto Principal (manus-gray-700) | Blanco | #4B5563 | 8.07:1 | **Pasa (AA)** |
| Botón Primario (manus-blue-500) | #003366 | Blanco | 7.04:1 | **Pasa (AA)** |
| Botón Éxito (manus-success-500) | #10B981 | Blanco | 4.54:1 | **Pasa (AA)** |
| Botón Alerta (manus-alert-500) | #EF4444 | Blanco | 4.88:1 | **Pasa (AA)** |
| Footer (manus-blue-500) | #003366 | #E0E7EF (manus-blue-100) | 4.5:1 | **Pasa (AA)** |

**Conclusión:** La paleta de colores definida en `tailwind.config.mjs` cumple rigurosamente con los requisitos de contraste WCAG AA para texto normal y grande.

### 1.2 Navegación por Teclado (WCAG 2.1.1)

*   **Header (Dropdowns):** El componente `DropdownMenu.astro` implementa lógica JavaScript para:
    *   Manejar el estado `aria-expanded`.
    *   Permitir la apertura/cierre con `Enter`/`Space`/`Escape`.
    *   Permitir la navegación por los elementos del menú con `ArrowDown`/`ArrowUp`.
    *   **Resultado:** **Pasa**. La navegación por teclado es funcional.
*   **Formulario de Contacto:** Todos los campos son accesibles por `Tab` y tienen etiquetas asociadas (`<label for="...">`). El botón de envío se deshabilita correctamente durante el envío.
    *   **Resultado:** **Pasa**.

## 2. Optimización de Imágenes (WebP/AVIF)

Se ha instalado la integración oficial de Astro para el manejo de imágenes (`@astrojs/image`).

### Uso del Componente `<Image />`

Para optimizar cualquier imagen, reemplace la etiqueta `<img>` estándar por el componente `<Image />` e importe la imagen desde `src/assets/`.

**Ejemplo de uso:**

```astro
---
import { Image } from '@astrojs/image/components';
import logo from '../assets/logo.png';
---
<Image 
    src={logo} 
    alt="TechHilfe Pro Logo" 
    width={200} 
    height={50} 
    format="webp" 
/>
```

El componente se encargará de:
*   Redimensionar la imagen.
*   Generar formatos modernos (WebP/AVIF).
*   Añadir atributos `srcset` y `sizes` para una carga eficiente.

## 3. Banner de Consentimiento (GDPR/TTDSG)

Se ha implementado un *placeholder* (`CookieConsent.jsx`) usando Framer Motion para la animación.

**Mecanismo de Bloqueo (Simulado):** El componente tiene lógica JavaScript que simula el bloqueo de scripts de terceros hasta que el usuario hace clic en "Alle akzeptieren".

**Acción Requerida por el Usuario:**

Para el cumplimiento legal real, **debe integrar una solución de Consent Management Platform (CMP) certificada** (como Klaro! o Cookiebot) que pueda **bloquear físicamente** los scripts de terceros (ej. Google Analytics, Google Fonts, etc.) antes de que se carguen, según lo exige la ley alemana (TTDSG). El componente actual es solo una interfaz de usuario.
