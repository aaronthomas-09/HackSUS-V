import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, Radio, Activity, Gauge, Zap, CircuitBoard, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CircuitGrid from "@/components/CircuitGrid";
import DimensionLine from "@/components/DimensionLine";
import DecryptedText from "@/components/DecryptedText";
import ShinyText from "@/components/ShinyText";
import CountdownOverlay from "@/components/CountdownOverlay";
import TrackElapsedTimer from "@/components/TrackElapsedTimer";
import { useTrackTimer } from "@/hooks/useTrackTimer";
import SyncConInauguration from "@/components/SyncConInauguration";
import SpotlightCard from "@/components/SpotlightCard";
import Crosshair from "@/components/Crosshair";

/* ── Oscilloscope Waveform ── */
const OscilloscopeWave = ({ className = "" }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        let raf = 0;
        let t = 0;

        const draw = () => {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            // Grid lines
            ctx.strokeStyle = "rgba(255,49,46,0.06)";
            ctx.lineWidth = 0.5;
            for (let x = 0; x < w; x += 20) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y < h; y += 20) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            // Waveform
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,49,46,0.6)";
            ctx.lineWidth = 1.5;
            ctx.shadowColor = "rgba(255,49,46,0.4)";
            ctx.shadowBlur = 6;
            for (let x = 0; x < w; x++) {
                const y = h / 2 + Math.sin((x * 0.03) + t) * (h * 0.3) + Math.sin((x * 0.08) + t * 1.7) * (h * 0.1);
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Secondary trace (fainter)
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,49,46,0.15)";
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x++) {
                const y = h / 2 + Math.cos((x * 0.05) + t * 0.8) * (h * 0.2);
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            t += 0.04;
            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={320}
            height={120}
            className={`rounded-lg ${className}`}
        />
    );
};

/* ── Signal Level Meter ── */
const SignalMeter = ({ levels, className = "" }: { levels: number[]; className?: string }) => (
    <div className={`flex items-end gap-[3px] h-10 ${className}`}>
        {levels.map((level, i) => (
            <motion.div
                key={i}
                className="w-[4px] bg-primary/80 rounded-t-sm origin-bottom"
                animate={{ scaleY: [level, level * 0.4, level, level * 0.7, level] }}
                transition={{ duration: 1.8 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ height: "100%" }}
            />
        ))}
    </div>
);

/* ── Voltage Readout ── */
const VoltageReadout = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center gap-3 font-mono text-[10px]">
        <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
        <span className="text-primary/50 uppercase tracking-widest">{label}</span>
        <span className="text-white/70 ml-auto tabular-nums">{value}</span>
    </div>
);


const SyncConX = () => {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isRegistrationActive, setIsRegistrationActive] = useState(false);
    const [countdownActive, setCountdownActive] = useState(false);
    const [isInaugurationOpen, setIsInaugurationOpen] = useState(false);
    const { elapsed, startTimer, resetTimer, isStarted } = useTrackTimer("syncconx");

    const handleLaunch = useCallback(() => {
        if (!isStarted) setIsInaugurationOpen(true);
    }, [isStarted]);

    const handleInaugurationComplete = useCallback(() => {
        setIsInaugurationOpen(false);
        setCountdownActive(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Reset shortcut: Ctrl + Alt + R (PC) or Cmd + Option + R (Mac)
            if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "r") {
                resetTimer();
            }
            // Launch shortcut: Ctrl + Alt + L (PC) or Cmd + Option + L (Mac)
            if (!isStarted && (e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "l") {
                handleLaunch();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [resetTimer, handleLaunch, isStarted]);

    const handleCountdownComplete = useCallback(() => {
        setCountdownActive(false);
        startTimer();
    }, [startTimer]);

    useEffect(() => {
        window.scrollTo(0, 0);

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
            observer.disconnect();
        };
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen relative selection:bg-primary/30 overflow-x-hidden text-foreground"
        >
            {/* Crosshair cursor */}
            <Crosshair containerRef={containerRef} color="#ff312e" />

            {/* Circuit Grid Background (red-themed) */}
            <CircuitGrid />

            {/* Ambient gradient blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "1.5s" }} />
            </div>

            <div className="relative z-50">
                {!isRegistrationActive && <Navbar />}
            </div>

            <main className="pt-32 pb-24 relative z-10">
                <div className="container px-6 mx-auto">
                    {/* Back button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary transition-all mb-12 group"
                        >
                            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span className="font-mono text-[10px] tracking-widest uppercase opacity-70 group-hover:opacity-100">
                                SYS_ROOT // BACK_TO_DASHBOARD
                            </span>
                        </Link>
                    </motion.div>

                    {/* Header */}
                    <div className="mb-32 text-center relative">
                        <div className="max-w-4xl mx-auto relative px-12 py-10">
                            {/* Technical Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/40" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/40" />

                            <DimensionLine label="CLK: 48MHz" orientation="horizontal" className="absolute -top-8 left-0 opacity-40" />
                            <DimensionLine label="VCC: 5V" orientation="vertical" className="absolute -left-8 top-0 h-full opacity-40 hidden md:flex" />

                            {/* Track label */}
                            <motion.div
                                initial={{ opacity: 0, letterSpacing: "1em" }}
                                animate={{ opacity: 1, letterSpacing: "0.6em" }}
                                transition={{ duration: 1.5 }}
                                className="block mb-6"
                            >
                                <ShinyText
                                    text="[ TRACK_03 // EEE & INSTRUMENTATION ]"
                                    className="font-mono text-[10px] tracking-[0.6em] uppercase"
                                    color="#ff312e"
                                    shineColor="#ffffff"
                                    speed={3}
                                    direction="right"
                                />
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="font-display text-7xl md:text-[10rem] text-white font-bold leading-none mb-4 tracking-normal"
                            >
                                SYNCCONX
                            </motion.h1>

                            {/* Elapsed Timer */}
                            {isStarted && (
                                <TrackElapsedTimer
                                    elapsed={elapsed}
                                    fontClass="font-mono"
                                    labelClass="font-mono text-[10px] text-primary/60 tracking-[0.3em] uppercase"
                                    boxClass="rounded-[1rem] border border-primary/20 bg-card/20 backdrop-blur-xl"
                                    numberClass="font-display text-3xl md:text-4xl text-primary"
                                    glowColor="rgba(255,49,46,0.1)"
                                    className="mt-8"
                                />
                            )}

                            {/* Gradient line */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className="h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent my-8"
                            />

                            <motion.p
                                {...fadeInUp}
                                transition={{ delay: 0.6 }}
                                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
                            >
                                Design <span className="text-white font-medium">data-driven electrical</span> and{" "}
                                <span className="text-primary font-medium">instrumentation systems</span> for smarter,
                                more efficient workflows.
                            </motion.p>


                            {/* Prize Pool */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="mt-16 max-w-2xl mx-auto relative px-12 py-10 bg-card/20 backdrop-blur-xl border border-primary/20 rounded-[1.5rem]"
                            >
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/40" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/40" />

                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                                <div className="text-center">
                                    <span className="font-mono text-[10px] text-primary/60 tracking-[0.3em] uppercase block mb-4">
                                        [ PRIZE_ALLOCATION ]
                                    </span>
                                    <motion.h3
                                        className="font-display text-5xl md:text-6xl text-white font-bold tracking-wider"
                                        animate={{
                                            textShadow: [
                                                "0 0 10px rgba(255,49,46,0.3), 0 0 20px rgba(255,49,46,0.1)",
                                                "0 0 20px rgba(255,49,46,0.5), 0 0 40px rgba(255,49,46,0.2)",
                                                "0 0 10px rgba(255,49,46,0.3), 0 0 20px rgba(255,49,46,0.1)",
                                            ],
                                        }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <DecryptedText
                                            text="₹30,000"
                                            numbersOnly
                                            animateOn="view"
                                            speed={30}
                                            durationMs={1500}
                                            className="text-white"
                                            encryptedClassName="text-primary"
                                        />
                                    </motion.h3>
                                    <p className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase mt-4">
                                        Total Track Competition Fund
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Stats Quick-Info Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3, duration: 0.7 }}
                            className="mt-12 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4"
                        >
                            {[
                                { label: "Duration", value: "42h", icon: Activity },
                                { label: "Team Size", value: "4-6", icon: Cpu },
                                { label: "Domains", value: "IoT", icon: Radio },
                            ].map((stat, i) => (
                                <SpotlightCard
                                    key={i}
                                    className="!rounded-xl !p-4 !bg-card/30 !border-white/5 backdrop-blur-sm last:col-span-2 md:last:col-span-1"
                                    spotlightColor="rgba(255, 49, 46, 0.10)"
                                >
                                    <div className="text-center relative z-10">
                                        <stat.icon className="w-4 h-4 text-primary/60 mx-auto mb-2" />
                                        <p className="font-mono text-[9px] text-primary/50 tracking-[0.2em] uppercase mb-1">
                                            {stat.label}
                                        </p>
                                        <p className="font-display text-2xl text-white">
                                            <DecryptedText
                                                text={stat.value}
                                                characters="0123456789ABCDEF"
                                                animateOn="view"
                                                speed={50}
                                                durationMs={800 + i * 200}
                                                className="text-white"
                                                encryptedClassName="text-primary/60"
                                            />
                                        </p>
                                    </div>
                                </SpotlightCard>
                            ))}
                        </motion.div>
                    </div>

                    {/* Gradient Section Divider */}
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-16" />

                    {/* Content sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
                        <div className="lg:col-span-8 space-y-20">
                            {/* Overview */}
                            <motion.section
                                onMouseEnter={() => setHoveredSection("overview")}
                                onMouseLeave={() => setHoveredSection(null)}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 40 }}
                                viewport={{ once: true }}
                                className="bg-card/30 backdrop-blur-xl border border-white/5 p-12 rounded-[2rem] relative overflow-hidden group hover:border-primary/20 transition-all duration-500 shadow-2xl"
                            >
                                {/* Sweep line on hover */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                {/* Corners */}
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/30" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/30" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/30" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/30" />

                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                        <CircuitBoard size={28} />
                                    </div>
                                    <h2 className="font-display text-4xl text-white tracking-tight uppercase">
                                        Overview // 01
                                    </h2>
                                </div>

                                <p className="text-muted-foreground leading-relaxed text-xl font-light">
                                    SyncConX challenges engineers to design{" "}
                                    <span className="text-primary font-medium underline underline-offset-8 decoration-primary/20">
                                        data-driven electrical and instrumentation systems
                                    </span>
                                    . Leverage sensors, IoT, and intelligent analytics to create systems that{" "}
                                    <span className="text-white font-medium">monitor, measure, and optimize</span>{" "}
                                    electrical workflows.
                                </p>

                                {/* Hover-reveal: E&I equations + oscilloscope */}
                                <AnimatePresence>
                                    {hoveredSection === "overview" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            className="mt-12 pt-10 border-t border-white/5"
                                        >
                                            <div className="font-mono text-xs text-primary/40 grid grid-cols-2 md:grid-cols-4 gap-6 tracking-widest mb-8">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-white/40">[ OHM_LAW ]</span>
                                                    <span>V = I × R</span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-white/40">[ NYQUIST ]</span>
                                                    <span>fs ≥ 2 × fmax</span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-white/40">[ POWER ]</span>
                                                    <span>P = V × I</span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-white/40">[ LAPLACE ]</span>
                                                    <span>H(s) = 1/(sRC+1)</span>
                                                </div>
                                            </div>
                                            {/* Mini oscilloscope */}
                                            <div className="bg-black/40 border border-primary/10 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-[8px] text-primary/40 uppercase tracking-widest">SIGNAL_MONITOR</span>
                                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" />
                                                </div>
                                                <OscilloscopeWave className="w-full opacity-80" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.section>

                            {/* DimensionLine separator */}
                            <DimensionLine label="DAQ: 16-bit" orientation="horizontal" className="opacity-30" />

                            {/* Requirements */}
                            <motion.section
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 40 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-12 rounded-[2rem] relative group"
                            >
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <Zap size={28} />
                                    </div>
                                    <h2 className="font-display text-4xl text-white tracking-tight uppercase">
                                        Requirements // 02
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {[
                                        {
                                            title: "Software",
                                            desc: "KiCAD, MPLAB and PROTEUS",
                                            icon: Gauge,
                                            id: "REQ_A",
                                        },
                                        {
                                            title: "Real-time Monitoring",
                                            desc: "Real-time monitoring or control capabilities",
                                            icon: Activity,
                                            id: "REQ_B",
                                        },
                                        // {
                                        //     title: "Biomedical Instrumentation",
                                        //     desc: "Instrumentation in Biomedical Technology",
                                        //     icon: Cpu,
                                        //     id: "REQ_C",
                                        // },
                                        {
                                            title: "Robot Telemetry",
                                            desc: "Robot telemetry (encoders/IMU), motor current sensing",
                                            icon: Radio,
                                            id: "REQ_D",
                                        },
                                    ].map((req, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ x: 10 }}
                                            className="flex gap-8 items-start group/item border-l-2 border-transparent hover:border-primary/30 pl-6 transition-all"
                                        >
                                            <div className="shrink-0">
                                                <span className="font-mono text-[10px] text-primary/40 block mb-2">{req.id}</span>
                                                <req.icon className="w-8 h-8 text-primary opacity-60 group-hover/item:opacity-100 transition-opacity" />
                                            </div>
                                            <div>
                                                <h4 className="font-display text-xl text-white mb-2 uppercase tracking-wide">{req.title}</h4>
                                                <p className="text-muted-foreground text-base leading-relaxed font-light">{req.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* DimensionLine separator */}
                            <DimensionLine label="Ω: 4.7kΩ" orientation="horizontal" className="opacity-30" />

                            {/* Problem Statements */}
                            <motion.section
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 40 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-card/30 backdrop-blur-xl border border-white/5 p-12 rounded-[2rem] relative group hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/30" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/30" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/30" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/30" />

                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <Activity size={28} />
                                    </div>
                                    <h2 className="font-display text-4xl text-white tracking-tight uppercase">
                                        Problem Statements // 03
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        {
                                            id: "PS_01",
                                            title: "Problem Statement 1",
                                            desc: "Autonomous PCB Layout",
                                            link: "/docs/Syncconx_PS/syncconx_PS1.pdf"
                                        },
                                        {
                                            id: "PS_02",
                                            title: "Problem Statement 2",
                                            desc: "AI-Powered Embedded Code Generator",
                                            link: "/docs/Syncconx_PS/syncconx_PS2.pdf"
                                        }
                                    ].map((ps, i) => (
                                        <motion.a
                                            key={i}
                                            href={ps.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -5 }}
                                            className="bg-black/40 border border-white/10 hover:border-primary/50 p-6 rounded-xl transition-all group/card flex flex-col gap-4"
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="font-mono text-xs text-primary/60 tracking-widest">{ps.id}</span>
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/card:bg-primary/20 group-hover/card:text-primary transition-colors">
                                                    <ArrowLeft size={14} className="rotate-[135deg]" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-display text-xl text-white mb-2 uppercase">{ps.title}</h3>
                                                <p className="text-sm text-muted-foreground font-light leading-relaxed">{ps.desc}</p>
                                            </div>
                                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary/40 group-hover/card:bg-primary group-hover/card:animate-pulse" />
                                                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Download PDF</span>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.section>

                            {/* DimensionLine separator */}
                            <DimensionLine label="VREF: 3.3V" orientation="horizontal" className="opacity-30" />

                            {/* Judging Criteria */}
                            {/* <motion.section
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 40 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-card/30 backdrop-blur-xl border border-white/5 p-12 rounded-[2rem] relative group hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/30" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/30" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/30" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/30" />

                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <Activity size={28} />
                                    </div>
                                    <h2 className="font-display text-4xl text-white tracking-tight uppercase">
                                        Judging Criteria // 03
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { label: "System Design", pct: 25 },
                                        { label: "Data Integration", pct: 25 },
                                        { label: "Accuracy & Reliability", pct: 25 },
                                        { label: "Practical Application", pct: 25 },
                                    ].map((criteria, i) => (
                                        <motion.div
                                            key={i}
                                            whileInView={{ opacity: 1 }}
                                            initial={{ opacity: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * i }}
                                            className="space-y-3"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-white font-display text-lg uppercase tracking-wide">
                                                    {criteria.label}
                                                </span>
                                                <span className="font-mono text-xs text-primary">
                                                    {criteria.pct}%
                                                </span>
                                            </div>
                                            <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${criteria.pct}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                                    className="h-full bg-gradient-to-r from-primary to-red-400 rounded-full"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section> */}
                        </div>

                        {/* Sidebar — Instrument Panel style */}
                        <aside className="lg:col-span-4 relative">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-card/40 backdrop-blur-2xl border border-primary/20 p-10 rounded-[2rem] sticky top-32 shadow-[0_0_80px_-20px_rgba(255,49,46,0.2)]"
                            >
                                {/* Status LED */}
                                <div className="absolute top-6 left-6 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                <div className="absolute top-6 left-6 w-1.5 h-1.5 bg-primary rounded-full" />
                                <div className="absolute top-6 right-6 font-mono text-[8px] text-primary opacity-40 italic underline uppercase">
                                    INSTR_PANEL
                                </div>

                                <h3 className="font-display text-2xl text-white mb-8 text-center tracking-[0.4em] uppercase pt-4">
                                    SX-03
                                </h3>

                                {/* Signal level meter */}
                                <div className="mb-8 bg-black/30 border border-primary/10 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono text-[8px] text-primary/40 uppercase tracking-widest">SIGNAL_LVL</span>
                                        <SignalMeter levels={[0.8, 0.5, 0.9, 0.3, 0.7, 0.6, 0.4, 0.8, 0.5, 0.7, 0.9, 0.6]} />
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    {[
                                        { label: "Track Prize Pool", value: "₹30K", highlight: true },
                                        { label: "Squad Capacity", value: "4-6 members" },
                                        { label: "Timeframe", value: "42 hours" },
                                        { label: "Interface", value: "IoT" },
                                    ].map((detail, i) => (
                                        <div key={i} className="flex flex-col gap-3 group/detail">
                                            <span className="font-mono text-[10px] text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <span className="w-4 h-[1px] bg-primary/20 group-hover/detail:w-8 transition-all" />
                                                {detail.label}
                                            </span>
                                            <span className={`text-4xl font-display uppercase ${detail.highlight ? "text-primary" : "text-white"}`}>
                                                {detail.value}
                                            </span>
                                            <div className="border-b border-dashed border-primary/10 mt-2" />
                                        </div>
                                    ))}
                                </div>

                                {/* Voltage readouts — unique E&I element */}
                                <div className="mt-8 bg-black/30 border border-primary/10 rounded-lg p-3 space-y-2">
                                    <span className="font-mono text-[8px] text-primary/40 uppercase tracking-widest block mb-2">SYSTEM_DIAG</span>
                                    <VoltageReadout label="VCC" value="5.02V" />
                                    <VoltageReadout label="GND" value="0.00V" />
                                    <VoltageReadout label="ADC" value="3.31V" />
                                    <VoltageReadout label="CLK" value="48MHz" />
                                </div>

                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="https://konfhub.com/hacksus-edition-5"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block w-full mt-10 bg-primary text-primary-foreground px-8 py-6 font-display tracking-[0.2em] rounded-2xl transition-all text-center shadow-xl shadow-primary/20 uppercase font-bold text-lg hover:bg-primary/90"
                                >
                                    Deploy Team
                                </motion.a>

                                <div className="mt-8 flex justify-between font-mono text-[8px] text-white/20 uppercase tracking-tighter">
                                    <span>AUTH_ID: SX_EEI_26</span>
                                    <span>CHK_SUM: OK</span>
                                </div>
                            </motion.div>
                        </aside>
                    </div>
                </div>

                {/* Contacts */}
                <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 40 }}
                    viewport={{ once: true }}
                    className="mb-32"
                >
                    <div className="max-w-4xl mx-auto relative px-12 py-10">
                        {/* Technical Corners */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/40" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/40" />

                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="font-mono text-[10px] text-primary/60 tracking-[0.3em] uppercase block mb-8 text-center"
                        >
                            [ CONTACT_INTERFACE ]
                        </motion.span>

                        <h2 className="font-display text-5xl md:text-6xl text-white font-bold text-center tracking-wider mb-16 uppercase">
                            Get in Touch
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    name: "Amy Reni Varghese",
                                    role: "Event Coordinator",
                                    phone: "+91 62388 87116",
                                    phoneLink: "+91XXXXXXXXXX",
                                    email: "u2302012@rajagiri.edu.in",
                                },
                                {
                                    name: "Varnika B",
                                    role: "Event Coordinator",
                                    phone: "+91 79949 08780",
                                    phoneLink: "+91XXXXXXXXXX",
                                    email: "varnikabofficial@gmail.com",
                                },
                            ].map((contact, i) => (
                                <motion.div
                                    key={i}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ x: 6 }}
                                    className="bg-card/30 backdrop-blur-xl border border-white/5 p-8 rounded-[1.5rem] relative group hover:border-primary/20 transition-all duration-500"
                                >
                                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/30" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/30" />

                                    <span className="font-mono text-[10px] text-primary/50 tracking-[0.2em] uppercase block mb-4">
                                        [ // {contact.role} ]
                                    </span>

                                    <h3 className="font-display text-3xl text-white tracking-wide uppercase mb-6">
                                        {contact.name}
                                    </h3>

                                    <div className="space-y-4">
                                        <a
                                            href={`tel:${contact.phoneLink}`}
                                            className="flex items-center gap-4 group/link"
                                        >
                                            <span className="w-6 h-[1px] bg-primary/30 group-hover/link:w-10 transition-all" />
                                            <span className="text-muted-foreground group-hover/link:text-primary transition-colors font-mono text-sm">
                                                {contact.phone}
                                            </span>
                                        </a>
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="flex items-center gap-4 group/link"
                                        >
                                            <span className="w-6 h-[1px] bg-primary/30 group-hover/link:w-10 transition-all" />
                                            <span className="text-muted-foreground group-hover/link:text-primary transition-colors font-mono text-sm break-all">
                                                {contact.email}
                                            </span>
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    </div>
                </motion.div>
            </main>

            <div className="relative z-50">
                <Footer />
            </div>

            {/* Countdown Overlay */}
            <CountdownOverlay
                isActive={countdownActive}
                trackTitle="SYNCCONX"
                fontClass="font-display"
                onComplete={handleCountdownComplete}
            />

            {/* Inauguration Simulation */}
            <SyncConInauguration
                isOpen={isInaugurationOpen}
                onComplete={handleInaugurationComplete}
                onClose={() => setIsInaugurationOpen(false)}
            />
        </div>
    );
};

export default SyncConX;
