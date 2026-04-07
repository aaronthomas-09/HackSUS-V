import { useEffect, useRef } from "react";

interface GraphProps {
  gridSpacing?: number;
  mouseRadius?: number;
}

export default function GraphNetwork({ 
  gridSpacing = 60, 
  mouseRadius = 300 
}: GraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", onMouseMove);
    handleResize();

    const drawGrid = (color: string | CanvasGradient, lineWidth: number) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      const w = window.innerWidth;
      const h = window.innerHeight;

      for (let x = 0; x <= w; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw the static "Ghost" grid (Very faint)
      drawGrid("rgb(255, 0, 0)", 0.5);

      // 2. Create a radial gradient at the mouse position
      const gradient = ctx.createRadialGradient(
        mouse.current.x, mouse.current.y, 0,
        mouse.current.x, mouse.current.y, mouseRadius
      );
      
      // Center is AstraX Red, outside is transparent
      gradient.addColorStop(0, "rgb(255, 0, 93)"); 
      gradient.addColorStop(1, "rgba(255, 4, 0, 0)");

      // 3. Draw the grid again using the gradient (Highlights only around mouse)
      drawGrid(gradient, 1.2);

      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [gridSpacing, mouseRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}