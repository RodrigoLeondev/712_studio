import { useEffect, useRef } from 'react';
import type { ScrollAnimatorProps } from '@/infrastructure/lib/types';
import { SCROLL_DIRECTIONS } from '@/infrastructure/lib/utils/animations';
import { cn } from '@/infrastructure/lib/utils/helpers';

export default function ScrollAnimator({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  threshold = 0.15,
  once = true,
}: ScrollAnimatorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const offset = SCROLL_DIRECTIONS[direction];
    el.style.opacity = '0';
    el.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    el.style.transition = `opacity ${duration}s ease, transform ${duration}s ease`;
    el.style.transitionDelay = `${delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translate(0, 0)';
          if (once) observer.disconnect();
        } else if (!once) {
          el.style.opacity = '0';
          el.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay, duration, threshold, once]);

  return (
    <div ref={ref} className={cn('will-change-transform')}>
      {children}
    </div>
  );
}
