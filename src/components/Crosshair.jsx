import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const lerp = (a, b, n) => (1 - n) * a + n * b;

const getMousePos = (e, container) => {
  if (container) {
    const bounds = container.getBoundingClientRect();
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    };
  }
  return { x: e.clientX, y: e.clientY };
};

const Crosshair = ({ color = 'white', containerRef = null, size = 28, gap = 6 }) => {
  const crosshairRef = useRef(null);
  const filterRef = useRef(null);

  let mouse = { x: 0, y: 0 };

  useEffect(() => {
    const el = crosshairRef.current;
    if (!el) return;

    const handleMouseMove = ev => {
      mouse = getMousePos(ev, containerRef?.current);

      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        const outside =
          ev.clientX < bounds.left ||
          ev.clientX > bounds.right ||
          ev.clientY < bounds.top ||
          ev.clientY > bounds.bottom;
        gsap.to(el, { opacity: outside ? 0 : 1, duration: 0.3 });
      }
    };

    const target = containerRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove);

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 }
    };

    gsap.set(el, { opacity: 0 });

    const onFirstMove = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.y;
      gsap.to(el, { duration: 0.9, ease: 'Power3.easeOut', opacity: 1 });
      requestAnimationFrame(render);
      target.removeEventListener('mousemove', onFirstMove);
    };
    target.addEventListener('mousemove', onFirstMove);

    const primitiveValues = { turbulence: 0 };

    const tl = gsap
      .timeline({
        paused: true,
        onStart: () => {
          el.style.filter = `url(#filter-noise-crosshair)`;
        },
        onUpdate: () => {
          if (filterRef.current) {
            filterRef.current.setAttribute('baseFrequency', primitiveValues.turbulence);
          }
        },
        onComplete: () => {
          el.style.filter = 'none';
        }
      })
      .to(primitiveValues, {
        duration: 0.5,
        ease: 'power1',
        startAt: { turbulence: 1 },
        turbulence: 0
      });

    const enter = () => tl.restart();
    const leave = () => tl.progress(1).kill();

    const render = () => {
      renderedStyles.tx.current = mouse.x;
      renderedStyles.ty.current = mouse.y;

      for (const key in renderedStyles) {
        renderedStyles[key].previous = lerp(
          renderedStyles[key].previous,
          renderedStyles[key].current,
          renderedStyles[key].amt
        );
      }

      gsap.set(el, {
        x: renderedStyles.tx.previous,
        y: renderedStyles.ty.previous
      });

      requestAnimationFrame(render);
    };

    const links = containerRef?.current
      ? containerRef.current.querySelectorAll('a')
      : document.querySelectorAll('a');

    links.forEach(link => {
      link.addEventListener('mouseenter', enter);
      link.addEventListener('mouseleave', leave);
    });

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mousemove', onFirstMove);
      links.forEach(link => {
        link.removeEventListener('mouseenter', enter);
        link.removeEventListener('mouseleave', leave);
      });
    };
  }, [containerRef, size, gap]);

  const arm = (size - gap) / 2;

  return (
    <div
      style={{
        position: containerRef ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10000,
        overflow: 'hidden'
      }}
    >
      {/* SVG filter for noise distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="filter-noise-crosshair">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>

      {/* Crosshair element */}
      <div
        ref={crosshairRef}
        style={{
          position: 'absolute',
          top: -size / 2,
          left: -size / 2,
          width: size,
          height: size,
          pointerEvents: 'none',
          opacity: 0
        }}
      >
        {/* Top arm */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 1,
            height: arm,
            background: color,
            transform: 'translateX(-50%)'
          }}
        />
        {/* Bottom arm */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: 1,
            height: arm,
            background: color,
            transform: 'translateX(-50%)'
          }}
        />
        {/* Left arm */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            height: 1,
            width: arm,
            background: color,
            transform: 'translateY(-50%)'
          }}
        />
        {/* Right arm */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            height: 1,
            width: arm,
            background: color,
            transform: 'translateY(-50%)'
          }}
        />
      </div>
    </div>
  );
};

export default Crosshair;
