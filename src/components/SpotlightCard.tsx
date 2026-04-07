import React, { useEffect, useRef } from "react";

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isFocusedRef = useRef(false);

  const rafIdRef = useRef<number | null>(null);
  const pendingClientRef = useRef({ x: 0, y: 0 });

  const scheduleApply = () => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      const card = cardRef.current;
      const overlay = overlayRef.current;
      if (!card || !overlay) return;

      // Read layout at most once per frame and apply via CSS variables (no React re-render).
      const rect = card.getBoundingClientRect();
      overlay.style.setProperty("--spotlight-x", `${pendingClientRef.current.x - rect.left}px`);
      overlay.style.setProperty("--spotlight-y", `${pendingClientRef.current.y - rect.top}px`);
    });
  };

  const setOverlayOpacity = (next: number) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.style.opacity = `${next}`;
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!cardRef.current || isFocusedRef.current) return;
    pendingClientRef.current = { x: e.clientX, y: e.clientY };
    scheduleApply();
  };

  const handleFocus: React.FocusEventHandler<HTMLDivElement> = () => {
    isFocusedRef.current = true;
    setOverlayOpacity(0.6);
  };

  const handleBlur: React.FocusEventHandler<HTMLDivElement> = () => {
    isFocusedRef.current = false;
    setOverlayOpacity(0);
  };

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setOverlayOpacity(0.6);
    pendingClientRef.current = { x: e.clientX, y: e.clientY };
    scheduleApply();
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    setOverlayOpacity(0);
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-neutral-800 bg-neutral-900 overflow-hidden p-8 ${className}`}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          background: `radial-gradient(circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
