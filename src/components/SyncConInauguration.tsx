import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Zap } from "lucide-react";
import useSound from "use-sound";

interface SyncConInaugurationProps {
    isOpen: boolean;
    onComplete: () => void;
    onClose: () => void;
}

const SyncConInauguration = ({ isOpen, onComplete, onClose }: SyncConInaugurationProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const [showSpark, setShowSpark] = useState(false);

    const [playGlitch] = useSound("/sounds/glitch.mp3", { volume: 0.5 });

    // Position of the plug - Offset from center-left initially
    const plugX = useMotionValue(250);
    const plugY = useMotionValue(250);

    // Spring physics for the plug movement
    const springConfig = { damping: 20, stiffness: 200 };
    const springX = useSpring(plugX, springConfig);
    const springY = useSpring(plugY, springConfig);

    const socketRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Spark particles
    const sparks = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            angle: (i / 12) * Math.PI * 2,
            distance: 40 + Math.random() * 40,
        }));
    }, []);

    // Effect for handling completion
    useEffect(() => {
        if (isConnected) {
            setShowSpark(true);
            const timer = setTimeout(() => {
                onComplete();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isConnected, onComplete]);

    const handleDragEnd = () => {
        if (!socketRef.current || !containerRef.current) return;

        const socketRect = socketRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Target center relative to container
        const targetX = socketRect.left - containerRect.left + socketRect.width / 2;
        const targetY = socketRect.top - containerRect.top + socketRect.height / 2;

        // Current plug center relative to container
        // (48 is half of the 96px width/height of the plug)
        const currentPlugCenterX = plugX.get() + 48;
        const currentPlugCenterY = plugY.get() + 48;

        const dist = Math.sqrt(
            Math.pow(currentPlugCenterX - targetX, 2) +
            Math.pow(currentPlugCenterY - targetY, 2)
        );

        if (dist < 100) { // Increased threshold for easier snap
            // Snap the plug center to the socket center
            plugX.set(targetX - 48);
            plugY.set(targetY - 48);
            setIsConnected(true);
            playGlitch();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    x: isConnected ? [0, -10, 10, -10, 10, 0] : 0,
                    y: isConnected ? [0, 5, -5, 5, -5, 0] : 0
                }}
                transition={{
                    x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
                    y: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 overflow-hidden"
            >
                {/* Power Flash */}
                <AnimatePresence>
                    {isConnected && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.8, 0] }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 bg-white z-[60] pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors p-2 z-[70]"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div
                    ref={containerRef}
                    className="relative w-full max-w-4xl aspect-video bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl flex items-center justify-between px-20 overflow-hidden"
                >
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />

                    {/* Instruction */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-12 left-0 right-0 text-center"
                    >
                        <h2 className="text-primary font-display text-2xl tracking-[0.3em] font-bold">ESTABLISH CONNECTION</h2>
                        <p className="text-white/40 text-xs font-mono mt-2 italic">PLUG IN TO START TRACK</p>
                    </motion.div>

                    {/* Left Side: Power Box */}
                    <div ref={boxRef} className="relative z-10">
                        <div className="w-32 h-44 bg-[#111] border-2 border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 shadow-inner">
                            <div className="w-12 h-1 bg-primary/20 rounded-full animate-pulse" />
                            <div className="flex flex-col gap-2">
                                <div className="w-8 h-1 bg-white/5 rounded-full" />
                                <div className="w-8 h-1 bg-white/5 rounded-full" />
                                <div className="w-8 h-1 bg-white/5 rounded-full" />
                            </div>
                            <div className="text-[10px] font-mono text-white/20 uppercase tracking-tighter mt-4">Pwr Relay Alpha</div>
                        </div>
                    </div>

                    {/* SVG Wire */}
                    <svg className="absolute inset-0 pointer-events-none w-full h-full">
                        <WirePath plugX={plugX} plugY={plugY} />
                    </svg>

                    {/* Right Side: Socket */}
                    <div ref={socketRef} className="relative z-10">
                        <div className={`w-32 h-32 rounded-full border-4 transition-all duration-500 flex items-center justify-center ${isConnected ? 'border-primary shadow-[0_0_50px_rgba(255,49,46,0.8)]' : 'border-white/10'
                            }`}>
                            <div className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${isConnected ? 'border-primary/50' : 'border-white/5'
                                }`}>
                                <Zap className={`w-8 h-8 transition-colors ${isConnected ? 'text-primary animate-pulse' : 'text-white/10'
                                    }`} />
                            </div>
                        </div>
                        <div className="absolute -bottom-10 left-0 right-0 text-center text-[10px] font-mono text-white/20 uppercase">Sync Port 01</div>
                    </div>

                    {/* Draggable Plug */}
                    <motion.div
                        drag={!isConnected}
                        dragMomentum={false}
                        style={{ x: plugX, y: plugY }}
                        onDragEnd={handleDragEnd}
                        className={`absolute top-0 left-0 w-24 h-24 z-50 cursor-grab active:cursor-grabbing ${isConnected ? 'pointer-events-none' : ''}`}
                    >
                        <div className={`w-full h-full bg-[#2a2a2a] border-2 rounded-2xl flex items-center justify-center flex-col gap-1 transition-all ${isConnected ? 'border-primary shadow-[0_0_20px_rgba(255,49,46,0.6)]' : 'border-white/20 hover:border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
                            }`}>
                            <div className="flex gap-2">
                                <div className={`w-1.5 h-6 rounded-full ${isConnected ? 'bg-primary shadow-[0_0_10px_#ff312e]' : 'bg-white/20'}`} />
                                <div className={`w-1.5 h-6 rounded-full ${isConnected ? 'bg-primary shadow-[0_0_10px_#ff312e]' : 'bg-white/20'}`} />
                            </div>
                            <div className="text-[10px] font-mono text-white/40 uppercase font-black tracking-widest mt-1">SYNC-CON</div>
                        </div>
                    </motion.div>

                    {/* Success Message */}
                    <AnimatePresence>
                        {isConnected && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-30 pointer-events-none backdrop-blur-sm"
                            >
                                <motion.div
                                    initial={{ scale: 0.8, filter: "blur(10px)" }}
                                    animate={{
                                        scale: 1,
                                        filter: "blur(0px)",
                                        textShadow: [
                                            "0 0 20px rgba(255,49,46,0.5)",
                                            "2px 0 10px rgba(255,49,46,0.8)",
                                            "-2px 0 10px rgba(0,255,255,0.8)",
                                            "0 0 20px rgba(255,49,46,0.5)"
                                        ]
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        textShadow: { repeat: Infinity, duration: 0.1 }
                                    }}
                                    className="relative"
                                >
                                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-bold text-primary tracking-[0.2em]">
                                        CONNECTED
                                    </h1>
                                    <motion.div
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.05 }}
                                        className="absolute inset-0 text-white/20 blur-[2px]"
                                    >
                                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-bold tracking-[0.2em]">
                                            CONNECTED
                                        </h1>
                                    </motion.div>
                                </motion.div>
                                <motion.p
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="text-white/60 font-mono text-sm mt-8 tracking-[0.8em] font-bold"
                                >
                                    SYNCHRONIZING CORE SYSTEMS...
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Sparks */}
                    <AnimatePresence>
                        {showSpark && sparks.map((spark) => (
                            <motion.div
                                key={spark.id}
                                className="absolute bg-white rounded-full z-40"
                                style={{
                                    width: 4,
                                    height: 4,
                                    top: '50%',
                                    left: '50%',
                                    boxShadow: '0 0 10px #ff312e',
                                    x: `calc(130px + ${Math.cos(spark.angle) * spark.distance}px)`, // Adjusted for socket center
                                    y: `calc(0px + ${Math.sin(spark.angle) * spark.distance}px)`,
                                }}
                                initial={{ opacity: 1, scale: 1 }}
                                animate={{
                                    opacity: 0,
                                    scale: 0,
                                    x: `calc(130px + ${Math.cos(spark.angle) * spark.distance * 3}px)`, // Further throw
                                    y: `calc(0px + ${Math.sin(spark.angle) * spark.distance * 3}px)`
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// Sub-component to handle the dynamic wire path
const WirePath = ({ plugX, plugY }: { plugX: any, plugY: any }) => {
    const [path, setPath] = useState("");

    useEffect(() => {
        const updatePath = () => {
            // Power box center (static-ish)
            const startX = 200;
            const startY = 300;

            // Current plug position
            const endX = plugX.get() + 40;
            const endY = plugY.get() + 40;

            // Control points for the curve
            const midX = (startX + endX) / 2;
            const midY = Math.max(startY, endY) + 100; // Sag down a bit

            setPath(`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`);
        };

        const unsubscribeX = plugX.on("change", updatePath);
        const unsubscribeY = plugY.on("change", updatePath);

        updatePath();

        return () => {
            unsubscribeX();
            unsubscribeY();
        };
    }, [plugX, plugY]);

    return (
        <motion.path
            d={path}
            fill="none"
            stroke="#333"
            strokeWidth="12"
            strokeLinecap="round"
        />
    );
};

export default SyncConInauguration;
