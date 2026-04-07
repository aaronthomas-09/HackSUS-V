import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AstraTerminalProps {
    isOpen: boolean;
    onComplete: () => void;
    onClose: () => void;
}

const AstraTerminal = ({ isOpen, onComplete, onClose }: AstraTerminalProps) => {
    const [inputValue, setInputValue] = useState("");
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [phase, setPhase] = useState<"input" | "processing" | "success">("input");
    const inputRef = useRef<HTMLInputElement>(null)

    // Log messages to display during processing
    const processingLogs = [
        "INITIALIZING ASTRAX CORE...",
        "STATUS: OFFLINE",
        "CONNECTING TO NEURAL NET...",
        "BYPASSING SECURITY PROTOCOLS...",
        "DECRYPTING SECTOR 7...",
        "ACCESS GRANTED.",
        "OVERRIDING LOCAL SYSTEM...",
        "READY FOR LAUNCH."
    ];

    useEffect(() => {
        if (isOpen && phase === "input") {
            inputRef.current?.focus();
        }
    }, [isOpen, phase]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && phase === "input") {
            setPhase("processing");
            startLogSequence();
        }
    };

    const startLogSequence = async () => {
        for (let i = 0; i < processingLogs.length; i++) {
            await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
            setTerminalLines((prev) => [...prev, processingLogs[i]]);
        }
        await new Promise((r) => setTimeout(r, 600));
        setPhase("success");
    };

    useEffect(() => {
        if (phase === "success") {
            const timer = setTimeout(() => {
                onComplete();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [phase, onComplete]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-8"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    className="w-full max-w-3xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col aspect-video sm:aspect-auto sm:h-[500px]"
                >
                    {/* macOS Title Bar */}
                    <div className="h-10 bg-[#323232] flex items-center px-4 gap-2 flex-shrink-0 select-none">
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:bg-[#ff5f56]/80 flex items-center justify-center transition-colors group/btn"
                                title="Close"
                            >
                                <span className="text-[8px] text-black/40 opacity-0 group-hover/btn:opacity-100 font-bold transition-opacity">×</span>
                            </button>
                            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                        </div>
                        <div className="flex-grow text-center text-white/40 text-xs font-sans font-medium tracking-tight">
                            astrax — sh — 80x24
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div
                        className="flex-grow p-6 font-mono text-sm sm:text-base leading-relaxed overflow-y-auto custom-scrollbar relative"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {phase === "input" && (
                            <div className="flex flex-wrap items-center">
                                <span className="text-primary mr-3">astrax@hacksus:~$</span>
                                <div className="relative flex-grow min-w-[200px]">
                                    <span className="text-white break-all">{inputValue}</span>
                                    <span className="inline-block w-2.5 h-5 bg-[#00ff41] ml-1 animate-pulse align-middle" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="absolute inset-0 opacity-0 cursor-default focus:outline-none"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {phase === "processing" && (
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 text-primary/60 mb-4">
                                    <span>astrax@hacksus:~$</span>
                                    <span className="text-white">{inputValue}</span>
                                </div>
                                {terminalLines.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={line.includes("GRANTED") || line.includes("READY") ? "text-[#00ff41]" : "text-white/80"}
                                    >
                                        <span className="text-white/20 mr-3">[{new Date().toLocaleTimeString('en-GB', { hour12: false })}]</span>
                                        {line}
                                    </motion.div>
                                ))}
                                <div className="inline-block w-2 h-4 bg-[#00ff41] mt-2 animate-pulse" />
                            </div>
                        )}

                        <AnimatePresence>
                            {phase === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] flex-col gap-6"
                                >
                                    <motion.h2
                                        initial={{ filter: "blur(20px)" }}
                                        animate={{ filter: "blur(0px)" }}
                                        className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-primary tracking-widest text-center px-4"
                                        style={{ textShadow: "0 0 30px rgba(255,49,46,0.5)" }}
                                    >
                                        STARTING ASTRAX
                                    </motion.h2>
                                    <div className="flex gap-3">
                                        <motion.div
                                            animate={{ scaleY: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 0.15 }}
                                            className="w-1 h-8 bg-primary"
                                        />
                                        <motion.div
                                            animate={{ scaleY: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 0.15, delay: 0.1 }}
                                            className="w-1 h-8 bg-primary"
                                        />
                                        <motion.div
                                            animate={{ scaleY: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 0.15, delay: 0.2 }}
                                            className="w-1 h-8 bg-primary"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Window Status Bar */}
                    <div className="h-6 bg-[#323232] border-t border-white/5 flex items-center px-4 justify-between flex-shrink-0">
                        <div className="flex gap-4">
                            <span className="text-[10px] text-white/30 uppercase tracking-tighter">UTF-8</span>
                            <span className="text-[10px] text-white/30 uppercase tracking-tighter">Line 1, Col 1</span>
                        </div>
                        <div className="text-[10px] text-primary/50 uppercase tracking-[0.2em] font-bold">
                            // OVERRIDE_INITIATED
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AstraTerminal;
