import type { ReactNode } from 'react';

export type ScrollDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface ScrollAnimatorProps {
  children: ReactNode;
  direction?: ScrollDirection;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}
