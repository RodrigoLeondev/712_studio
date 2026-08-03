# Plan: Componente Services — Semiesfera con Botones en Arco (según CLAUDE.md)

## Resumen

Crear el módulo `Services` con dos columnas:

- **Izquierda**: contenido editorial (título, subtítulo, portafolio y acciones).
- **Derecha**: una visualización estática que muestra una semiesfera central con tres botones principales distribuidos en un arco. Al hacer clic en un botón, se despliegan sus subtipos como nodos "liquid glass".

## Decisiones técnicas

- **No se usará Swiper**: En lugar de un carrusel con tres páginas, se utilizará un contenedor fijo que muestra simultáneamente la semiesfera y los tres botones principales distribuidos en un arco.
- La interactividad se maneja con un pequeño estado en React para mostrar/ocultar los subtipos correspondientes.
- La semiesfera se renderiza como SVG con gradiente radial para efecto 3D.
- Los botones principales se posicionan con coordenadas polares (ángulo de -90° a 90°) mediante `position: absolute`.
- Ubicación: dominio de negocio `src/domain/studio/` — componentes nuevos y modificaciones deben quedar en este directorio siguiendo `CLAUDE.md` (composition over inheritance).
- Interactividad: componente React con estado local para gestionar qué categoría está seleccionada y mostrar sus subtipos.
- Estilos: Tailwind + CSS modular, reutilizando tokens de `globals.css`.

## Arquitectura de componentes

- **`src/domain/studio/Services.astro`** (modificado)
  - Composición: `SectionSurface` > `Container` > grid (2 columnas)
  - Izquierda: `ServicesLeft.astro` (contenido estático)
  - Derecha: `ServicesVisual.tsx` (React con `client:load`) — contiene la semiesfera y la lógica de despliegue

- **`src/domain/studio/ServicesVisual.tsx`** (React)
  - Renderiza un SVG para la semiesfera con gradiente radial.
  - Posiciona los tres botones principales mediante coordenadas polares dentro de un contenedor relativo.
  - Mantiene un estado `selectedCategory` para saber qué botón está activo.
  - Al hacer clic en un botón principal, actualiza el estado y muestra los subtipos correspondientes en un panel (flexible o superpuesto).

- **`src/domain/studio/SubtypesList.tsx`** (React)
  - Recibe la categoría seleccionada y renderiza la lista de subtipos con estilos liquid-glass.
  - Solo muestra visualmente; sin interactividad adicional.

- **`src/domain/studio/ServicesLeft.astro`** (Astro)
  - Renderiza el contenido izquierdo de forma estática (título, subtítulo, portafolio, acciones).

## Assets

- `/public/images/services/` — iconos genéricos para demo (producción, proyecto, diseño) y para subtipos si se desea.

## Instalación

No se necesita Swiper, solo React (si se usa) y las dependencias base de Astro. Las librerías ya están instaladas:

- React 19.2.7
- Tailwind CSS 4.3.1
- Astro 7.0.3

## Estructura y contenido requerido

### Izquierda (contenido)

- **Label**: `Services` (texto uppercase pequeño)
- **Title**: `Servicios`
- **Subtitle**: `En 712 todos los servicios se construyen con estrategia, entendimiento del contexto de negocio, creatividad y ejecución audiovisual dentro de un mismo flujo de trabajo.`
- **Párrafos adicionales**: acorde a la descripción de contexto de negocio
- **Title 2**: `Portafolio`
- **Card con 3 botones de acción** (botones circulares o rectangulares) usando iconos genéricos

### Derecha (visualización estática)

- Semiesfera central (SVG con gradiente radial y sombra)
- 3 botones principales con etiquetas:
  1. Producción audiovisual
  2. Proyectos especiales
  3. Diseño Audiovisual
- Los botones se distribuyen en un arco semicircular (ángulo -90° a 90°) alrededor de la semiesfera.
- Al hacer click en un botón principal se despliega el conjunto de subtipos correspondientes.

### Subtipos (estructura)

- **Producción audiovisual**:
  - Preproducción (concepto, guion, dirección de arte, planeación)
  - Producción de video (contenido digital, campañas, comerciales, on-site)
  - Fotografía (producto, editorial, campañas, on-site)

- **Proyectos especiales**:
  - Proyectos de VR y AR
  - Desarrollo de software / web

- **Diseño audiovisual**:
  - Edición y postproducción de video
  - Motion graphics
  - Diseño gráfico
  - Animación 2D y 3D
  - Modelado 3D
  - Compositing
  - Diseño audiovisual

## Datos de categorías (estructura)

```javascript
const categories = [
  {
    id: 'produccion',
    label: 'Producción audiovisual',
    subtypes: [
      'Preproducción (concepto, guion, dirección de arte, planeación)',
      'Producción de video (contenido digital, campañas, comerciales, on-site)',
      'Fotografía (producto, editorial, campañas, on-site)'
    ]
  },
  {
    id: 'proyectos',
    label: 'Proyectos especiales',
    subtypes: [
      'Proyectos de VR y AR',
      'Desarrollo de software / web'
    ]
  },
  {
    id: 'diseno',
    label: 'Diseño audiovisual',
    subtypes: [
      'Edición y postproducción de video',
      'Motion graphics',
      'Diseño gráfico',
      'Animación 2D y 3D',
      'Modelado 3D',
      'Compositing',
      'Diseño audiovisual'
    ]
  }
];
```

## Visual: semiesfera y disposición de los botones

### Semiesfera

- Se renderiza como un SVG (o `div` con `border-radius` y gradientes CSS) para dar efecto 3D.
- Lleva un gradiente radial y una sombra para profundidad.

**Ejemplo SVG para la semiesfera:**

```html
<svg viewBox="0 0 200 100" class="semisphere">
  <defs>
    <radialGradient id="g" cx="40%" cy="30%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.25"/>
    </radialGradient>
  </defs>
  <ellipse cx="100" cy="60" rx="90" ry="50" fill="url(#g)" />
</svg>
```

### Posicionamiento de botones

Los 3 botones principales se distribuyen en un arco de 180° (desde -90° a 90°) alrededor de la semiesfera. El centro está en `(x: 150, y: 120)` y el radio es de aproximadamente `120px`.

**Ejemplo de cálculo (JS) para posicionar los botones:**

```js
const radius = 120; // px
const center = { x: 150, y: 120 };
const angleStart = -90; // degrees
const angleEnd = 90;
const step = (angleEnd - angleStart) / (buttons.length - 1);
buttons.forEach((btn, i) => {
  const angle = (angleStart + step * i) * (Math.PI / 180);
  const x = center.x + Math.cos(angle) * radius;
  const y = center.y + Math.sin(angle) * radius;
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
});
```

### Interacción

Al hacer clic en un botón principal:
- Se resalta el botón (cambio de color, escala o borde).
- Los subtipos aparecen en un panel flotante (puede estar debajo de la semiesfera o superpuesto) con animación de entrada (fade + `translateY`).

### Subtipos

Se muestran como botones con `backdrop-filter: blur(6px)` (liquid glass), borde sutil y sombra. No tienen acción al hacer clic.

### Responsive

En pantallas pequeñas, apilar la semiesfera y los botones verticalmente; en lugar de posicionamiento absoluto usar `grid`/`flex` para mantener legibilidad.

## Estética y comportamiento

- **Botones de subtipos**: fondo semitransparente, `backdrop-filter: blur(6px)` (liquid glass), borde sutil y sombra difusa; texto claro.
- **Botones principales**: con gradiente sutil, `backdrop-filter: blur(4px)`, borde con color del acento, y animación al pasar el mouse (scale, glow).
- **Animación**: al desplegar subtipos, animar entrada con `transform: translateY(8px) + opacity` y al hacer click en un subtipo un pulso rápido.
- **Integración con la red neuronal**: opcionalmente reproducir un pequeño pulso en el nodo del `AboutNetwork` asociado al subtipo si se desea coherencia visual.

## Accesibilidad

- `prefers-reduced-motion`: desactivar animaciones de entrada; mantener interacción por click.
- Navegación por teclado: los botones principales deben ser accesibles con `Tab` y activarse con `Enter`/`Space`.
- Roles ARIA: `role="button"` en elementos no-botón, `aria-expanded` para indicar si los subtipos están visibles, `aria-label` descriptivos.

## Pruebas y despliegue

Ejecutar `npm run dev`, abrir local y revisar:
- Visual en desktop: dos columnas, left content + right visualización estática
- Interacciones: clic en botón principal muestra/oculta sus subtipos con animación
- Mobile: la semiesfera y botones se apilan o reposicionan; la columna izquierda se apila encima/abajo según diseño móvil

## Estimación de tiempo

- Implementar layout y semiesfera SVG: 20 minutos
- Lógica de estado y posicionamiento de botones: 30 minutos
- Estilos liquid-glass y animaciones: 20 minutos
- Accesibilidad, pruebas y ajustes: 15 minutos
- **Total**: ~85 minutos

## Checklist de entrega

- [ ] `src/domain/studio/Services.astro` actualizado
- [ ] `src/domain/studio/ServicesVisual.tsx` añadido
- [ ] `src/domain/studio/SubtypesList.tsx` añadido
- [ ] `src/domain/studio/ServicesLeft.astro` añadido (contenido izquierdo)
- [ ] `/public/images/services/*` assets placeholder
- [ ] Estilos `src/infrastructure/styles/services.css` añadidos
- [ ] Pruebas `npm run dev`: despliegue de subtipos, navegación, responsividad

## Notas según CLAUDE.md

- Mantener componentes en `domain/` y reutilizar `infrastructure/ui` (Card, Container, SectionSurface).
- Composición: `ServicesLeft` (estático) + `ServicesVisual` (interactivo React) compuestos dentro de `Services.astro`.
- No usar soluciones con clases o patrones anti-SOLID; mantener componentes pequeños y composables.
- Sin dependencias nuevas: uso solo CSS, SVG y React nativo (ya instalado).

---

¿Deseas que implemente ya el código siguiendo esta arquitectura?
