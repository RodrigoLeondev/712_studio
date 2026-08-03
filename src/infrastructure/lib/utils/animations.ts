import type { ScrollDirection } from '@/infrastructure/lib/types';

export const SCROLL_DIRECTIONS: Record<ScrollDirection, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

export const DEFAULT_SCROLL = {
  duration: 0.8,
  delay: 0,
  threshold: 0.15,
  once: true,
} as const;
