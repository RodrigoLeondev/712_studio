import { useEffect, useRef, useState } from 'react';
import SubtypesList from './SubtypesList';
import '@/infrastructure/styles/services.css';
import type { ServicesVisualProps } from './types';

const RX = 40; // orbit radius (% of stage width)
const RY = 42; // orbit radius (% of stage height)
const BUTTON_SPEED = 0.25; // radians/second — the planets orbit slowly
const SPHERE_FACTOR = 0.45; // the sun spins slower, in the same direction

export default function ServicesVisual({ categories }: ServicesVisualProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '');
  const [showSubtypes, setShowSubtypes] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [settling, setSettling] = useState(false);
  const [angle, setAngle] = useState(0);
  const [reduced, setReduced] = useState(false);

  const reducedRef = useRef(false);
  reducedRef.current = reduced;
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // One shared angle advances continuously: the planets orbit and the sun
  // spins from it (same direction). It keeps running even while engaged, so
  // the sun stays in motion when the buttons park.
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let raf = 0;
    let last: number | null = null;
    const tick = (t: number) => {
      if (last === null) last = t;
      const dt = (t - last) / 1000;
      last = t;
      if (!reducedRef.current) setAngle((a) => a + dt * BUTTON_SPEED);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleTimer.current);
    };
  }, []);

  const others = categories.filter((category) => category.id !== activeId);
  const isEngaged = engaged || reduced;

  // Orbit while idle; park at center / left / right when engaged.
  const positionOf = (id: string, index: number) => {
    if (isEngaged) {
      if (id === activeId) return { left: 50, top: 50 };
      return others[0]?.id === id ? { left: 12, top: 50 } : { left: 88, top: 50 };
    }
    const a = angle + index * ((2 * Math.PI) / 3);
    return { left: 50 + Math.cos(a) * RX, top: 50 + Math.sin(a) * RY };
  };

  const active = categories.find((category) => category.id === activeId) ?? null;

  const handleClick = (id: string) => {
    if (!isEngaged) return;
    if (id === activeId) setShowSubtypes((current) => !current);
    else {
      setActiveId(id);
      setShowSubtypes(false);
    }
  };

  return (
    <div className="services-visual">
      <div
        className={`services-orbit${isEngaged ? ' is-engaged' : ''}${settling ? ' is-settling' : ''}`}
        onMouseEnter={() => {
          clearTimeout(settleTimer.current);
          setSettling(false);
          setEngaged(true);
        }}
        onMouseLeave={() => {
          setEngaged(false);
          setShowSubtypes(false);
          // Keep the eased transition briefly so buttons glide back to orbit.
          setSettling(true);
          clearTimeout(settleTimer.current);
          settleTimer.current = setTimeout(() => setSettling(false), 800);
        }}
        onTouchStart={() => setEngaged(true)}
      >
        <div className="services-sphere" aria-hidden="true">
          <div
            className="services-sphere__surface"
            style={{ transform: `rotate(${angle * SPHERE_FACTOR}rad)` }}
          />
        </div>

        {categories.map((category, index) => {
          const pos = positionOf(category.id, index);
          const isCenter = isEngaged && category.id === activeId;
          return (
            <button
              key={category.id}
              type="button"
              className={`orbit-node${isCenter ? ' is-center' : ''}`}
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              aria-pressed={isCenter}
              onClick={() => handleClick(category.id)}
            >
              {category.title}
            </button>
          );
        })}
      </div>

      {active && showSubtypes && (
        <div className="orbit-subtypes" role="group" aria-label={active.title}>
          <SubtypesList category={active} />
        </div>
      )}
    </div>
  );
}
