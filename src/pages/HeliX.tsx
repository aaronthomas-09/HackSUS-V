import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, Activity, Ruler, Box, Terminal, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlueprintBackground from "@/components/BlueprintBackground";
import DimensionLine from "@/components/DimensionLine";
import CountdownOverlay from "@/components/CountdownOverlay";
import Crosshair from "@/components/Crosshair";
import TrackElapsedTimer from "@/components/TrackElapsedTimer";
import { useTrackTimer } from "@/hooks/useTrackTimer";

// ==================== KONFHUB REGISTRATION ====================
function KonfHubRegistration() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Ensure the script is only added once
        containerRef.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://widget.konfhub.com/widget.js";
        script.setAttribute("button_id", "btn_9b7dc51dd72f");
        script.async = true;

        containerRef.current.appendChild(script);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center z-20 mt-10"
        >
            <style>{`
        .konfhub-widget-container .reg-button {
          background-color: #ff312e !important;
          color: white !important;
          font-family: inherit !important;
          font-weight: 700 !important;
          font-size: 1rem !important;
          padding: 0 3rem !important;
          height: 4rem !important;
          border-radius: 1rem !important;
          box-shadow: 0 0 40px rgba(255, 49, 46, 0.3) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          text-transform: uppercase !important;
          letter-spacing: 0.2em !important;
        }
        .konfhub-widget-container .reg-button:hover {
          background-color: rgba(255, 49, 46, 0.9) !important;
          box-shadow: 0 0 60px rgba(255, 49, 46, 0.5) !important;
          transform: translateY(-2px) scale(1.02) !important;
        }
        .konfhub-widget-container .reg-button img {
          display: none !important;
        }
      `}</style>
            <div ref={containerRef} className="konfhub-widget-container" />
        </motion.div>
    );
}

const HeliX = () => {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isRegistrationActive, setIsRegistrationActive] = useState(false);
    const [countdownActive, setCountdownActive] = useState(false);
    const { remaining, startTimer, resetTimer, isStarted } = useTrackTimer("helix");

    const handleCountdownComplete = useCallback(() => {
        setCountdownActive(false);
        startTimer();
    }, [startTimer]);

    const handleLaunch = useCallback(() => {
        if (!isStarted) setCountdownActive(true);
    }, [isStarted]);

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
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen relative selection:bg-primary/30 overflow-x-hidden text-foreground"
        >
            <Crosshair containerRef={containerRef} color="#ff312e" />
            <div className="relative z-50">
                {!isRegistrationActive && <Navbar />}
            </div>
            <BlueprintBackground />

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
                            <span className="font-mono text-[10px] tracking-widest uppercase opacity-70 group-hover:opacity-100 italic">SYSTEM_ROOT // BACK_TO_DASHBOARD</span>
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

                            <DimensionLine label="W: 860.00" orientation="horizontal" className="absolute -top-8 left-0 opacity-40" />
                            <DimensionLine label="H: 320.00" orientation="vertical" className="absolute -left-8 top-0 h-full opacity-40 hidden md:flex" />

                            <motion.span
                                initial={{ opacity: 0, letterSpacing: "1em" }}
                                animate={{ opacity: 1, letterSpacing: "0.6em" }}
                                transition={{ duration: 1.5 }}
                                className="font-mono text-[10px] text-primary tracking-[0.6em] uppercase block mb-6 animate-pulse"
                            >
                                [ INITIALIZING // TRACK_IDENTIFIER: 04 ]
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="font-display text-8xl md:text-[10rem] text-white font-bold leading-none mb-4 tracking-normal"
                            >
                                HELIX
                            </motion.h1>

                            {/* Countdown Timer */}
                            {isStarted && (
                                <TrackElapsedTimer
                                    elapsed={remaining}
                                    fontClass="font-display"
                                    labelClass="font-mono text-[10px] text-primary/60 tracking-[0.3em] uppercase"
                                    boxClass="bg-card/30 backdrop-blur-xl border border-white/5 rounded-2xl"
                                    numberClass="font-display text-3xl md:text-4xl text-primary"
                                    glowColor="rgba(255,49,46,0.1)"
                                    className="mt-8"
                                    label="// TIME REMAINING"
                                />
                            )}


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
                                Synthesizing <span className="text-white font-medium">Artificial Intelligence</span> with <span className="text-primary font-medium">Modern Civil Engineering</span> to build the infrastructure of tomorrow.
                            </motion.p>


                            {/* Prize Pool */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="mt-16 max-w-2xl mx-auto relative px-12 py-10 bg-card/20 backdrop-blur-xl border border-primary/20 rounded-[1.5rem]"
                            >
                                {/* Technical Corners */}
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
                                                "0 0 10px rgba(255,49,46,0.3), 0 0 20px rgba(255,49,46,0.1)"
                                            ]
                                        }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        ₹20,000
                                    </motion.h3>
                                    <p className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase mt-4">
                                        Total Track Competition Fund
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
                        <div className="lg:col-span-8 space-y-20">
                            {/* Overview */}
                            <motion.section
                                onMouseEnter={() => setHoveredSection('overview')}
                                onMouseLeave={() => setHoveredSection(null)}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 40 }}
                                viewport={{ once: true }}
                                className="bg-card/30 backdrop-blur-xl border border-white/5 p-12 rounded-[2rem] relative overflow-hidden group hover:border-primary/20 transition-all duration-500 shadow-2xl"
                            >
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                        <Terminal size={28} />
                                    </div>
                                    <h2 className="font-display text-4xl text-white tracking-tight uppercase">Overview // 01</h2>
                                </div>

                                <p className="text-muted-foreground leading-relaxed text-2xl font-light">
                                    HeliX invites civil engineers to apply <span className="text-primary font-medium underline underline-offset-8 decoration-primary/20">AI & intelligent tools</span> to revolutionize construction and engineering workflows.
                                    Design solutions for structural optimization, project management, safety enhancement, or sustainable building practices.
                                </p>

                                <AnimatePresence>
                                    {hoveredSection === 'overview' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            className="mt-12 pt-10 border-t border-white/5 font-mono text-xs text-primary/40 grid grid-cols-2 md:grid-cols-4 gap-6 tracking-widest"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <span className="text-white/40">[ EQUATION_01 ]</span>
                                                <span>Σ Fx = 0; Σ Fy = 0</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-white/40">[ EQUATION_02 ]</span>
                                                <span>ΔL = (P*L)/(A*E)</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-white/40">[ EQUATION_03 ]</span>
                                                <span>σ = E * ε</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-white/40">[ PROJECT_REF ]</span>
                                                <span>HX_v5.0.2</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.section>

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
                                        <Ruler size={28} />
                                    </div>
                                    <h2 className="font-display text-4xl text-white tracking-tight uppercase">Requirements // 02</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {[
                                        { title: "AI Integration", desc: "AI-powered civil engineering solution", icon: Cpu, id: "REQ_A" },
                                        { title: "Documentation", desc: "Design documentation or simulation", icon: Box, id: "REQ_B" },
                                        { title: "Impact Analysis", desc: "Analysis of impact on construction", icon: Activity, id: "REQ_C" },
                                        { title: "Sustainabiltiy", desc: "Budget and sustainability considerations", icon: Ruler, id: "REQ_D" }
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
                                            title: "GreenBuild AI",
                                            desc: "Intelligent Sustainable Construction Planner",
                                            link: "/docs/Helix_PS/civil_PS2.pdf"
                                        },
                                        {
                                            id: "PS_02",
                                            title: "PEN Foundation AI Planner",
                                            desc: "",
                                            link: ""
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
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 relative">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-card/40 backdrop-blur-2xl border border-primary/20 p-10 rounded-[2rem] sticky top-32 shadow-[0_0_80px_-20px_rgba(255,49,46,0.2)]"
                            >
                                {/* Industrial Details */}
                                <div className="absolute top-6 left-6 w-1 h-1 bg-primary rounded-full animate-ping" />
                                <div className="absolute top-6 right-6 font-mono text-[8px] text-primary opacity-40 italic underline uppercase">ENGR_DATASHEET</div>

                                <h3 className="font-display text-2xl text-white mb-12 text-center tracking-[0.4em] uppercase pt-4">Specifications</h3>

                                <div className="space-y-10">
                                    {[
                                        { label: "Track Prize Pool", value: "₹20K", color: "text-primary shadow-primary/20" },
                                        { label: "Squad Capacity", value: "4-6 members" },
                                        { label: "Timeframe", value: "42 hours" },
                                    ].map((detail, i) => (
                                        <div key={i} className="flex flex-col gap-3 group/detail">
                                            <span className="font-mono text-[10px] text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <span className="w-4 h-[1px] bg-primary/20 group-hover/detail:w-8 transition-all" />
                                                {detail.label}
                                            </span>
                                            <span className={`text-4xl font-display uppercase ${detail.color || 'text-white'}`}>{detail.value}</span>
                                        </div>
                                    ))}
                                </div>


                                <div className="mt-8 flex justify-between font-mono text-[8px] text-white/20 uppercase tracking-tighter">
                                    <span>AUTH_ID: HX_ENG_26</span>
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
                                    name: "Zishan",
                                    role: "Event Coordinator",
                                    phone: "+91 80785 40523",
                                    phoneLink: "+91XXXXXXXXXX",
                                    email: "u2308046@rajagiri.edu.in"
                                },
                                {
                                    name: "Sheba Reji",
                                    role: "Event Coordinator",
                                    phone: "+91 98468 78510",
                                    phoneLink: "+91XXXXXXXXXX",
                                    email: "shebarej2003@gmail.com"
                                },
                            ].map((contact, i) => (
                                <motion.div
                                    key={i}
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
                trackTitle="HELIX"
                fontClass="font-display"
                onComplete={handleCountdownComplete}
            />
        </div>
    );
};

export default HeliX;
