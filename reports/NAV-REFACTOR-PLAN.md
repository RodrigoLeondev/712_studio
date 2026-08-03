# Plan: Refactor del Navbar con animación de convergencia e idioma

## Objetivo

Transformar el navbar actual para que:
1. Logo y botón de contacto tengan **fondo tipo botón**
2. Al hacer scroll, **todo converja al centro** (logo + botones centrales + contacto + idioma)
3. Agregar **botón de cambio de idioma** (ES/EN)

---

## Estado actual

- **Logo** → texto plano, sin fondo, flotado a la izquierda
- **Nav links** → centrados, texto plano
- **Contacto** → botón con `bg-accent`, flotado a la derecha
- **Scroll** → solo cambia el fondo del `header` (`bg-dark/70 backdrop-blur-md`)

---

## Plan de implementación

### 1. Modificar `Nav.tsx` — Nuevo layout con 3 estados

El layout debe tener **tres estados** controlados por `isScrolled`:

#### Estado `top` (sin scroll)
```
[ LOGO (con bg) ]          [ Inicio | Nosotros | Servicios | Productos | Galería ]          [ Contacto (con bg) | EN ]
     ↑ left                    ↑ center                                                         ↑ right
```

#### Estado `scrolled` (hacia el centro)
```
                              [ LOGO (con bg) | Inicio | Nosotros | Servicios | Productos | Galería | Contacto (con bg) | EN ]
                                   ↑ todo centrado en una sola fila (con bg suave en el contenedor)
```

#### Layout general

Usar un solo contenedor flex. Con `justify-between` en estado `top` y `justify-center` + `gap` en estado `scrolled`. La transición la haces con:

- `translate-x` / `translate-y` en los grupos izquierdo y derecho
- `transition-all duration-500 ease-in-out`
- Opcional: `opacity` para suavizar la aparición central

Estructura de grupos:

```tsx
<header>
  <nav className="flex items-center justify-between ...">
    {/* Grupo Izquierdo: Logo */}
    <div className={`transition-all duration-500 ${isScrolled ? 'translate-x-[calc(50vw-50%)]' : 'translate-x-0'}`}>
      <a className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm ...">
        712
      </a>
    </div>

    {/* Grupo Centro: Nav links */}
    <ul className="hidden md:flex items-center gap-8 ...">
      {/* links */}
    </ul>

    {/* Grupo Derecho: Contacto + Idioma */}
    <div className={`flex items-center gap-3 transition-all duration-500 ${isScrolled ? '-translate-x-[calc(50vw-50%)]' : 'translate-x-0'}`}>
      <a className="rounded-full bg-accent px-5 py-2 ...">Contacto</a>
      <button className="rounded-full border border-white/30 px-3 py-1 text-sm ...">EN</button>
    </div>
  </nav>
</header>
```

> **Nota**: El cálculo exacto de `translate-x` puede requerir ajuste. Una alternativa más simple es usar un wrapper `relative` y hacer `position: absolute` + `left: 50%` con `transform: translateX(-50%)` cuando scrolled.

### 2. Estilos tipo botón para logo y contacto

Aplicar al logo:

```tsx
className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 font-display text-white hover:bg-white/20 transition"
```

El botón de contacto ya tiene estilo de botón; solo ajustar si se desea más consistencia.

### 3. Botón de idioma

Agregar al lado del botón de contacto:

```tsx
<button
  type="button"
  onClick={() => {/* toggle language */}}
  className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm hover:bg-white/20 hover:text-white transition"
  aria-label="Switch language"
>
  EN
</button>
```

#### Manejo de estado de idioma

- Opción A (simple): `useState<'es' | 'en'>` local con un objeto de traducciones inline para los labels del nav.
- Opción B (recomendada a futuro): Context de React (`LanguageContext`) para propagar a todos los componentes.

Para el plan inicial, basta con el estado local y pasar las traducciones como props.

### 4. Lógica de convergencia (versión refinada)

En lugar de `translate-x`, puedes hacer que los grupos izquierdo y derecho se reposicionen con `position: absolute` + `left: 50%` + `transform: translateX(-50%)` cuando `isScrolled === true`.

Pero esto es complejo de mantener. **Recomendación**: usar dos filas distintas que se muestran condicionalmente:

```tsx
{/* Modo top */}
{!isScrolled && (
  <div className="flex items-center justify-between w-full">
    <LogoButton />
    <NavLinks />
    <RightGroup />
  </div>
)}

{/* Modo scrolled */}
{isScrolled && (
  <div className="flex items-center justify-center gap-4 w-full">
    <LogoButton />
    <NavLinks />
    <RightGroup />
  </div>
)}
```

Esto es más fácil de mantener y animar con `animate-presence` o simplemente mostrando/ocultando con transiciones de opacidad.

### 5. Transiciones y animaciones clave

Usar en el `header`:

```css
/* En tailwind */
transition-all duration-500 ease-in-out
```

Para que el cambio de layout sea suave, puedes usar:

```tsx
<div className={`transition-all duration-500 ${
  isScrolled
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 -translate-y-2 pointer-events-none'
}`}>
```

> **Tip**: Para evitar que elementos ocultos sean clickeables, usa `pointer-events-none` y `absolute` para sacarlos del flujo.

### 6. Archivos a modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/islands/Nav.tsx` | Layout con convergencia, botón idioma, estilos tipo botón en logo |
| `src/types/index.ts` | Agregar `locale` a `NavProps` (opcional) |
| `src/utils/constants.ts` | Agregar `NAV_LINKS_EN` con las traducciones |
| `src/pages/index.astro` | Pasar `locale` al Nav si se usa estado global |

### 7. Posibles mejoras futuras

- Persistir idioma en `localStorage`
- Usar `LanguageContext` para propagar a toda la app
- Animación con Framer Motion (si se agrega) en vez de CSS transitions
- Detectar idioma del navegador (`navigator.language`) en el primer render
- Traducir también los textos de las secciones estáticas (Hero, About, etc.)

---

## Resumen de pasos

1. Abrir `Nav.tsx`
2. Agregar estado de idioma (`useState<'es' | 'en'>`)
3. Crear objeto de traducciones (ES/EN) para labels del nav y CTA
4. Modificar layout para que logo tenga fondo tipo botón
5. Agregar botón de idioma al grupo derecho
6. Implementar la convergencia al centro al scrollear (dos layouts condicionales)
7. Agregar transiciones CSS suaves
8. Probar en desktop y mobile
