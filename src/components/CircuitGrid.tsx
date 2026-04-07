import { useEffect, useRef, useCallback } from "react";

interface CircuitGridProps {
    gridSpacing?: number;
    mouseRadius?: number;
    ghostColor?: string;
    glowColor?: string;
    glowColorEnd?: string;
    traceHighlight?: string;
    traceDim?: string;
    nodeActiveColor?: string;
    nodePassiveColor?: string;
    nodeGlowColor?: string;
    activeDotColor?: string;
}

export default function CircuitGrid({
    gridSpacing = 50,
    mouseRadius = 280,
    ghostColor = "rgba(255, 49, 46, 0.08)",
    glowColor = "rgba(255, 49, 46, 0.7)",
    glowColorEnd = "rgba(255, 49, 46, 0)",
    traceHighlight = "rgba(255, 49, 46,",
    traceDim = "rgba(255, 49, 46, 0.03)",
    nodeActiveColor = "rgba(255, 80, 60,",
    nodePassiveColor = "rgba(255, 49, 46,",
    nodeGlowColor = "rgba(255, 49, 46,",
    activeDotColor = "rgba(255, 80, 60, 0.06)",
}: CircuitGridProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mouse = useRef({ x: -1000, y: -1000 });
    const tracesRef = useRef<
        { x1: number; y1: number; x2: number; y2: number }[]
    >([]);
    const nodesRef = useRef<{ x: number; y: number; active: boolean }[]>([]);

    const generateTraces = useCallback(
        (w: number, h: number) => {
            const traces: { x1: number; y1: number; x2: number; y2: number }[] = [];
            const nodes: { x: number; y: number; active: boolean }[] = [];
            const cols = Math.floor(w / gridSpacing);
            const rows = Math.floor(h / gridSpacing);

            for (let col = 0; col <= cols; col++) {
                for (let row = 0; row <= rows; row++) {
                    if (Math.random() < 0.15) {
                        nodes.push({
                            x: col * gridSpacing,
                            y: row * gridSpacing,
                            active: Math.random() < 0.3,
                        });
                    }
                }
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = Math.abs(nodes[i].x - nodes[j].x);
                    const dy = Math.abs(nodes[i].y - nodes[j].y);
                    if (
                        (dx === 0 && dy <= gridSpacing * 3 && dy > 0) ||
                        (dy === 0 && dx <= gridSpacing * 3 && dx > 0)
                    ) {
                        if (Math.random() < 0.4) {
                            traces.push({
                                x1: nodes[i].x,
                                y1: nodes[i].y,
                                x2: nodes[j].x,
                                y2: nodes[j].y,
                            });
                        }
                    }
                }
            }

            tracesRef.current = traces;
            nodesRef.current = nodes;
        },
        [gridSpacing]
    );

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
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            generateTraces(window.innerWidth, window.innerHeight);
        };

        const onMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", onMouseMove);
        handleResize();

        const drawGrid = (
            color: string | CanvasGradient,
            lineWidth: number
        ) => {
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
            const mx = mouse.current.x;
            const my = mouse.current.y;

            // 1. Static ghost grid (very faint red)
            drawGrid(ghostColor, 0.4);

            // 2. Radial gradient glow grid near mouse
            const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, mouseRadius);
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(1, glowColorEnd);
            drawGrid(gradient, 1.0);

            // 3. Draw PCB traces that glow near mouse
            for (const trace of tracesRef.current) {
                const tcx = (trace.x1 + trace.x2) / 2;
                const tcy = (trace.y1 + trace.y2) / 2;
                const dist = Math.hypot(tcx - mx, tcy - my);
                const proximity = Math.max(0, 1 - dist / (mouseRadius * 1.2));

                if (proximity > 0) {
                    ctx.beginPath();
                    ctx.strokeStyle = `${traceHighlight} ${0.1 + proximity * 0.5})`;
                    ctx.lineWidth = 1.5 + proximity * 1.5;
                    ctx.moveTo(trace.x1, trace.y1);
                    ctx.lineTo(trace.x2, trace.y2);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.strokeStyle = traceDim;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(trace.x1, trace.y1);
                    ctx.lineTo(trace.x2, trace.y2);
                    ctx.stroke();
                }
            }

            // 4. Draw solder pad nodes at grid intersections near cursor
            for (const node of nodesRef.current) {
                const dist = Math.hypot(node.x - mx, node.y - my);
                const proximity = Math.max(0, 1 - dist / mouseRadius);

                if (proximity > 0.05) {
                    // Outer glow
                    ctx.beginPath();
                    ctx.fillStyle = `${nodeGlowColor} ${proximity * 0.15})`;
                    ctx.arc(node.x, node.y, 6 + proximity * 4, 0, Math.PI * 2);
                    ctx.fill();

                    // Inner solder pad
                    ctx.beginPath();
                    ctx.fillStyle = node.active
                        ? `${nodeActiveColor} ${0.4 + proximity * 0.6})`
                        : `${nodePassiveColor} ${0.3 + proximity * 0.5})`;
                    ctx.arc(node.x, node.y, 2 + proximity * 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (node.active) {
                    ctx.beginPath();
                    ctx.fillStyle = activeDotColor;
                    ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            requestAnimationFrame(animate);
        };

        const raf = requestAnimationFrame(animate);
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(raf);
        };
    }, [gridSpacing, mouseRadius, ghostColor, glowColor, glowColorEnd, traceHighlight, traceDim, nodeActiveColor, nodePassiveColor, nodeGlowColor, activeDotColor, generateTraces]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
