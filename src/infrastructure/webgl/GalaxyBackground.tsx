import Galaxy from '@/infrastructure/webgl/Galaxy';
import { GALAXY_CONFIG } from '@/infrastructure/lib/galaxy-config';

export default function GalaxyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-dark">
      <Galaxy {...GALAXY_CONFIG} globalMouseTracking />
    </div>
  );
}
