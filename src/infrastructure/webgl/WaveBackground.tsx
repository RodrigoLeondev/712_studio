import Wave from '@/infrastructure/webgl/Wave';

export default function WaveBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-dark">
      <Wave speed={0.5} tiles={1} globalMouseTracking />
    </div>
  );
}
