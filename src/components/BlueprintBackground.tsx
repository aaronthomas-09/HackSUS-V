import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const BlueprintBackground: React.FC = () => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Mouse Parallax values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for parallax
    const springConfig = { damping: 25, stiffness: 150 };
    const rotateX = useSpring(useTransform(mouseY, [0, windowSize.height], [2, -2]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [0, windowSize.width], [-2, 2]), springConfig);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black persist-3d">
            <motion.div
                style={{ rotateX, rotateY, transformPerspective: 1000 }}
                className="absolute inset-[-10%] opacity-[0.2]"
            >
                {/* Main Grid */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Sub Grid */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
                        `,
                        backgroundSize: '10px 10px'
                    }}
                />
            </motion.div>

            {/* Subtle Projector Glow (Scanlines removed for clarity) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ opacity: [0.02, 0.04, 0.02, 0.05, 0.02] }}
                    transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-primary/5 mix-blend-overlay"
                />
            </div>

            {/* Architectural Markers */}
            <div className="absolute inset-0 opacity-[0.15]">
                {[...Array(20)].map((_, i) => (
                    <React.Fragment key={i}>
                        <div
                            className="absolute bg-primary/40"
                            style={{ left: `${(i + 1) * 5}%`, top: '0', height: i % 2 === 0 ? '12px' : '6px', width: '1px' }}
                        />
                        <div
                            className="absolute bg-primary/40"
                            style={{ top: `${(i + 1) * 5}%`, left: '0', width: i % 2 === 0 ? '12px' : '6px', height: '1px' }}
                        />

                        {i % 2 === 0 && (
                            <>
                                <span
                                    className="absolute font-mono text-[8px] text-primary select-none whitespace-nowrap"
                                    style={{ left: `${(i + 1) * 5}%`, top: '15px', transform: 'translateX(-50%)' }}
                                >
                                    {(i + 1) * 500}mm
                                </span>
                                <span
                                    className="absolute font-mono text-[8px] text-primary rotate-90 origin-left select-none whitespace-nowrap"
                                    style={{ top: `${(i + 1) * 5}%`, left: '15px', transform: 'translateY(-50%)' }}
                                >
                                    {(i + 1) * 500}mm
                                </span>
                            </>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Corner Markers */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-primary/30 uppercase select-none">
                DRAWING_NO: CE-HX-04<br />
                SCALE: 1:500
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-primary/30 uppercase select-none text-right">
                REVISION: ARCH_V2<br />
                DATE: 11-FEB-2026
            </div>

            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] opacity-60" />
        </div>
    );
};

export default BlueprintBackground;
