import { useEffect, useRef, useState } from 'react';
import '@/infrastructure/styles/process.css';
import type { ProcessCard as ProcessCardType, ProcessTiltedGridProps } from './types';

function ProcessCard({ title, text, action }: Omit<ProcessCardType, 'id'>) {
  return (
    <article className="process-card glass-surface">
      <div className="process-card__content">
        <h3 className="process-card__title">{title}</h3>
        <p className="process-card__text">{text}</p>
      </div>
      <span className="process-card__action">{action}</span>
    </article>
  );
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function ProcessTiltedGrid({ cards }: ProcessTiltedGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let frame = 0;
    const updateScroll = () => {
      const rect = element.getBoundingClientRect();
      const start = window.innerHeight * 0.9;
      const end = -rect.height * 0.15;
      const ratio = clamp((start - rect.top) / (start - end), 0, 1);
      setProgress(ratio);
    };

    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScroll);
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const leftProgress = clamp(progress / 0.45, 0, 1);
  const rightProgress = clamp((progress - 0.45) / 0.55, 0, 1);

  const leftStyle = {
    transform: `translateY(${140 * (1 - leftProgress)}px)`,
    opacity: leftProgress * 0.94 + 0.06,
  };

  const rightStyle = {
    transform: `translateY(${120 * (1 - rightProgress)}px) scale(${0.96 + rightProgress * 0.04})`,
    opacity: rightProgress,
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x: clamp(y, -8, 8), y: clamp(x, -10, 10) });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={containerRef}
      className="process-tilt"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div className="process-tilt__scene">
        <div className="process-tilt__line" />
        <div className="process-tilt__grid">
          <div className="process-card-wrapper process-card-wrapper--left" style={leftStyle}>
            <ProcessCard title={cards[0].title} text={cards[0].text} action={cards[0].action} />
          </div>
          <div className="process-card-wrapper process-card-wrapper--right" style={rightStyle}>
            <ProcessCard title={cards[1].title} text={cards[1].text} action={cards[1].action} />
          </div>
        </div>
      </div>
    </div>
  );
}
