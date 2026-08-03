import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTiles;

varying vec2 vUv;

vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263, 0.416, 0.557);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y; // keep circular on wide screens
  vec2 uv0 = uv;
  vec3 finalColor = vec3(0.0);

  uv = uv * uTiles - uPointer;

  float d = length(uv) * exp(-length(uv0));
  vec3 col = palette(length(uv0) + uTime * 0.4);
  d = sin(d * 8.0 + uTime) / 8.0;
  d = abs(d);
  d = pow(0.02 / d, 2.0);
  finalColor += col * d;

  float alpha = clamp(length(finalColor), 0.0, 1.0);
  gl_FragColor = vec4(finalColor, alpha);
}
`;

export interface WaveProps {
  speed?: number;
  tiles?: number;
  mouseInteraction?: boolean;
  /** Track mouse globally (for fixed full-page backgrounds behind content) */
  globalMouseTracking?: boolean;
  disableAnimation?: boolean;
  className?: string;
}

export default function Wave({
  speed = 0.5,
  tiles = 1,
  mouseInteraction = true,
  globalMouseTracking = false,
  disableAnimation = false,
  className = '',
}: WaveProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const targetPointer = useRef({ x: 0, y: 0 });
  const smoothPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let program: Program;

    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      if (program) {
        program.uniforms.uResolution.value = new Float32Array([
          gl.canvas.width,
          gl.canvas.height,
        ]);
      }
    }

    window.addEventListener('resize', resize, false);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height]) },
        uPointer: { value: new Float32Array([0, 0]) },
        uTiles: { value: tiles },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;
    let lastTime = performance.now();

    function update(t: number) {
      animateId = requestAnimationFrame(update);
      const delta = (t - lastTime) * 0.001;
      lastTime = t;

      if (!disableAnimation) {
        program.uniforms.uTime.value += delta * speed;
      }

      const lerpFactor = 0.05;
      smoothPointer.current.x +=
        (targetPointer.current.x - smoothPointer.current.x) * lerpFactor;
      smoothPointer.current.y +=
        (targetPointer.current.y - smoothPointer.current.y) * lerpFactor;

      program.uniforms.uPointer.value[0] = smoothPointer.current.x;
      program.uniforms.uPointer.value[1] = smoothPointer.current.y;
      program.uniforms.uTiles.value = tiles;

      renderer.render({ scene: mesh });
    }

    animateId = requestAnimationFrame(update);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetPointer.current = { x, y };
    }

    const mouseTarget = globalMouseTracking ? window : ctn;
    if (mouseInteraction) {
      mouseTarget.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (mouseInteraction) {
        mouseTarget.removeEventListener('mousemove', handleMouseMove);
      }
      ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [speed, tiles, mouseInteraction, globalMouseTracking, disableAnimation]);

  return (
    <div ref={ctnDom} className={`relative h-full w-full ${className}`} aria-hidden="true" />
  );
}
