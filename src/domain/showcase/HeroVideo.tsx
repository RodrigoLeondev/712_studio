import { useEffect, useRef, useState } from 'react';
import type { HeroVideoProps } from '@/domain/showcase/types';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function HeroVideo({ videoUrl }: HeroVideoProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Muted autoplay + no controls → no big play button while it morphs.
  const videoId = videoUrl.match(/embed\/([^?&/]+)/)?.[1] ?? '';
  const params = new URLSearchParams({
    enablejsapi: '1',
    autoplay: '1',
    mute: '1',
    controls: '0',
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
    loop: '1',
    ...(videoId ? { playlist: videoId } : {}),
  });
  const embedUrl = `${videoUrl.split('?')[0]}?${params.toString()}`;

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const postMessage = (action: 'playVideo' | 'pauseVideo') => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: action, args: '' }),
        '*',
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => postMessage(entry.isIntersecting ? 'playVideo' : 'pauseVideo'),
      { threshold: 0.3 },
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);

    let frame = 0;
    const updateProgress = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const ratio = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      setProgress(ratio);
    };

    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateProgress);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const p = reduced ? 1 : progress;
  const translateY = (1 - p) * 320;
  const rotateX = (1 - p) * 18;
  const scaleValue = 0.92 + p * (1 - 0.92);

  return (
    <div ref={trackRef} className="relative w-full min-h-[200vh] -mt-[45vh]">
      <div className="sticky top-0 h-screen overflow-hidden perspective-[1000px]">
        <div
          ref={wrapperRef}
          className="absolute left-1/2 top-1/2 will-change-transform"
          style={{
            width: 'min(80vw, 1150px)',
            transform: `translate(-50%, -50%) translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scaleValue})`,
          }}
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-light/10 bg-secondary/40 shadow-2xl"
            style={{ aspectRatio: '16/9' }}
          >
            <iframe
              ref={iframeRef}
              className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
