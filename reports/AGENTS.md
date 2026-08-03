# CLAUDE.md — Arquitectura 712

> Este archivo define las bases arquitectónicas que toda IA debe seguir al desarrollar dentro de este proyecto. Léelo completo antes de escribir cualquier código.

---

## 1. Screaming Architecture

La estructura del proyecto debe **gritar** que esto es un *landing page de un estudio creativo*, no que está hecho con Astro/React/Tailwind.

### Regla de oro

Si alguien mira la jerarquía de carpetas en `src/`, debe entender inmediatamente el **negocio** (domain/showcase, domain/studio, domain/work), no el **framework** (infrastructure/ui, infrastructure/webgl).

### Separación fundamental

El código se divide en dos grandes grupos al mismo nivel dentro de `src/`:

| Carpeta | Contiene | Ejemplo |
|---|---|---|
| `domain/` | Componentes que representan conceptos de negocio | `showcase/HeroContent.tsx` |
| `infrastructure/` | Componentes técnicos reutilizables | `ui/Button.astro`, `webgl/Galaxy.tsx` |
| `pages/` | Páginas (ruteo de Astro) | `index.astro` |

Los componentes de `domain/` **importan** desde `infrastructure/`, pero NUNCA al revés.

### Estructura

```
src/
  # ─── DOMINIOS DE NEGOCIO (gritan qué hace el sitio) ───
  domain/
    showcase/           # Hero + Video — primera impresión
    studio/             # About / Services / Process
    work/               # Portfolio / Gallery
    social-proof/       # Testimonials
    contact/            # Contact Form
    navigation/         # Navbar
    footer/             # Footer

  # ─── INFRAESTRUCTURA TÉCNICA (cómo se implementa) ───
  infrastructure/
    ui/                 # Componentes UI atómicos y reutilizables
    animation/          # Sistema de animación (ScrollAnimator, etc.)
    webgl/              # Galaxy y efectos WebGL
    lib/                # Utilidades puras, constantes, tipos
    styles/             # CSS global, animaciones, componentes
    layouts/            # Layouts de página

  # ─── PÁGINAS ───
  pages/                # Páginas (ruteo de Astro)
```

### Reglas de naming

| Concepto | Convención | Ejemplo |
|---|---|---|
| Carpetas de dominio | `kebab-case` | `social-proof/`, `showcase/` |
| Componentes React | `PascalCase.tsx` | `HeroContent.tsx` |
| Componentes Astro | `PascalCase.astro` | `Services.astro` |
| Utilidades | `camelCase.ts` | `formatPrice.ts` |
| Constantes | `SCREAMING_SNAKE` | `SITE_CONFIG` |
| Tipos/Interfaces | `PascalCase` | `NavLink` |
| Archivo de types por dominio | `types.ts` | `domain/showcase/types.ts` |

---

## 2. Composición sobre Herencia

**No** se usan clases ni herencia de componentes. Todo es composición de funciones y componentes pequeños.

### Patrón correcto

```tsx
// ✅ Composición: componente pequeño y enfocado
function SectionHeader({ label, title }: SectionHeaderProps) {
  return (
    <div className="text-center">
      <p className="text-sm uppercase tracking-widest text-accent">{label}</p>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

// ✅ Uso por composición (dominio importa de infraestructura)
import SectionSurface from '@/infrastructure/ui/SectionSurface';
import Container from '@/infrastructure/ui/Container';

function Services() {
  return (
    <SectionSurface>
      <Container>
        <SectionHeader label="Servicios" title="Lo que hacemos" />
        <ServiceGrid services={services} />
      </Container>
    </SectionSurface>
  );
}
```

### Patrón prohibido

```tsx
// ❌ NO: herencia o clases
class Section extends React.Component { ... }
class ServicesSection extends Section { ... }

// ❌ NO: props spreading genérico sin tipado
function Section(props: any) { ... }
```

---

## 3. SOLID

### S — Single Responsibility

Cada archivo hace **una sola cosa**.

- `SectionHeader.tsx` → solo renderiza el encabezado de sección
- `formatPrice.ts` → solo formatea precios
- `useScrollReveal.ts` → solo lógica de reveal al scroll

**Síntoma de violación:** un archivo que importa de 5+ dominios distintos o tiene múltiples `export` no relacionados.

### O — Open/Closed

Los componentes están **abiertos a extensión vía props, cerrados a modificación**.

```tsx
// ✅ Extensible por composición
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

// ❌ NO: if/else por tipo de botón dentro del componente
// ❌ NO: modificar el componente base para añadir un nuevo caso
```

### L — Liskov Substitution

Las interfaces deben ser **consistentes**. Si un tipo promete una propiedad, todos los usos deben cumplirla.

### I — Interface Segregation

Interfaces **pequeñas y específicas por dominio**, no interfaces gigantes globales.

```tsx
// ✅ Bien: específica del dominio
// domain/showcase/types.ts
interface HeroContentProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

// ❌ Mal: interfaz gigante con todo
interface ComponentProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
  images?: GalleryImage[];
  testimonials?: Testimonial[];
  // ...
}
```

### D — Dependency Inversion

Los componentes de dominio **dependen de abstracciones** (tipos/interfaces), no de implementaciones concretas.

```tsx
// ✅ El componente recibe datos por props, no importa una API
function ProductGrid({ products, categories }: ProductGridProps) {
  // ...
}

// ❌ NO: el componente hace fetch directamente
function ProductGrid() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch('/api/products').then(...) }, []);
  // ...
}
```

---

## 4. DRY (Don't Repeat Yourself)

### Regla de importación (Dependency Inversion)

- `domain/` → puede importar de `infrastructure/` y de `infrastructure/lib/`
- `infrastructure/` → **NUNCA** importa de `domain/`
- `pages/` → importa de ambos (orquesta la composición)

### Qué extraer a `infrastructure/lib/`

- Constantes de negocio (productos, testimonios, servicios)
- Configuración del sitio (colores, tipografía, metadata)
- Helpers puros (formateo, clases condicionales, smooth scroll)

### Qué extraer a `infrastructure/ui/`

- Componentes que aparecen en 2+ secciones distintas
- `Button`, `Card`, `Container`, `SectionHeader`, `SectionSurface`

### Qué NO duplicar

- Estructura de sección (label + title + contenido → ya está en `SectionSurface`)
- Animaciones de entrada (ya está en `ScrollAnimator`)

### Regla práctica

Si copiaste y pegaste el mismo bloque en 2+ archivos, extráelo a un componente compartido. Si son 2+ líneas de JS/TS puro en 2+ archivos, extráelo a `infrastructure/lib/`.

---

## 5. KISS (Keep It Simple, Stupid)

### Preferencias de implementación

| Situación | Solución simple ✅ | Solución compleja ❌ |
|---|---|---|
| Animación al scroll | CSS transitions + IntersectionObserver | GSAP timeline compleja |
| Estado global | Props + lifting state | Context/Redux/Zustand |
| Efecto visual | CSS gradient + blend modes | WebGL (salvo Galaxy) |
| Formulario | useState + validación manual | Librería de forms externa |
| Responsive | Tailwind breakpoints | CSS-in-JS con lógica compleja |

### Checklist KISS

- [ ] ¿Podría esto resolverse con CSS puro?
- [ ] ¿Podría esto ser un componente Astro sin JS?
- [ ] ¿Esta abstracción realmente ahorra más de lo que complica?
- [ ] ¿Un desarrollador nuevo entendería esto sin documentación externa?

---

## 6. Convenciones de Código

### Exports

```tsx
// ✅ Default export para componentes (consistente con Astro)
export default function Nav(props: NavProps) { ... }

// ✅ Named export para utilidades y tipos
export function cn(...) { ... }
export interface NavLink { ... }
```

### Imports

```tsx
// ✅ Orden: externas → internas → tipos
import { useEffect } from 'react';
import { Container } from '@/infrastructure/ui/Container';
import { cn } from '@/infrastructure/lib/utils/helpers';
import type { Testimonial } from '@/infrastructure/lib/types';
```

### Estructura de un componente

```tsx
// 1. Imports
import { useState } from 'react';

// 2. Tipos locales (si son específicos del componente)
interface LocalProps { ... }

// 3. Componente (default export)
export default function MyComponent({ ... }: LocalProps) {
  // 4. Hooks al inicio
  const [state, setState] = useState();

  // 5. Handlers/helpers inline
  const handleClick = () => { ... };

  // 6. Render (un solo return, minimal JSX logic)
  return ( ... );
}
```

### Fragment shaders (WebGL)

Los shaders GLSL se declaran como **constantes string** al inicio del archivo o en archivo separado si exceden 30 líneas.

---

## 7. Patrones Prohibidos

| Patrón | Razón |
|---|---|
| `any` en tipos TypeScript | Rompe el tipado estricto |
| `eslint-disable` / `@ts-ignore` | Oculta problemas |
| Clases de JavaScript | Preferir funciones + composición |
| Librerías externas para cosas simples | KISS violation |
| Componentes con más de 200 líneas | Viola SRP |
| Import relativo profundo (`../../../`) | Usar alias `@/` |
| Efectos secundarios en componentes Astro | Los .astro son puros |
| Mutación directa de props | React: estado inmutable |

---

## 8. Stack Técnico (Actualizar al añadir dependencias)

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Astro | ^7.0 |
| UI interactiva | React | ^19.0 |
| Estilos | Tailwind CSS v4 | ^4.0 |
| Animaciones | CSS + IntersectionObserver | — |
| WebGL | ogl | ^1.0 |
| Build | astro-compress | ^2.0 |

> **IMPORTANTE:** No agregar dependencias sin aprobación explícita. Preferir solución nativa (CSS/JS) antes que librería externa.

---

## 9. Tipografía y CSS

Todas las variables de diseño están definidas en `@theme` dentro de `globals.css`. No hardcodear colores, fuentes o espaciados. Usar las tokens de Tailwind:

```tsx
// ✅ Usar tokens
className="text-accent font-display text-4xl"

// ❌ NO hardcodear
className="text-[#E94560] font-['Playfair_Display'] text-[2.5rem]"
```

---

## 10. Proceso para Desarrollar

1. **Leer este archivo** (CLAUDE.md) completo
2. **Identificar el dominio de negocio** al que pertenece el cambio
3. **Buscar componentes existentes** en `infrastructure/ui/` que puedan componerse
4. **Escribir el componente** en `domain/` correspondiente
5. **Verificar SOLID + DRY + KISS** antes de dar por terminado
6. **No repetir patrones** que ya están implementados en `infrastructure/lib/` o `infrastructure/ui/`
