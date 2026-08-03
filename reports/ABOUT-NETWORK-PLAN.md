# Plan de implementación — About (Network + Content + Clientes)

Objetivo

Crear la vista "About" dividida en dos columnas: izquierda con la visualización de la red neuronal (ya implementada en `src/domain/studio/AboutNetwork.astro`) y derecha con el contenido editorial (título, texto revisado) y un componente de clientes/carousel.

Requisitos de arquitectura (basado en CLAUDE.md)

- El trabajo queda en `domain/studio/` (componente de negocio).
- Reutilizar infraestructuras de `infrastructure/` si es necesario (Container, SectionSurface, utils), no al revés.
- Mantener KISS: evitar dependencias externas nuevas; usar CSS/SMIL/JS ligero.
- Componentes pequeños y con responsabilidad única.

Plan en pasos

1) Actualizar `About.astro` (composición)
- Reemplazar el título por: **Discover our identity** o en castellano según el diseño: "Discover Our Identity".
- Reemplazar el párrafo principal por el texto proporcionado:
  "Operamos como un equipo que piensa y ejecuta, integrando criterio estratégico y producción dentro del mismo proceso.

  Esto nos permite trabajar con calidad, claridad y velocidad, mantener consistencia en cada entrega y responder a las necesidades de cada proyecto con comunicación clara.

  Funcionamos como una extensión del equipo del cliente para llevar cada proyecto desde la idea hasta la entrega final."
- Mantener `SectionSurface` y `Container` para consistencia.

2) Crear `AboutContent.astro` en `src/domain/studio/` (lado derecho)
- Componente puro .astro que recibe props opcionales (e.g., `title?`, `content?`) y renderiza:
  - Header (label + title)
  - Párrafos
  - CTA buttons (si aplica)
  - Componente `ClientsCarousel` (punto 3)
- Export default para facilitar uso desde `About.astro`.

3) Crear `ClientsCarousel.astro` en `src/domain/studio/` o `src/domain/social-proof/` según reusabilidad
- Implementación mínima sin librerías: un contenedor con `overflow: hidden` y un fila flex que se desplaza vía CSS animation (loop) o JS para control (pausa hover).
- Fallback accesible: lista no animada si `prefers-reduced-motion`.
- Usar logos desde `/public/images/clients/`.

4) Añadir assets placeholder
- Añadir varios SVG en `/public/images/clients/` (logos monocromos) para el demo.

5) Integración en `About.astro`
- Colocar `AboutNetwork` en la columna izquierda y `AboutContent` a la derecha. En móviles, apilar: primero la imagen (izquierda) o según diseño (mobile-first).
- Ajustar clases Tailwind existentes para márgenes, max-widths y tamaños responsivos.

6) Accesibilidad y performance
- `prefers-reduced-motion` para detener animaciones (trail y carousel).
- Lazy-load de imágenes cuando haga falta (atributo `loading="lazy"` en imágenes <img> si se usan).

7) Revisión y pruebas
- Ejecutar `npm run dev`, verificar en Chrome/Firefox que la sección About muestra el SVG animado a la izquierda y el contenido a la derecha.
- Verificar consola por 404 (fonts, imágenes) y corregir rutas si faltan.

Entregables

- `src/domain/studio/About.astro` (actualizado) — composición final
- `src/domain/studio/AboutContent.astro` — nuevo componente del lado derecho
- `src/domain/studio/ClientsCarousel.astro` — nuevo componente carousel
- `/public/images/clients/*.svg` — logos placeholder
- Actualizaciones menores en `src/infrastructure/styles/*` si es necesario para estilos específicos

Estimación de trabajo

- Implementación base (sin pulidos): 30–60 minutos
- Pulido responsivo + accesibilidad: 30 minutos
- Revisión final y testing: 15–30 minutos

---

Plan generado conforme a CLAUDE.md: dominio `studio` para componentes de negocio, composición sobre herencia, KISS y sin dependencias nuevas.
