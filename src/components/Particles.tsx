import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

import './Particles.css';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  hoverMode?: "container" | "window";
  particleHoverFactor?: number;
  moveParticlesOnDeviceOrientation?: boolean;
  deviceOrientationFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
  maxFps?: number;
  pauseOnScroll?: boolean;
  className?: string;
}

const defaultColors: string[] = ['#ffffff', '#ffffff', '#ffffff'];

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;
    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }
    
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    vec3 shimmer = 0.2 * max(sin(uv.yxx + uTime + vRandom.y * 6.28), 0.0);
    vec3 color = clamp(vColor + shimmer, 0.0, 1.0);
    
    if (uAlphaParticles < 0.5) {
      if (d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(color, 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d);
      gl_FragColor = vec4(color, circle);
    }
  }
`;

const Particles: React.FC<ParticlesProps> = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  hoverMode = "container",
  particleHoverFactor = 1,
  moveParticlesOnDeviceOrientation = false,
  deviceOrientationFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  maxFps = 60,
  pauseOnScroll = false,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Frame-driven smoothing: event updates targets; RAF lerps current towards target.
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRectRef = useRef<DOMRect | null>(null);
  const orientationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orientationTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: pixelRatio,
      depth: false,
      alpha: true
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    let rectRafId = 0;
    const updateContainerRect = () => {
      containerRectRef.current = container.getBoundingClientRect();
    };

    const scheduleRectUpdate = () => {
      if (rectRafId) return;
      rectRafId = requestAnimationFrame(() => {
        rectRafId = 0;
        updateContainerRect();
      });
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };

    window.addEventListener('resize', resize, false);
    resize();
    updateContainerRect();

    let mouseEventRafId = 0;
    let pendingMouseClientX = 0;
    let pendingMouseClientY = 0;
    let hasPendingMouseEvent = false;

    const flushMouseMove = () => {
      mouseEventRafId = 0;
      if (!hasPendingMouseEvent) return;
      hasPendingMouseEvent = false;
      const rect = containerRectRef.current ?? container.getBoundingClientRect();
      containerRectRef.current = rect;
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = ((pendingMouseClientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((pendingMouseClientY - rect.top) / rect.height) * 2 - 1);
      mouseTargetRef.current = { x, y };
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingMouseClientX = e.clientX;
      pendingMouseClientY = e.clientY;
      hasPendingMouseEvent = true;
      if (mouseEventRafId) return;
      mouseEventRafId = requestAnimationFrame(flushMouseMove);
    };

    if (moveParticlesOnHover) {
      const target: EventTarget = hoverMode === "window" ? window : container;
      target.addEventListener("mousemove", handleMouseMove as EventListener, { passive: true });
    }

    const setOrientation = (gamma: number | null | undefined, beta: number | null | undefined) => {
      const gx = Math.max(-1, Math.min(1, (gamma ?? 0) / 45));
      const by = Math.max(-1, Math.min(1, (beta ?? 0) / 45));
      orientationTargetRef.current = { x: gx, y: -by };
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      setOrientation(e.gamma, e.beta);
    };

    const requestOrientationPermission = async () => {
      const anyOrientation = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

      if (typeof anyOrientation.requestPermission === "function") {
        try {
          const res = await anyOrientation.requestPermission();
          if (res === "granted") {
            window.addEventListener("deviceorientation", handleDeviceOrientation, true);
          }
        } catch {
          // ignore
        }
        return;
      }

      window.addEventListener("deviceorientation", handleDeviceOrientation, true);
    };

    if (moveParticlesOnDeviceOrientation) {
      const onGesture = () => {
        requestOrientationPermission();
        window.removeEventListener("pointerdown", onGesture);
        window.removeEventListener("touchstart", onGesture);
      };
      window.addEventListener("pointerdown", onGesture, { passive: true });
      window.addEventListener("touchstart", onGesture, { passive: true });
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 }
      },
      transparent: true,
      depthTest: false
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId = 0;
    let scrollPauseTimeoutId = 0;
    let isScrollActive = false;
    let lastTime = performance.now();
    let elapsed = 0;
    let frameAccumulator = 0;
    const frameBudget = maxFps > 0 ? 1000 / maxFps : 0;
    const scrollFrameBudget =
      pauseOnScroll && maxFps > 0
        ? Math.max(frameBudget, 1000 / Math.max(24, Math.floor(maxFps * 0.55)))
        : frameBudget;

    const update = (t: number) => {
      const delta = t - lastTime;
      lastTime = t;
      const activeFrameBudget = isScrollActive ? scrollFrameBudget : frameBudget;
      if (activeFrameBudget > 0) {
        frameAccumulator += delta;
        if (frameAccumulator < activeFrameBudget) {
          animationFrameId = requestAnimationFrame(update);
          return;
        }
      }

      const step = activeFrameBudget > 0 ? frameAccumulator : delta;
      frameAccumulator = 0;
      elapsed += step * speed;
      program.uniforms.uTime.value = elapsed * 0.001;

      const mouseLerp = 0.08;
      const orientationLerp = 0.06;

      const nextMouseTarget = moveParticlesOnHover ? mouseTargetRef.current : { x: 0, y: 0 };
      mouseRef.current.x += (nextMouseTarget.x - mouseRef.current.x) * mouseLerp;
      mouseRef.current.y += (nextMouseTarget.y - mouseRef.current.y) * mouseLerp;

      const nextOriTarget = moveParticlesOnDeviceOrientation
        ? orientationTargetRef.current
        : { x: 0, y: 0 };
      orientationRef.current.x += (nextOriTarget.x - orientationRef.current.x) * orientationLerp;
      orientationRef.current.y += (nextOriTarget.y - orientationRef.current.y) * orientationLerp;

      const mouseX = -mouseRef.current.x * particleHoverFactor;
      const mouseY = -mouseRef.current.y * particleHoverFactor;
      const oriX = orientationRef.current.x * deviceOrientationFactor;
      const oriY = orientationRef.current.y * deviceOrientationFactor;

      particles.position.x = mouseX + oriX;
      particles.position.y = mouseY + oriY;

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
      animationFrameId = requestAnimationFrame(update);
    };

    const start = () => {
      if (animationFrameId) return;
      lastTime = performance.now();
      frameAccumulator = 0;
      animationFrameId = requestAnimationFrame(update);
    };

    const stop = () => {
      if (!animationFrameId) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    const handleScroll = () => {
      if (moveParticlesOnHover) {
        scheduleRectUpdate();
      }
      if (!pauseOnScroll) return;

      isScrollActive = true;
      if (scrollPauseTimeoutId) {
        window.clearTimeout(scrollPauseTimeoutId);
      }
      scrollPauseTimeoutId = window.setTimeout(() => {
        scrollPauseTimeoutId = 0;
        isScrollActive = false;
      }, 80);
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
        return;
      }
      start();
    };

    if (moveParticlesOnHover || pauseOnScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility, { passive: true });
    if (!document.hidden) {
      start();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover || pauseOnScroll) {
        window.removeEventListener('scroll', handleScroll);
      }
      if (rectRafId) cancelAnimationFrame(rectRafId);
      if (mouseEventRafId) cancelAnimationFrame(mouseEventRafId);
      if (scrollPauseTimeoutId) window.clearTimeout(scrollPauseTimeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
      if (moveParticlesOnHover) {
        const target: EventTarget = hoverMode === "window" ? window : container;
        target.removeEventListener("mousemove", handleMouseMove as EventListener);
      }
      window.removeEventListener("deviceorientation", handleDeviceOrientation, true);
      stop();
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    hoverMode,
    particleHoverFactor,
    moveParticlesOnDeviceOrientation,
    deviceOrientationFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio,
    maxFps,
    pauseOnScroll
  ]);

  return <div ref={containerRef} className={`particles-container ${className}`} />;
};

export default Particles;
