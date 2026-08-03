import { useEffect, useRef } from 'react';
import type { HeroContentProps } from '@/domain/showcase/types';
import { COLORS } from '@/infrastructure/lib/constants';
import { scrollToSection } from '@/infrastructure/lib/utils/helpers';

const STEP = 0.12; // seconds between each word
const LOGO_TIME = 0.8; // wait for the logo before the title starts

// Highlighted words in the hero title.
const WORD_COLORS: Record<string, string> = {
  creatividad: COLORS.green,
};
// Phrase highlighted as a contiguous sequence (so the other "de" is untouched).
const PHRASE = ['contexto', 'de', 'negocio'];

export default function HeroContent({
  badgeText,
  title,
  ctaText = 'Learn more',
  ctaLink = '#about',
}: HeroContentProps) {
  const words = title.split(' ');
  const subtitleDelay = LOGO_TIME + words.length * STEP + 0.25;
  const ctaDelay = subtitleDelay + 0.45;

  const clean = words.map((word) => word.toLowerCase().replace(/[.,;:]/g, ''));
  const phraseIndices = new Set<number>();
  for (let i = 0; i <= clean.length - PHRASE.length; i++) {
    if (PHRASE.every((p, j) => clean[i + j] === p)) {
      PHRASE.forEach((_, j) => phraseIndices.add(i + j));
    }
  }
  // Only the second "audiovisual" is purple.
  const audiovisualIndices = clean.reduce<number[]>((acc, word, i) => {
    if (word === 'audiovisual') acc.push(i);
    return acc;
  }, []);
  const purpleIndex = audiovisualIndices[1] ?? -1;

  const colorFor = (i: number) => {
    if (i === purpleIndex) return COLORS.rose;
    if (WORD_COLORS[clean[i]]) return WORD_COLORS[clean[i]];
    if (phraseIndices.has(i)) return COLORS.redOrange;
    return COLORS.white;
  };

  const logoWrapRef = useRef<HTMLDivElement>(null);

  // Fade the hero logo out as the page scrolls, handing off to the nav.
  useEffect(() => {
    const onScroll = () => {
      const el = logoWrapRef.current;
      if (!el) return;
      el.style.opacity = String(Math.max(0, 1 - window.scrollY / 220));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="hero-anim relative z-10 flex flex-col items-center text-center">
      <div ref={logoWrapRef} className="mb-12 will-change-[opacity]">
        <img
          data-hero-logo
          src="/images/Logo_SieteDoce.svg"
          alt={badgeText || '712'}
          className="h-16 w-auto sm:h-20"
          style={{ opacity: 0, animation: 'fadeIn 0.8s ease forwards' }}
        />
      </div>

      <h1 className="mx-auto max-w-6xl font-display text-3xl text-white sm:text-3xl lg:text-5xl">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block"
            style={{
              marginRight: '0.25em',
              color: colorFor(i),
              opacity: 0,
              animation: 'slideUp 0.5s ease forwards',
              animationDelay: `${LOGO_TIME + i * STEP}s`,
            }}
          >
            {word}
          </span>
        ))}
      </h1>
      
      {ctaText && (
        <a
          href={ctaLink}
          className="mt-10 inline-flex rounded-full px-8 py-4 text-base font-medium text-white transition hover:scale-105"
          style={{
            backgroundColor: COLORS.purple,
            opacity: 0,
            animation: 'slideUp 0.6s ease forwards',
            animationDelay: `${ctaDelay}s`,
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(ctaLink);
          }}
        >
          {ctaText}
        </a>
      )}
    </div>
  );
}
