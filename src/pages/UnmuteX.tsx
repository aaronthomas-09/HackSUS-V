import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Info, Download, Music, Zap, Layers, Trophy, Users, Clock, Volume2, ChevronDown, ChevronUp, X, ExternalLink } from "lucide-react";
import { motion, useAnimation, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PROBLEM_STATEMENTS = [
    {
        id: "01",
        title: "Audio Extraction & Instrument Classification (The 'Listening' Phase)",
        oneLiner: "The system captures audio from the DAW tracks, analyzes the sonic characteristics, and accurately tags the instrument type.",
        description: "The Workflow: 1.  The tool (via plugin API or DAW script) grabs short audio buffers or triggers a quick background render of the track.2.  This audio snippet is fed into an audio classification model.3.  The model returns an instrument tag (e.g., 'Strings,' 'Analog Pad,' 'Heavy Percussion') and frequency dominance. ",
        inputs: ["Primary emotion", "Intensity (1-10)", "Musical style", "Scene duration"],
        outputs: ["Suggested tempo range", "Tonal center", "Basic harmonic progression", "4-bar MIDI motif"],
        constraints: "Rule-based or lightweight ML approaches are acceptable. MIDI output is sufficient; audio generation is not required."
    },
    {
        id: "02",
        title: "Loudness Compliance Agent",
        oneLiner: "Build an AI agent that analyses audio loudness and clearly explains compliance with industry delivery standards.",
        description: "In music, film, OTT, and broadcast workflows, loudness compliance is critical. Participants will build an AI agent that analyses audio loudness metrics to ensure delivery perfection.",
        inputs: ["LUFS (Intergrated/Short-term)", "True Peak levels", "Dynamic range"],
        outputs: ["Loudness timeline visualisation", "Non-compliant segment flags", "Indicated delivery targets"],
        constraints: "The agent must only analyse and explain—it must not process or modify the audio."
    },
    {
        id: "03",
        title: "Dialogue-Music Conflict Detection Agent",
        oneLiner: "Create an AI agent that detects and explains when background music masks dialogue clarity.",
        description: "Participants will build an AI agent that analyses dialogue and music stems to identify frequency overlap and masking, ensuring maximum dialogue intelligibility.",
        inputs: ["Dialogue stems", "Music background stems", "Frequency balance"],
        outputs: ["Frequency overlap maps", "Intelligibility warning zones", "Timeline conflict visualisation"],
        constraints: "The focus is on detection and explanation, not automatic correction."
    }
];

const RevolvingHeader = () => {
    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
            <div className="relative">
                {/* Spotify-style Mesh Gradient (Canvas Effect) */}
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-crimson/10 to-transparent blur-[120px] animate-pulse opacity-60" />

                {/* Targeted Concentrated Glow */}
                <div className="absolute inset-[10%] rounded-full bg-primary/20 blur-[80px] animate-pulse" />

                <motion.div
                    className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-deep-black shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_40px_rgba(var(--primary),0.15),inset_0_0_15px_rgba(255,255,255,0.05)] border-[8px] md:border-[12px] border-charcoal overflow-hidden"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                    {/* Grooves */}
                    <div className="absolute inset-0 rounded-full border-[30px] border-transparent border-t-white/5 border-b-white/5 opacity-40" />
                    <div className="absolute inset-12 rounded-full border-[1px] border-white/5" />
                    <div className="absolute inset-24 rounded-full border-[1px] border-white/5" />
                    <div className="absolute inset-40 rounded-full border-[1px] border-white/5" />
                    <div className="absolute inset-60 rounded-full border-[1px] border-white/5" />

                    {/* Revolving Text */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <defs>
                            <path
                                id="textPath"
                                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                            />
                        </defs>
                        <text className="text-[4px] font-display uppercase tracking-[0.5em] fill-white/20">
                            <textPath href="#textPath" startOffset="0%">
                                UNMUTEX • UNMUTEX • UNMUTEX • UNMUTEX • UNMUTEX • UNMUTEX • UNMUTEX • UNMUTEX •
                            </textPath>
                        </text>
                    </svg>

                    {/* Center Label */}
                    <div className="absolute inset-[33%] rounded-full bg-gradient-to-br from-primary via-crimson to-charcoal border-[10px] border-deep-black flex flex-col items-center justify-center p-8">
                        <span className="text-xs font-mono text-white/50 tracking-tighter mb-2 uppercase italic font-bold">HackS'US</span>
                        <div className="w-full h-px bg-white/20 my-2" />
                        <span className="text-white font-display text-3xl md:text-5xl tracking-widest">UNMUTEX</span>
                        <span className="text-[10px] font-mono text-white/70 mt-2 uppercase">SIDE X • 2026</span>
                    </div>

                    {/* Spindle Hole */}
                    <div className="absolute inset-[48.5%] rounded-full bg-deep-black border border-white/20 shadow-inner" />
                </motion.div>

                {/* Reflection Overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/5 to-transparent pointer-events-none opacity-50 mix-blend-overlay" />
            </div>
        </div>
    );
};

const NowPlayingBar = ({
    isPlaying,
    setIsPlaying,
    handleSkip
}: {
    isPlaying: boolean,
    setIsPlaying: (playing: boolean) => void,
    handleSkip: (direction: 'next' | 'prev') => void
}) => {
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    // Calculate display time based on 42 minutes total
    const [currentTime, setCurrentTime] = useState("0:00");

    useEffect(() => {
        return smoothProgress.on("change", (latest) => {
            const totalSeconds = 42 * 60;
            const currentSeconds = Math.floor(latest * totalSeconds);
            const mins = Math.floor(currentSeconds / 60);
            const secs = currentSeconds % 60;
            setCurrentTime(`${mins}:${secs.toString().padStart(2, '0')}`);
        });
    }, [smoothProgress]);

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 h-20 px-6 flex items-center justify-between"
        >
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-1/3 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-charcoal rounded shadow-lg overflow-hidden flex-shrink-0 relative group">
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={16} fill="white" />
                    </div>
                    <div className="w-full h-full bg-gradient-to-br from-primary to-crimson flex items-center justify-center text-white font-display text-sm md:text-base">UN</div>
                </div>
                <div className="min-w-0">
                    <h4 className="text-xs md:text-sm font-medium text-white truncate">Unmute X - Side A</h4>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">HackS'US 2026</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="ml-2 text-muted-foreground hover:text-primary transition-colors hidden xs:block"
                >
                    <Music size={16} />
                </motion.button>
            </div>

            <div className="flex flex-col items-center gap-1 md:gap-2 w-auto md:w-1/3 flex-shrink-0">
                <div className="flex items-center gap-4 md:gap-6">
                    <button className="text-muted-foreground hover:text-white transition-colors hidden sm:block" onClick={() => handleSkip('prev')}><SkipBack size={16} /></button>
                    <button
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" />}
                    </button>
                    <button className="text-muted-foreground hover:text-white transition-colors hidden sm:block" onClick={() => handleSkip('next')}><SkipForward size={16} /></button>
                </div>
                <div className="w-24 xs:w-32 sm:w-full max-w-md flex items-center gap-2">
                    <span className="text-[8px] md:text-[10px] font-mono text-muted-foreground w-8 text-right">{currentTime}</span>
                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden relative group cursor-pointer">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-white group-hover:bg-primary transition-colors"
                            style={{ width: progressBarWidth }}
                        />
                    </div>
                    <span className="text-[8px] md:text-[10px] font-mono text-muted-foreground">42:00</span>
                </div>
            </div>

            <div className="items-center justify-end gap-4 w-1/3 hidden md:flex">
                <div className="flex items-center gap-2">
                    <Layers size={16} className="text-muted-foreground" />
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ProblemStatementRow = ({ ps, isActive, isDimmed, onClick }: { ps: any, isActive: boolean, isDimmed: boolean, onClick: () => void }) => {
    return (
        <div
            className={`border-b border-white/5 last:border-0 transition-all duration-500 ${isDimmed ? 'opacity-30 blur-[1px]' : 'opacity-100'} ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
            <button
                onClick={onClick}
                className="w-full text-left px-6 py-8 flex items-start gap-6 group"
            >
                <span className="font-mono text-sm text-muted-foreground pt-1.5 opacity-50 group-hover:opacity-100 transition-opacity">[{ps.id}]</span>
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <h3 className="text-xl md:text-2xl font-display text-white group-hover:text-primary transition-colors tracking-widest uppercase">
                            {ps.title}
                        </h3>
                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                            <ExternalLink size={20} className={isActive ? 'text-primary animate-pulse' : ''} />
                        </div>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        {ps.oneLiner}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 opacity-100">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary">Click for more details</span>
                    </div>
                </div>
            </button>
        </div>
    );
};

const VinylSleeveDetail = ({ ps, isOpen, onClose }: { ps: any, isOpen: boolean, onClose: () => void }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!ps) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[2000]"
                    />

                    {/* Sleeve Panel - Dark Theme */}
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.32, 0, 0.67, 0] }}
                        className="fixed top-0 right-0 h-full w-full md:w-[65%] lg:w-[55%] bg-[#080808] z-[2001] shadow-[-20px_0_100px_rgba(0,0,0,0.8)] flex flex-col pt-20 px-8 md:px-16 border-l border-white/5"
                    >
                        {/* Close Button */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="absolute top-8 left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                        >
                            <X size={24} />
                        </motion.button>

                        {/* The Vinyl - Sliding Out & Spinning */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[400px] h-[400px] md:w-[750px] md:h-[750px] pointer-events-none hidden sm:block overflow-visible">
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: "45%" }}
                                exit={{ x: "120%" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 20,
                                    duration: 0.8
                                }}
                                className="w-full h-full relative"
                            >
                                <motion.div
                                    className="w-full h-full rounded-full relative"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        background: 'repeating-radial-gradient(circle, #1a1a1a 0, #1a1a1a 1px, #050505 2px, #050505 4px)',
                                        boxShadow: 'inset 0 0 100px rgba(0,0,0,1), 0 0 50px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {/* Inner Red Label */}
                                    <div className="absolute inset-[35%] rounded-full bg-primary flex flex-col items-center justify-center border-[8px] border-black/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                        <img
                                            src="/images/jakes-bejoy-logo_edited.PNG"
                                            alt="MINDSCORE"
                                            className="w-full h-full object-contain opacity-100 drop-shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-80"
                                        />

                                        {/* Spindle Hole */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 md:w-8 h-4 md:h-8 rounded-full bg-black border-2 border-white/10 shadow-[inset_0_4px_8px_rgba(0,0,0,1)]" />
                                    </div>

                                    {/* Diffraction Sweep */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 opacity-30" />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Content Area - Fixed Layout - NO SCROLLBAR */}
                        <div className="relative z-10 flex-1 overflow-y-auto pr-4 text-white pb-32 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full font-mono text-[10px] text-primary font-bold tracking-widest uppercase">Problem Record {ps.id}</span>
                                    <div className="h-px w-20 bg-white/10" />
                                </div>

                                <h2 className="text-4xl md:text-7xl font-display font-extrabold text-white/95 leading-[1.05] mb-10 uppercase tracking-tight text-balance">
                                    {ps.title}
                                </h2>

                                <div className="space-y-12 max-w-2xl">
                                    <section className="relative">
                                        <div className="absolute -left-6 top-1 bottom-1 w-[2px] bg-primary/30" />
                                        <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold mb-4">Context</h4>
                                        <p className="text-base md:text-lg text-white/80 leading-relaxed font-body">
                                            {ps.description}
                                        </p>
                                    </section>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <section>
                                            <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold mb-5 flex items-center gap-2">
                                                <Zap size={14} className="text-primary" />
                                                <span>Inputs</span>
                                            </h4>
                                            <ul className="space-y-4">
                                                {ps.inputs?.map((input: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-4 text-sm text-white/60 font-mono group/item">
                                                        <span className="text-primary/40 group-hover/item:text-primary transition-colors">0{i + 1}</span>
                                                        <span className="border-b border-white/5 pb-1 flex-1 group-hover/item:text-white transition-colors">{input}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        <section>
                                            <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold mb-5 flex items-center gap-2">
                                                <Trophy size={14} className="text-scanline-green" />
                                                <span>Outputs</span>
                                            </h4>
                                            <ul className="space-y-4">
                                                {ps.outputs?.map((output: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-4 text-sm text-white/60 font-mono group/item text-balance">
                                                        <span className="text-scanline-green/40 group-hover/item:text-scanline-green transition-colors">0{i + 1}</span>
                                                        <span className="border-b border-white/5 pb-1 flex-1 group-hover/item:text-white transition-colors">{output}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    </div>

                                    <section className="p-8 bg-white/[0.02] rounded-2xl border border-white/5 backdrop-blur-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Info size={16} className="text-primary" />
                                            <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold">Constraints / Notes</h4>
                                        </div>
                                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-body italic">
                                            {ps.constraints}
                                        </p>
                                    </section>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-6 border border-white/10 rounded-xl font-mono text-xs tracking-[0.4em] uppercase hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <X size={16} className="text-primary transition-transform group-hover:rotate-90" />
                                        <span>Close Record</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const LevelMeter = ({ count = 12 }: { count?: number }) => {
    return (
        <div className="flex gap-1 h-3 items-end">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    className={`w-1 rounded-sm ${i > count - 4 ? 'bg-primary' : i > count - 7 ? 'bg-yellow-500' : 'bg-scanline-green'}`}
                    animate={{
                        height: [2, Math.random() * 12 + 4, 2],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 0.5 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.05
                    }}
                />
            ))}
        </div>
    );
};

const PartnerBranding = ({ className = "", variant = "small" }: { className?: string, variant?: "small" | "large" }) => {
    const isLarge = variant === "large";
    return (
        <div className={`flex items-center gap-6 ${className} ${isLarge ? 'flex-col sm:flex-row' : ''}`}>
            <div className={`flex items-center justify-center rounded-2xl bg-charcoal/30 border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm ${isLarge ? 'w-20 h-20 md:w-56 md:h-46 p-4' : 'w-12 h-12 p-1.5'}`}>
                {/* 
                   PLACEHOLDER FOR LOGO
                   Replace 'src' with your actual logo path once you have it.
                */}
                <img
                    src="/images/jakes-bejoy-logo_edited.PNG"
                    alt="MINDSCORE"
                    className="w-full h-full object-contain opacity-100 drop-shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-80"
                    onError={(e) => {
                        // Fallback in case image is not found yet
                        (e.target as any).style.display = 'none';
                        (e.target as any).parentElement.innerHTML = `<div class="text-primary font-bold ${isLarge ? 'text-8xl' : 'text-lg'}">JB</div>`;
                    }}
                />
            </div>
            <div className={`flex flex-col items-start leading-none ${isLarge ? 'items-center sm:items-start' : ''}`}>
                <span className={`${isLarge ? 'text-[10px] md:text-xs mb-4' : 'text-[10px] mb-1'} font-mono text-muted-foreground uppercase tracking-[0.5em]`}>A Jakes Bejoy Company</span>
                <div className={`flex items-center ${isLarge ? 'gap-4' : 'gap-2'}`}>
                    <span className={`${isLarge ? 'text-2xl md:text-4xl' : 'text-sm'} font-display text-white tracking-widest uppercase font-black`}>MINDSCORE</span>
                    <span className={`rounded-full bg-primary/10 border border-primary/20 font-mono text-primary uppercase tracking-tighter ${isLarge ? 'px-3 py-1 text-[10px]' : 'px-2 py-0.5 text-[9px]'}`}>Track Partner</span>
                </div>
            </div>
        </div>
    );
};

// ==================== KONFHUB REGISTRATION ====================
function KonfHubRegistration() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Ensure the script is only added once
        containerRef.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://widget.konfhub.com/widget.js";
        script.setAttribute("button_id", "btn_0a61a84147fd");
        script.async = true;

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className="flex justify-center flex-shrink-0">
            <style>{`
        .konfhub-widget-container .reg-button {
          background-color: #ff312e !important;
          color: white !important;
          font-family: inherit !important;
          font-weight: 700 !important;
          font-size: 0.95rem !important;
          padding: 0 2.5rem !important;
          height: 3.5rem !important;
          border-radius: 9999px !important;
          box-shadow: 0 10px 20px rgba(255, 49, 46, 0.2) !important;
          transition: all 0.3s ease !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .konfhub-widget-container .reg-button:hover {
          background-color: rgba(255, 49, 46, 0.9) !important;
          box-shadow: 0 15px 30px rgba(255, 49, 46, 0.4) !important;
          transform: scale(1.05) !important;
        }
        .konfhub-widget-container .reg-button img {
          display: none !important;
        }
        /* Adding a play icon approximation since we can't easily inject lucide into KonfHub's button DOM */
        .konfhub-widget-container .reg-button::before {
          content: '▶';
          margin-right: 12px;
          font-size: 14px;
        }
      `}</style>
            <div ref={containerRef} className="konfhub-widget-container" />
        </div>
    );
}

const UnmuteX = () => {
    const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRegistrationActive, setIsRegistrationActive] = useState(false);
    const embedControllerRef = useRef<any>(null);

    const sections = ['hero', 'tracklist', 'about', 'contact'];

    // Auto-scroll logic - Liquid Smooth
    useEffect(() => {
        let rafId: number;
        const scroll = () => {
            if (isPlaying) {
                window.scrollBy(0, 1.5); // Adjust speed here for that "buttery" feel
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
                    setIsPlaying(false);
                    return;
                }
                rafId = requestAnimationFrame(scroll);
            }
        };

        if (isPlaying) {
            rafId = requestAnimationFrame(scroll);
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [isPlaying]);

    const handleSkip = (direction: 'next' | 'prev') => {
        const scrollPos = window.scrollY;

        // Find section positions
        const sectionPositions = sections.map(id => {
            const el = document.getElementById(id);
            if (!el) return 0;
            return el.getBoundingClientRect().top + window.scrollY - 100;
        });

        let targetIndex;
        if (direction === 'next') {
            targetIndex = sectionPositions.findIndex(pos => pos > scrollPos + 20);
            if (targetIndex === -1) targetIndex = sectionPositions.length - 1;
        } else {
            const reversedPositions = [...sectionPositions].reverse();
            const revIndex = reversedPositions.findIndex(pos => pos < scrollPos - 20);
            targetIndex = revIndex === -1 ? 0 : (sectionPositions.length - 1 - revIndex);
        }

        const targetId = sections[targetIndex];
        const element = document.getElementById(targetId);
        if (element) {
            window.scrollTo({
                top: sectionPositions[targetIndex],
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        // Load Spotify IFrame API
        if (!document.getElementById("spotify-iframe-api")) {
            const script = document.createElement("script");
            script.id = "spotify-iframe-api";
            script.src = "https://open.spotify.com/embed/iframe-api/v1";
            script.async = true;
            document.body.appendChild(script);
        }

        // Define the global callback for Spotify API
        (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
            const element = document.getElementById("spotify-embed");
            if (!element) return;

            const options = {
                uri: "spotify:artist:3Q80PCEUBCiRhLSWdQApNt",
                width: "100%",
                height: "352",
                theme: "dark"
            };

            const callback = (EmbedController: any) => {
                embedControllerRef.current = EmbedController;
                EmbedController.addListener("ready", () => {
                    setIsPlayerReady(true);
                });
            };

            IFrameAPI.createController(element, options, callback);
        };


        // Detection for KonfHub Popup
        const observer = new MutationObserver(() => {
            const popup = document.querySelector(".konfhub-buttons-ifrm");
            setIsRegistrationActive(!!popup);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            // Cleanup if needed (though usually not necessary for global scripts)
            delete (window as any).onSpotifyIframeApiReady;
            observer.disconnect();
        };
    }, []);

    const handlePlayTrigger = () => {
        if (embedControllerRef.current) {
            embedControllerRef.current.play();
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as any
    };

    return (
        <div className="min-h-screen bg-black text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden font-body flex flex-col relative">
            {!isRegistrationActive && <Navbar />}

            {/* New Revolving Record Header */}
            <RevolvingHeader />

            <main className="relative pt-32 pb-40 flex-grow">
                {/* Spotify-style Mesh Gradient Background */}
                <div className="fixed inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-crimson/5 pointer-events-none" />
                <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
                <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-scanline-green/5 rounded-full blur-[150px] animate-pulse" />

                <div className="container px-6 mx-auto relative z-10">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
                        <motion.div {...fadeInUp}>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="font-mono text-sm tracking-[0.2em] uppercase">Back to Library</span>
                            </Link>
                        </motion.div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 bg-charcoal/40 backdrop-blur-md border border-white/5 p-2 rounded-full px-4">
                                <div className="px-3 py-1 flex items-center gap-2 border-r border-white/10">
                                    <div className="w-2 h-2 rounded-full bg-scanline-green animate-pulse" />
                                    <span className="font-mono text-[10px] text-scanline-green tracking-widest uppercase">Streaming</span>
                                </div>
                                <LevelMeter count={12} />
                            </div>
                            <button className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center border border-white/5 hover:border-primary/50 transition-colors">
                                <Users size={18} className="text-muted-foreground" />
                            </button>
                        </div>
                    </div>

                    {/* Hero Section - Centered */}
                    <div className="flex flex-col items-center text-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-12"
                        >
                            <PartnerBranding variant="large" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block px-3 py-1 border border-primary/30 bg-primary/5 rounded-full mb-6"
                        >
                            <span className="font-mono text-xs text-primary tracking-[0.4em] font-bold uppercase mb-2">
                                // TRACK SIX
                            </span>
                        </motion.div>

                        <motion.h1
                            className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] leading-[0.85] mb-4 mt-10"
                        >
                            UNMUTEX
                        </motion.h1>

                        <div className="flex flex-col items-center gap-6 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-charcoal border-2 border-black flex items-center justify-center text-[10px] font-bold">P{i}</div>
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">Curated for <span className="text-white">Music Producers</span> • 42 hrs duration</span>
                            </div>

                            {/* Prize Pool Badge */}
                            <motion.div
                                className="flex flex-col items-center gap-4 bg-charcoal/40 backdrop-blur-md border border-primary/30 rounded-xl px-8 md:px-12 py-8 md:py-10 z-20 relative overflow-hidden"
                                style={{
                                    boxShadow: "0 0 20px rgba(255,49,46,0.3), inset 0 0 20px rgba(255,49,46,0.05)",
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                                <div className="flex items-center gap-2 mb-2">
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-primary"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest">Prize Broadcasting</span>
                                </div>

                                <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.3em] mb-3">
                                    Grand Prize Pool
                                </p>

                                <motion.p
                                    className="font-display text-5xl md:text-7xl text-white font-black tracking-wider"
                                    animate={{
                                        textShadow: [
                                            "0 0 10px rgba(255,49,46,0.5), 0 0 30px rgba(255,49,46,0.2)",
                                            "0 0 20px rgba(255,49,46,0.7), 0 0 50px rgba(255,49,46,0.3)",
                                            "0 0 10px rgba(255,49,46,0.5), 0 0 30px rgba(255,49,46,0.2)"
                                        ]
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    ₹10,000
                                </motion.p>

                                <div className="flex gap-1 mt-4">
                                    <LevelMeter count={8} />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            </motion.div>

                            <motion.div
                                className="flex flex-wrap justify-center gap-4 mt-10"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <KonfHubRegistration />

                                <motion.button
                                    onClick={handlePlayTrigger}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`h-14 px-8 bg-charcoal/60 hover:bg-charcoal/80 text-white rounded-full flex items-center gap-3 font-medium border border-white/10 transition-all ${!isPlayerReady && "opacity-50 cursor-not-allowed"}`}
                                    disabled={!isPlayerReady}
                                >
                                    <Volume2 size={18} className={isPlayerReady ? "text-primary" : "text-muted-foreground"} />
                                    <span>{isPlayerReady ? "Click Me!" : "LOADING PLAYER..."}</span>
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Section: Tracklist Style */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Tracklist Main */}
                        <div className="lg:col-span-8">
                            <div className="mb-12">
                                <h2 className="text-4xl font-display uppercase tracking-tight mb-8 flex items-center gap-3 text-primary">
                                    <Layers />
                                    <span>Interactive Problem Records</span>
                                </h2>

                                <div className="space-y-1">
                                    <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-white/5 mb-4">
                                        <div className="col-span-1">#</div>
                                        <div className="col-span-11">Problem Statement</div>
                                    </div>

                                    {PROBLEM_STATEMENTS.map((ps, i) => (
                                        <ProblemStatementRow
                                            key={i}
                                            ps={ps}
                                            isActive={activeProblemId === ps.id}
                                            isDimmed={activeProblemId !== null && activeProblemId !== ps.id}
                                            onClick={() => setActiveProblemId(ps.id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Album Description */}
                            <div className="bg-charcoal/40 backdrop-blur-md p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                <h3 className="text-2xl mb-6">About the Production</h3>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Unmute X is designed for sonic architects to push the boundaries of modern music technology. We focus on bridging the gap between human intuition and machine intelligence.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar: Spotify Embed */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-24 shadow-2xl">
                                <div
                                    id="spotify-embed"
                                    className="min-h-[352px] bg-charcoal/20 rounded-xl"
                                >
                                    {/* The Spotify IFrame API will inject the player here */}
                                </div>


                                <div className="mt-8 bg-charcoal/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                                    <h4 className="text-xs font-mono text-primary uppercase tracking-widest mb-4">Transmission Info</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                            <span className="text-[10px] font-mono text-muted-foreground uppercase">Rate</span>
                                            <span className="text-xs font-bold">44.1 kHz</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                            <span className="text-[10px] font-mono text-muted-foreground uppercase">Bit Depth</span>
                                            <span className="text-xs font-bold">24-bit</span>
                                        </div>
                                        <div className="pt-2">
                                            <PartnerBranding />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Contact Section */}
            <section className="relative z-10 pb-32 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex items-center gap-4 justify-center mb-12">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />
                        <div className="flex items-center gap-3 bg-charcoal/40 backdrop-blur-md border border-white/5 rounded-full px-5 py-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="font-mono text-[10px] text-primary tracking-[0.4em] uppercase">Contact Frequency</span>
                        </div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />
                    </div>

                    <h2 className="font-display text-5xl md:text-6xl text-center mb-16 tracking-wider">
                        Get in Touch
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                name: "Alen George Scaria",
                                role: "// Event Coordinator",
                                phone: "+91 85908 85208",
                                phoneLink: "+91XXXXXXXXXX",
                                email: "alengscaria@gmail.com",
                            },
                            {
                                name: "Rishi Krishna",
                                role: "// Event Coordinator",
                                phone: "+91 7904 48102",
                                phoneLink: "+91XXXXXXXXXX",
                                email: "bss10a04rishi@gmail.com",
                            },
                        ].map((contact, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                whileHover={{ y: -4 }}
                                className="bg-charcoal/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-2 h-2 rounded-full bg-scanline-green" />
                                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
                                        {contact.role}
                                    </span>
                                </div>

                                <h3 className="font-display text-3xl text-white tracking-wider mb-6">
                                    {contact.name}
                                </h3>

                                <div className="space-y-3">
                                    <a
                                        href={`tel:${contact.phoneLink}`}
                                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
                                    >
                                        <Volume2 size={14} className="text-primary/50 group-hover/link:text-primary transition-colors" />
                                        <span className="font-mono text-sm">{contact.phone}</span>
                                    </a>
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group/link break-all"
                                    >
                                        <Music size={14} className="text-primary/50 group-hover/link:text-primary transition-colors flex-shrink-0" />
                                        <span className="font-mono text-sm">{contact.email}</span>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* The Highly Layered Vinyl Sleeve Pop-out */}
            <VinylSleeveDetail
                isOpen={activeProblemId !== null}
                onClose={() => setActiveProblemId(null)}
                ps={[
                    { id: "01", title: "Audio Extraction & Instrument Classification (The 'Listening' Phase)", description: "The Goal: The system captures audio from the DAW tracks, analyzes the sonic characteristics, and accurately tags the instrument type. ​The Workflow: 1.  The tool (via plugin API or DAW script) grabs short audio buffers or triggers a quick background render of the track. 2.  This audio snippet is fed into an audio classification model. 3.  The model returns an instrument tag (e.g., 'Strings, ' 'Analog Pad,' 'Heavy Percussion') and frequency dominance. ", inputs: ["Primary emotion", "Intensity (1-10)", "Musical style", "Scene duration"], outputs: ["Suggested tempo range", "Tonal center", "Basic harmonic progression", "4-bar MIDI motif"], constraints: "Rule-based or lightweight ML approaches are acceptable. MIDI output is sufficient; audio generation is not required." },
                    { id: "02", title: "Loudness Compliance Agent", description: "In music, film, OTT, and broadcast workflows, loudness compliance is critical. Participants will build an AI agent that analyses audio loudness metrics to ensure delivery perfection.", inputs: ["LUFS (Intergrated/Short-term)", "True Peak levels", "Dynamic range"], outputs: ["Loudness timeline visualisation", "Non-compliant segment flags", "Indicated delivery targets"], constraints: "The agent must only analyse and explain—it must not process or modify the audio." },
                    { id: "03", title: "Dialogue–Music Conflict Detection Agent", description: "Participants will build an AI agent that analyses dialogue and music stems to identify frequency overlap and masking, ensuring maximum dialogue intelligibility.", inputs: ["Dialogue stems", "Music background stems", "Frequency balance"], outputs: ["Frequency overlap maps", "Intelligibility warning zones", "Timeline conflict visualisation"], constraints: "The focus is on detection and explanation, not automatic correction." }
                ].find(p => p.id === activeProblemId)}
            />

            {!isRegistrationActive && (
                <NowPlayingBar
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    handleSkip={handleSkip}
                />
            )}
            <Footer />
        </div>
    );
};

export default UnmuteX;
