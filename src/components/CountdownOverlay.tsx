import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import HackSUSTitle from "./HackSUSTitle";

interface CountdownOverlayProps {
    isActive: boolean;
    trackTitle: string;
    fontClass?: string;
    onComplete: () => void;
}

const CountdownOverlay = ({ isActive, trackTitle, fontClass = "font-display", onComplete }: CountdownOverlayProps) => {
    const [count, setCount] = useState(10);
    const [phase, setPhase] = useState<"counting" | "reveal" | "idle">("idle");
    const [playGlitch] = useSound("/sounds/glitch.mp3", { volume: 0.5 });

    useEffect(() => {
        if (!isActive) {
            setPhase("idle");
            setCount(10);
            return;
        }
        setPhase("counting");
        setCount(10);
    }, [isActive]);

    // Countdown tick
    useEffect(() => {
        if (phase !== "counting") return;

        if (count <= 0) {
            setPhase("reveal");
            playGlitch();
            return;
        }

        const timer = setTimeout(() => setCount((c) => c - 1), 1500);
        return () => clearTimeout(timer);
    }, [phase, count]);

    // Auto-dismiss reveal
    useEffect(() => {
        if (phase !== "reveal") return;

        const timer = setTimeout(() => {
            setPhase("idle");
            onComplete();
        }, 3500);
        return () => clearTimeout(timer);
    }, [phase, onComplete]);

    if (!isActive && phase === "idle") return null;

    return (
        <AnimatePresence>
            {(phase === "counting" || phase === "reveal") && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-2xl"
                >
                    {/* Countdown numbers */}
                    <AnimatePresence>
                        {phase === "counting" && count > 0 && (
                            <motion.div
                                key={count}
                                initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                exit={{ scale: 1.8, opacity: 0, filter: "blur(10px)" }}
                                transition={{
                                    duration: 1.0,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                {/* Glow */}
                                <div
                                    className="absolute inset-0 blur-[40px] -z-10"
                                    style={{ background: "radial-gradient(circle, rgba(255,49,46,0.05) 0%, transparent 70%)" }}
                                />
                                <span
                                    className={`${fontClass} text-[12rem] md:text-[18rem] font-bold text-primary leading-none tabular-nums`}
                                    style={{
                                        textShadow: "0 0 10px rgba(255,49,46,0.3), 0 0 20px rgba(255,49,46,0.1)",
                                    }}
                                >
                                    {count}
                                </span>
                            </motion.div>
                        )}

                        {/* Reveal: HackS'US + Track Title */}
                        {phase === "reveal" && (
                            <motion.div
                                key="reveal"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 1.5,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="flex flex-col items-center gap-4 text-center px-8"
                            >
                                {/* HackS'US - glitch title */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                    className="mb-2 font-BrittanicBold"
                                >
                                    <HackSUSTitle className="text-3xl md:text-5xl" />
                                </motion.div>
                                {/* Separator line */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent max-w-md"
                                />

                                {/* Track title */}
                                <motion.h1
                                    initial={{ y: 30, opacity: 0, scale: 0.9 }}
                                    animate={{
                                        y: 0,
                                        opacity: 1,
                                        scale: [1, 1.02, 0.98, 1.01, 1],
                                        x: [0, -2, 2, -1, 0]
                                    }}
                                    transition={{
                                        delay: 0.5,
                                        duration: 1,
                                        ease: [0.16, 1, 0.3, 1],
                                        scale: { repeat: Infinity, duration: 0.2, repeatDelay: 1 },
                                        x: { repeat: Infinity, duration: 0.1, repeatDelay: 1.5 }
                                    }}
                                    className={`${fontClass} text-5xl md:text-8xl lg:text-9xl font-bold leading-none tracking-wider`}
                                    data-text={trackTitle}
                                    style={{
                                        textShadow: "0 0 40px rgba(255,49,46,0.5), 0 0 80px rgba(255,49,46,0.2)",
                                    }}
                                >
                                    {trackTitle}
                                </motion.h1>

                                {/* "Event Started" badge */}
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.6 }}
                                    className="font-mono text-xs tracking-[0.5em] text-primary/60 uppercase mt-4"
                                >
                  // EVENT STARTED
                                </motion.span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CountdownOverlay;
