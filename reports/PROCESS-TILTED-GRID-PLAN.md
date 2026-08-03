# Plan de refactor: `Process` como React island en Astro

## Objetivo

Refactorizar el componente `src/domain/studio/Process.astro` para reemplazar la lista de pasos actual por un efecto de "scroll tilted grid" inspirado en Ruixen, pero implementado como un React island en Astro. En lugar de imágenes, se mostrarán dos cards principales:

- Izquierda: `Partnerships (Igualas)`
- Derecha: `One Shots (Proyectos individuales)`

El efecto debe ser suave, moderno y coherente con la experiencia visual del proyecto, usando CSS 3D/tilt y una interfaz interactiva mínima.

## Requisitos clave

- Debe ser un React island en Astro, cargado con `client:load`.
- No debe agregarse una librería externa desconocida sin confirmar; si no existe paquete oficial, se implementa con CSS y JS propios.
- Se mantiene la separación `domain/` vs `infrastructure/`: el componente vivo queda en `domain/studio/`, los estilos y utilidades en `infrastructure/`.
- Se siguen las pautas de `CLAUDE.md`: componentes pequeños, sin clases, composición sobre herencia, uso de tokens de `globals.css`.
- Las cards sustituyen a las imágenes en el efecto tilt.

## Arquitectura propuesta

### 1. `src/domain/studio/Process.astro`

- Mantiene `SectionSurface` y `Container`.
- Sustituye la lista de pasos por el React island `ProcessTiltedGrid`.
- No contiene lógica de tilt; sólo estructura y contenido.

### 2. `src/domain/studio/ProcessTiltedGrid.tsx`

- React island que se exporta por defecto.
- Se renderiza con `client:load` desde `Process.astro`.
- Renderiza un contenedor relativo con dos cards y el efecto tilt aplicado al wrapper.
- Las cards se muestran de manera visible y se desplazan ligeramente con scroll y/o hover.
- Contiene los textos de `Partnerships (Igualas)` y `One Shots (Proyectos individuales)`.

### 3. `src/infrastructure/styles/process.css`

- Define los estilos del grid inclinado y de las cards.
- Contiene el CSS para el efecto de tilt 3D y transiciones suaves.
- Establece estilos de fondo, bordes, texto y sombra en tokens globales.

## Contenido de las cards

### Card izquierda

- Título: `Partnerships (Igualas)`
- Texto:
  - `Colaboración continua para marcas con necesidades recurrentes. Volumen mensual definido y equipo asignado para dar continuidad, respuesta ágil y consistencia durante el periodo.`
- Botón: `A partir de 3 meses`

### Card derecha

- Título: `One Shots (Proyectos individuales)`
- Texto:
  - `Proyectos con alcance definido. Cualquiera de nuestros servicios se puede contratar de forma puntual. Nos integramos en cualquier etapa del proceso o llevamos el proyecto completo de principio a fin.`
- Botón: `Alcance puntual`

## Interacción y animación

- El efecto tilt debe producirse al hacer scroll dentro del contenedor y/o al mover el cursor sobre él.
- El eje de inclinación se puede controlar con `transform: perspective(1200px) rotateX(...) rotateY(...)`.
- Las cards pueden tener una ligera variación de profundidad para reforzar el efecto de grid inclinado.
- En móviles, el efecto debe degradarse a un layout apilado y sin tilt excesivo.
- Usar `prefers-reduced-motion` para desactivar animaciones si el usuario lo solicita.

## Implementación técnica

### React island

- `Process.astro` importará `ProcessTiltedGrid` como componente y lo usará así:

```astro
---
import SectionSurface from '@/infrastructure/ui/SectionSurface.astro';
import Container from '@/infrastructure/ui/Container.astro';
import ProcessTiltedGrid from './ProcessTiltedGrid.tsx';
---

<SectionSurface id="process">
  <Container>
    ...
    <ProcessTiltedGrid client:load />
  </Container>
</SectionSurface>
```

- `ProcessTiltedGrid.tsx` debe ejecutarse como un React island porque consume una librería React de efectos de tilt.

- `ProcessTiltedGrid.tsx` debe ser un componente React simple que importa `process.css`.
- El estado en React puede ser mínimo (`hovered`, `tiltX`, `tiltY`) o incluso sólo `useEffect` para bindear el `mousemove` al contenedor.

### Instalación de la librería React

1. Identificar el paquete correcto de React para el efecto tilt (por ejemplo, `@ruixen/scroll-tilted-grid` o el nombre oficial de la librería).
2. Instalar la dependencia en el proyecto Astro:

```bash
npm install @ruixen/scroll-tilted-grid
```

3. Si la librería no existe o no es compatible, usar una implementación propia con CSS y React.

4. Confirmar que el proyecto tenga React instalado y listo para React islands (ya está presente en este proyecto con `react` y `react-dom`).

### Estilos

- `src/infrastructure/styles/process.css` debe incluir:
  - `.process-tilt-wrapper` con `perspective` y `transform-style: preserve-3d`.
  - `.process-grid` con `display: grid`, `grid-template-columns: repeat(2, minmax(0, 1fr))` y separación.
  - `.process-card` con `backdrop-filter`, `border`, `box-shadow`, `border-radius`, `padding`, y transiciones.
  - Variantes `:hover` y `:focus-visible` para el efecto de profundidad.

## Camino del refactor

1. Crear el archivo `src/domain/studio/ProcessTiltedGrid.tsx` como island React.
2. Crear o actualizar `src/infrastructure/styles/process.css`.
3. Modificar `src/domain/studio/Process.astro` para usar el nuevo island.
4. Probar en el browser con `npm run dev` y ajustar responsive y motion.
5. Validar con `prefers-reduced-motion` y accesibilidad.

## Priorización y riesgos

- Prioridad alta: mantener la interfaz como un componente de negocio en `domain/studio/`.
- Riesgo: no usar librería externa no documentada. Si el paquete no existe, la solución es una implementación propia de tilt.
- Riesgo de performance: usar `requestAnimationFrame` con moderación si se hace seguimiento de cursor.

## Resultado esperado

- Un `Process` visualmente moderno y dinámico.
- Dos cards en lugar de imágenes, con texto editorial claro.
- Efecto de grid inclinado basado en CSS y React island.
- Componentes pequeños, reutilizables y fáciles de mantener.

## Checklist

- [ ] `src/domain/studio/Process.astro` actualizado
- [ ] `src/domain/studio/ProcessTiltedGrid.tsx` añadido
- [ ] `src/infrastructure/styles/process.css` añadido
- [ ] `ProcessTiltedGrid` cargado con `client:load`
- [ ] Contenedor tilt funciona con hover/scroll
- [ ] Responsive mobile sin tilt agresivo
- [ ] `prefers-reduced-motion` soportado
- [ ] Pruebas con `npm run dev` completadas
