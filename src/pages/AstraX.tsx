import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Instagram, Linkedin, Facebook, Twitter, Zap, Brain, Cpu, Sparkles, Code, Database, Network, Menu, FileText, ExternalLink } from "lucide-react";

import LogoLoop from "@/components/LogoLoop";
import ResponsiveParticles from "@/components/ResponsiveParticles";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useParticleTuning } from "@/hooks/useParticlesQuality";
import GraphNetwork from "@/components/GraphNetwork";


// ==================== NEURAL NETWORK BACKGROUND (OPTIMIZED) ====================
function NeuralNetwork() {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const nodeCount = 30;
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
    }));

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', setCanvasSize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodesRef.current.forEach((node, i) => {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          node.x -= dx * 0.01;
          node.y -= dy * 0.01;
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 49, 46, 0.6)';
        ctx.fill();

        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            const opacity = (1 - distance / 120) * 0.3;
            ctx.strokeStyle = `rgba(255, 49, 46, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setCanvasSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}

// ==================== ACTIVE SECTION TRACKING ====================
function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const items = sectionIds
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((x) => Boolean(x.el));
    if (items.length === 0) return;

    let rafId = 0;
    const getNavOffset = () => {
      const header = document.querySelector(".astrax-header");
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      return headerHeight + 12;
    };

    const compute = () => {
      const focusY = getNavOffset() + window.innerHeight * 0.36;
      let bestId = items[0]?.id ?? "";
      let bestDist = Number.POSITIVE_INFINITY;

      for (const it of items) {
        const rect = it.el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - focusY);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = it.id;
        }
      }

      setActive((prev) => (prev === bestId ? prev : bestId));
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        compute();
      });
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [sectionIds]);

  return active;
}

// ==================== HOLOGRAPHIC CARD (OPTIMIZED) ====================
function HolographicCard({ className = "", children, delay = 0, colorTheme = "red" }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  const gradientColors = {
    red: "rgba(255, 49, 46, 0.15), rgba(239, 68, 68, 0.1), rgba(251, 146, 60, 0.08)",
    blue: "rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.08)",
    mixed: "rgba(255, 49, 46, 0.12), rgba(59, 130, 246, 0.12), rgba(251, 146, 60, 0.08)",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all duration-500",
        isHovered
          ? "border-primary/40 bg-black/60 shadow-[0_0_60px_rgba(255,49,46,0.15)]"
          : "border-white/10 bg-black/40",
        className
      )}
    >
      {/* Holographic shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${gradientColors[colorTheme]}, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative backdrop-blur-md rounded-2xl p-1">
        <div className="relative z-10 p-8">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// ==================== SECTION HEADING ====================
function SectionHeading({ eyebrow, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-16 md:mb-20 text-center relative"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-32 h-32 bg-gradient-radial from-primary/20 via-blue-500/10 to-transparent rounded-full blur-xl opacity-60" />

      <span className="inline-block font-mono text-sm text-primary tracking-[0.4em] uppercase mb-6 relative">
        <span className="relative z-10">// {eyebrow}</span>
      </span>

      <h2 className="font-display text-5xl md:text-7xl text-foreground tracking-wide mb-6 leading-tight">
        {title}
      </h2>

      {description && (
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}

// ==================== NAVBAR ====================
function AstraXNavbar({ activeId, items, onNavigate }) {
  const linksWrapRef = useRef(null);
  const linkRefs = useRef({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const syncIndicator = useCallback(() => {
    const wrap = linksWrapRef.current;
    const activeEl = linkRefs.current[activeId];
    if (!wrap || !activeEl) return;

    const wrapRect = wrap.getBoundingClientRect();
    const linkRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: linkRect.left - wrapRect.left,
      width: linkRect.width,
      opacity: 1,
    });
  }, [activeId]);

  useLayoutEffect(() => {
    syncIndicator();
  }, [syncIndicator, items]);

  useEffect(() => {
    const wrap = linksWrapRef.current;
    if (!wrap) return;

    const onResize = () => syncIndicator();
    window.addEventListener("resize", onResize, { passive: true });

    const ro = new ResizeObserver(() => syncIndicator());
    ro.observe(wrap);
    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [syncIndicator]);

  const navigateFromSheet = useCallback(
    (id) => {
      setMobileOpen(false);
      window.setTimeout(() => onNavigate(id), 180);
    },
    [onNavigate]
  );

  return (
    <header className="astrax-header fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
      <div className="container max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-foreground/90 hover:text-foreground transition-colors"
          >
            <img
              src="/images/hacksus_logo.webp"
              alt="Hacks'us"
              className="h-10 w-10 md:h-11 md:w-11 object-contain"
            />
          </motion.a>

          <div className="h-8 w-px bg-white/10" />

          <motion.a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("top");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 text-foreground/90 hover:text-foreground transition-colors"
          >
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-red-500 to-orange-500" />
              <div className="absolute inset-0.5 rounded-full bg-black flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
            <span className="font-display tracking-[0.25em] text-base font-semibold">ASTRAX</span>
          </motion.a>
        </div>

        <div ref={linksWrapRef} className="hidden md:flex items-center gap-10 relative">
          <motion.div
            className="absolute -bottom-3 h-1 rounded-full origin-left"
            style={{
              background: "linear-gradient(90deg, rgba(255,49,46,0.8), rgba(59,130,246,0.6), rgba(251,146,60,0.8))",
              boxShadow: "0 0 20px rgba(255,49,46,0.4), 0 0 40px rgba(59,130,246,0.2)",
            }}
            animate={{
              x: indicator.left,
              scaleX: indicator.width / 100,
              opacity: indicator.opacity,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.5,
            }}
          />
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              ref={(el) => {
                linkRefs.current[it.id] = el;
              }}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(it.id);
              }}
              className={cn(
                "relative text-sm tracking-[0.3em] uppercase transition-all duration-300 font-medium",
                activeId === it.id
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              )}
            >
              {it.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.a
            href="https://www.instagram.com/articon.rset/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center"
          >
            <img
              src="/images/articon_logo.png"
              alt="Articon"
              className="h-14 w-auto object-contain"
              style={{ filter: "brightness(0) saturate(100%) invert(17%) sepia(95%) saturate(7000%) hue-rotate(355deg) brightness(105%) contrast(115%)" }}
            />
          </motion.a>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden h-10 w-10 rounded-xl border-white/10 bg-white/5 text-foreground/90 hover:bg-white/10 backdrop-blur-xl"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/95 border-white/10 backdrop-blur-xl px-6"
            >
              <div className="mt-10 flex flex-col gap-8">
                <div className="font-display tracking-[0.3em] text-lg text-foreground/90">
                  ASTRAX
                </div>

                <nav className="flex flex-col gap-3">
                  {items.map((it) => (
                    <motion.button
                      key={it.id}
                      type="button"
                      onClick={() => navigateFromSheet(it.id)}
                      whileHover={{ x: 4 }}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-4 py-4 text-left transition-all duration-300",
                        activeId === it.id
                          ? "bg-gradient-to-r from-primary/20 to-transparent text-foreground border border-primary/30"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-transparent"
                      )}
                    >
                      <span className="font-mono text-sm tracking-[0.35em] uppercase font-medium">
                        {it.label}
                      </span>
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          activeId === it.id ? "bg-primary" : "bg-primary/50"
                        )}
                      />
                    </motion.button>
                  ))}
                </nav>

                {/* <Button
                  onClick={() => {
                    setMobileOpen(false);
                    window.open("https://konfhub.com/checkout/hacksus-edition-5?ticketId=74891", "_blank");
                  }}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-display text-sm tracking-wider shadow-[0_10px_30px_rgba(255,49,46,0.2)]"
                >
                  REGISTER NOW
                </Button> */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// ==================== KONFHUB REGISTRATION ====================
function KonfHubRegistration() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Ensure the script is only added once
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://widget.konfhub.com/widget.js";
    script.setAttribute("button_id", "btn_a4aeffd2c330");
    script.async = true;

    containerRef.current.appendChild(script);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.8 }}
      className="flex justify-center my-12"
    >
      <style>{`
        .konfhub-widget-container .reg-button {
          background-color: #ff312e !important;
          color: white !important;
          font-family: "Bebas Neue", sans-serif !important;
          font-weight: 500 !important;
          font-size: 1rem !important;
          letter-spacing: 0.2em !important;
          text-transform: uppercase !important;
          padding: 0 3rem !important;
          height: 3.5rem !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 0 40px rgba(255, 49, 46, 0.4) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
        }
        .konfhub-widget-container .reg-button:hover {
          background-color: rgba(255, 49, 46, 0.9) !important;
          box-shadow: 0 0 60px rgba(255, 49, 46, 0.6) !important;
          transform: translateY(-2px) !important;
        }
        .konfhub-widget-container .reg-button img {
          display: none !important;
        }
      `}</style>
      <div ref={containerRef} className="konfhub-widget-container" />
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================
const AstraX = () => {
  const sectionIds = useMemo(() => ["about", "contacts"], []);
  const activeId = useActiveSection(sectionIds);

  const [logoStep, setLogoStep] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const letters = ["A", "S", "T", "R", "A", "X"];
  const [showYear, setShowYear] = useState(false);

  const particleColors = useMemo(() => ["#ffffff"], []);
  const particleTuning = useParticleTuning();

  const partnerLogos = useMemo(
    () => [
      { node: <img src="/images/rset_iedc.PNG" alt="IEDC" className="h-16 w-auto object-contain opacity-90" />, ariaLabel: "IEDC" },
      { node: <img src="/images/iic_logo.png" alt="IIC" className="h-16 w-auto object-contain opacity-90" />, ariaLabel: "IIC" },
      { node: <img src="/images/articon_logo.png" alt="Articon" className="h-16 w-auto object-contain opacity-90" />, ariaLabel: "Articon" },
      { node: <img src="/images/rset_jubilee.png" alt="RSET Jubilee" className="h-16 w-auto object-contain opacity-90" />, ariaLabel: "RSET Jubilee" },
    ],
    []
  );

  // Problem statements data
  const problemStatements = useMemo(() => [
    {
      number: "01",
      title: "AI-Powered Interview Intelligence Agent for Real-Time Hiring Validation",
      pdfPath: "/docs/Astrax_Problem_Statements/Title1.pdf",
      gradient: "from-primary to-red-600",
      glowColor: "rgba(255,49,46,0.3)",
    },
    {
      number: "02",
      title: "AI-Driven Real-Time Maritime Voyage Risk Intelligence for Marine Insurance",
      pdfPath: "/docs/Astrax_Problem_Statements/Title2.pdf",
      gradient: "from-blue-500 to-cyan-500",
      glowColor: "rgba(59,130,246,0.3)",
    },
    {
      number: "03",
      title: "AI-Driven Mission-to-Procurement Automation Platform",
      pdfPath: "/docs/Astrax_Problem_Statements/Title3.pdf",
      gradient: "from-orange-500 to-amber-500",
      glowColor: "rgba(249,115,22,0.3)",
    },
    {
      number: "04",
      title: "AI-Powered Swimming Pool Detection for Home Insurance Underwriting & Claims Intelligence",
      pdfPath: "/docs/Astrax_Problem_Statements/Title4.pdf",
      gradient: "from-purple-500 to-pink-500",
      glowColor: "rgba(168,85,247,0.3)",
    },
  ], []);

  useEffect(() => {
    if (logoStep < letters.length) {
      const timer = setTimeout(() => {
        setLogoStep((prev) => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else if (logoStep === letters.length) {
      const timer = setTimeout(() => {
        setShowYear(true);
      }, 200);
      return () => clearTimeout(timer);
    } else if (showYear) {
      const timer = setTimeout(() => {
        setLogoStep(0);
        setShowYear(false);
        setAnimationKey(prev => prev + 1);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [logoStep, letters.length, showYear, animationKey]);

  const getNavOffset = useCallback(() => {
    const header = document.querySelector(".astrax-header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    return Math.max(0, Math.round(headerHeight + 8));
  }, []);

  const scrollToSection = useCallback(
    (id) => {
      window.requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        const computed = window.getComputedStyle(el);
        const paddingTop = Number.parseFloat(computed.paddingTop || "0") || 0;
        const top = el.getBoundingClientRect().top + window.scrollY - getNavOffset() + paddingTop;
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    },
    [getNavOffset]
  );

  useEffect(() => {
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  return (
    <div id="top" className="relative min-h-screen bg-black text-foreground overflow-x-hidden">
      {/* ==================== LAYERED BACKGROUND ==================== */}
      <div className="fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />

        <div
          className="absolute top-0 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-8"
          style={{
            background: "radial-gradient(circle, rgba(255,49,46,0.3) 0%, transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
          }}
        />

        <GraphNetwork
          gridSpacing={50}
          mouseRadius={300}
        />
      </div>

      {/* ==================== NAVBAR ==================== */}
      <AstraXNavbar
        activeId={activeId}
        items={[
          { id: "about", label: "ABOUT" },
          { id: "contacts", label: "CONTACTS" },
        ]}
        onNavigate={scrollToSection}
      />

      {/* ==================== HERO ==================== */}
      <section className="relative pt-32 pb-16 text-center">
        <div className="container max-w-[1200px] px-6 mx-auto">
          {/* Department label */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-mono text-sm tracking-[0.45em] text-muted-foreground uppercase mb-4"
          >
            Department of Artificial Intelligence & Data Science, RSET
          </motion.p>

          {/* Organizers */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center justify-center gap-5 mb-6 relative"
          >
            <div className="absolute inset-0 blur-3xl opacity-50 bg-[radial-gradient(circle,rgba(34,211,238,0.3)_0%,transparent_50%)]" />
            <span className="relative font-display text-2xl md:text-3xl tracking-[0.25em] text-cyan-400 font-bold drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">ARTICON</span>
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            <span className="relative font-display text-2xl md:text-3xl tracking-[0.25em] text-cyan-400 font-bold drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">IEDC</span>
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
            <span className="relative font-display text-2xl md:text-3xl tracking-[0.25em] text-cyan-400 font-bold drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">IIC</span>
          </motion.div>

          {/* Logo Animation */}
          <div className="min-h-[160px] flex items-center justify-center relative py-4 mb-4" key={animationKey}>
            <div
              className="absolute inset-0 blur-[80px] -z-10 opacity-40"
              style={{
                background: "radial-gradient(circle, rgba(255,49,46,0.4) 0%, transparent 70%)",
              }}
            />

            {logoStep < letters.length ? (
              <div className="flex items-center">
                {letters.slice(0, logoStep + 1).map((letter, index) => (
                  <motion.div
                    key={`${animationKey}-${index}`}
                    initial={{ x: 200, opacity: 0, scale: 0.5 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      scale: [0.5, 1.15, 0.97, 1],
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 18,
                      mass: 0.7,
                      delay: index * 0.12,
                    }}
                    className="font-mokoto text-6xl md:text-9xl font-bold text-primary drop-shadow-[0_0_40px_rgba(255,49,46,0.6)]"
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative flex items-baseline md:-mr-32"
              >
                <motion.h1
                  className="font-mokoto text-6xl md:text-9xl text-primary"
                  style={{ filter: "drop-shadow(0 0 60px rgba(255,49,46,0.5))" }}
                >
                  ASTRAX
                </motion.h1>

                {showYear && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    className="font-display text-4xl md:text-6xl text-primary/60 font-light ml-4"
                  >
                    2026
                  </motion.span>
                )}
              </motion.div>
            )}
          </div>

          {/* ==================== COMMUNITY PARTNERS ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-4 w-full max-w-lg">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-amber-400/60" />
              <span className="font-mono text-[12px] md:text-[13px] tracking-[0.5em] text-primary/90 uppercase whitespace-nowrap">
                Community Partners
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400/40 to-amber-400/60" />
            </div>
            <div className="flex items-center justify-center gap-8 md:gap-12">
              <img
                src="/images/AWS_logo.png"
                alt="Amazon Web Services"
                className="h-16 md:h-20 w-auto object-contain"
                style={{ filter: "brightness(1.3) contrast(1.1)" }}
              />
              <div className="w-px h-10 bg-white/15" />
              <div
                className="flex items-center justify-center rounded-xl px-4 py-2"
                style={{ background: "rgba(255, 255, 255, 0.14)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <img
                  src="/images/GDG_Cloud_Kochi_logo.png"
                  alt="GDG Cloud Kochi"
                  className="h-10 md:h-14 w-auto max-w-[150px] md:max-w-[190px] object-contain"
                />
              </div>
            </div>
          </motion.div>


          <KonfHubRegistration />

          {/* ==================== HERO LOWER: TWO COLUMN LAYOUT ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto"
          >
            {/* LEFT — Tagline + Prize Pool (dominant) */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/50 bg-black/50 backdrop-blur-xl p-8 flex flex-col justify-between text-left">
              {/* Pulsing red glow */}
              <motion.div
                className="absolute -inset-1 rounded-2xl blur-2xl -z-10"
                animate={{ opacity: [0.3, 0.45, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: "rgba(255,49,46,0.45)" }}
              />
              <div className="absolute top-0 left-0 w-32 h-32 rounded-tl-2xl"
                style={{ background: "radial-gradient(circle at top left, rgba(255,49,46,0.3) 0%, transparent 70%)" }}
              />

              {/* Tagline */}
              <div className="relative mb-6">
                <p className="font-mono text-xs tracking-[0.4em] text-primary/80 uppercase mb-4">
                  // Hackathon 2026
                </p>
                <p className="text-4xl md:text-5xl text-white font-bold leading-tight tracking-tight">
                  Designing Software
                  <br />
                  That{" "}
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400"
                    style={{ filter: "drop-shadow(0 0 25px rgba(255,49,46,0.9))" }}
                  >
                    Thinks
                  </span>
                  <span className="text-white/25">.</span>
                </p>
              </div>

              {/* Prize Pool */}
              <div className="relative">
                <p className="font-mono text-[11px] tracking-[0.45em] text-white/40 uppercase mb-1">
                  Total Prize Pool
                </p>
                <motion.p
                  className="font-display font-black leading-none"
                  style={{
                    fontSize: "clamp(4rem, 10vw, 6.5rem)",
                    background: "linear-gradient(135deg, #ff312e 0%, #ff6b6b 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  animate={{
                    filter: [
                      "drop-shadow(0 0 20px rgba(255,49,46,0.6))",
                      "drop-shadow(0 0 40px rgba(255,49,46,0.6))",
                      "drop-shadow(0 0 20px rgba(255,49,46,0.6))",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ₹50,000
                </motion.p>
              </div>
            </div>

            {/* RIGHT — Stats Grid */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
              <motion.div
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                style={{ background: "rgba(59,130,246,0.4)" }}
              />
              <div className="relative grid grid-cols-2 gap-4 h-full">
                {[
                  { icon: Zap, label: "Duration", value: "42 Hours", gradient: "from-primary to-red-500" },
                  { icon: Brain, label: "Expected", value: "200+", sub: "Participants", gradient: "from-blue-500 to-purple-500" },
                  { icon: Cpu, label: "Team Size", value: "4–6", sub: "Members", gradient: "from-orange-500 to-pink-500" },
                  { icon: Code, label: "Track", value: "Software", gradient: "from-green-500 to-emerald-500" },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.04 }}
                    className="flex flex-col gap-3 p-4 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                      stat.gradient
                    )}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-1">
                        {stat.label}
                      </div>
                      <div className="font-display text-2xl md:text-3xl text-foreground font-bold leading-tight">
                        {stat.value}
                      </div>
                      {stat.sub && (
                        <div className="text-xs text-muted-foreground/60 mt-0.5">{stat.sub}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section id="about" className="relative py-16 md:py-20 scroll-mt-24">
        <div className="container max-w-[1200px] px-6 mx-auto">
          <SectionHeading
            eyebrow="ABOUT"
            title={
              <>
                What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-orange-500">AstraX – Software</span>?
              </>
            }
            description="A hackathon by Articon × IEDC, focused on building intelligent systems that learn, optimize, and redefine efficiency."
          />

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {/* Main description */}
            <HolographicCard delay={0} colorTheme="red">
              <div className="flex items-start gap-5 mb-6">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-red-500/10 border border-primary/20"
                >
                  <Brain className="w-8 h-8 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-display text-3xl mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Intelligence First
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    A collaboration between Articon, IEDC & IIC
                  </p>
                </div>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                <span className="text-cyan-400 font-semibold">AstraX – Software</span> is a 42-hour AI-first hackathon
                proudly presented by <span className="text-primary font-semibold">Articon</span>, the flagship technical
                organization of the Department of Artificial Intelligence & Data Science at RSET.
              </p>

              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Built on the foundation of innovation and collaboration, AstraX brings together students, developers,
                and AI enthusiasts to build <span className="text-foreground font-medium">intelligent systems</span>,
                <span className="text-foreground font-medium"> scalable platforms</span>,
                <span className="text-foreground font-medium"> automation frameworks</span>, and
                <span className="text-foreground font-medium"> next-generation AI-powered software products</span>.
              </p>

              <p className="text-base text-muted-foreground leading-relaxed">
                Think systems that <span className="text-cyan-400">learn</span>.
                Think tools that <span className="text-cyan-400">optimize</span>.
                Think applications that <span className="text-cyan-400">redefine efficiency</span>.
              </p>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-sm font-mono text-primary tracking-wider">ARTICON</span>
                  </div>
                  <span className="text-muted-foreground">×</span>
                  <div className="px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                    <span className="text-sm font-mono text-cyan-400 tracking-wider">IEDC</span>
                  </div>
                  <span className="text-muted-foreground">×</span>
                  <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-sm font-mono text-primary tracking-wider">IIC</span>
                  </div>
                </div>
              </div>
            </HolographicCard>

            {/* Focus areas */}
            <HolographicCard delay={0.1} colorTheme="blue">
              <h3 className="font-display text-2xl mb-6 text-foreground">Technical Focus</h3>

              <div className="space-y-4">
                {[
                  { icon: Cpu, text: "Intelligent Systems & AI/ML", color: "from-primary to-red-500" },
                  { icon: Network, text: "Scalable Platforms", color: "from-blue-500 to-cyan-500" },
                  { icon: Zap, text: "Automation Frameworks", color: "from-orange-500 to-yellow-500" },
                  { icon: Code, text: "Next-Gen Software Products", color: "from-purple-500 to-pink-500" },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 8 }}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                      item.color
                    )}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-base text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-muted-foreground/80">
                  Organized by Articon in collaboration with IEDC & IIC
                </p>
              </div>
            </HolographicCard>
          </div>

          {/* ==================== PROBLEM STATEMENTS (REPLACED BADGE SECTION) ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-12"
          >
            <HolographicCard delay={0.2} colorTheme="mixed">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/10 border border-primary/20">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">Problem Statements</h3>
                  <p className="text-sm text-muted-foreground mt-1">Click any statement to view the full PDF</p>
                </div>
              </div>

              {/* Problem Statement Cards */}
              <div className="grid gap-4">
                {problemStatements.map((ps, index) => (
                  <motion.a
                    key={ps.number}
                    href={ps.pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ x: 6, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="group flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer"
                    style={{
                      boxShadow: "0 0 0 0 transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 4px 30px ${ps.glowColor}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
                    }}
                  >
                    {/* Number badge */}
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center font-mono font-bold text-white text-sm shadow-lg",
                      ps.gradient
                    )}>
                      {ps.number}
                    </div>

                    {/* Title */}
                    <p className="flex-1 text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                      {ps.title}
                    </p>

                    {/* Arrow icon */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 text-muted-foreground/50 group-hover:text-primary transition-colors duration-300">
                      <span className="hidden md:block text-xs font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">VIEW PDF</span>
                      <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-xs font-mono text-muted-foreground/60 tracking-wider">
                  4 PROBLEM STATEMENTS AVAILABLE · CLICK TO OPEN PDF
                </p>
              </div>
            </HolographicCard>
          </motion.div>
        </div>
      </section >

      {/* ==================== CONTACTS ==================== */}
      < section id="contacts" className="relative py-16 md:py-20 scroll-mt-24" >
        <div className="container max-w-[1200px] px-6 mx-auto">
          <SectionHeading
            eyebrow="CONTACTS"
            title={
              <>
                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Touch</span>
              </>
            }
            description="Have questions? Reach out to our core team for support and guidance."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Shone Kuncheria",
                role: "Event Coordinator",
                email: "shone.kuncheria@gmail.com",
                phone: "+91 94973 03875",
                phoneLink: "+919497303875",
                colorTheme: "red",
              },
              {
                name: "Giribala Arun",
                role: "Event Coordinator",
                email: "u2203099@rajagiri.edu.in",
                phone: "+91 89216 24767",
                phoneLink: "+918921624767",
                colorTheme: "blue",
              },
              {
                name: "Shwetha Prabhakaran",
                role: "General Support",
                email: "U2301197@rajagiri.edu.in",
                phone: "+91 90747 80066",
                phoneLink: "+919074780066",
                colorTheme: "mixed",
              },
            ].map((contact, index) => (
              <HolographicCard key={contact.name} delay={index * 0.1} colorTheme={contact.colorTheme}>
                <div className="font-mono text-xs tracking-[0.4em] text-primary/80 uppercase mb-4">
                  {contact.role}
                </div>

                <div className="font-display text-3xl mb-8 text-foreground">
                  {contact.name}
                </div>

                <div className="space-y-4">
                  <motion.a
                    href={`mailto:${contact.email}`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="block p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group"
                  >
                    <div className="text-xs text-muted-foreground mb-2">Email</div>
                    <div className="text-sm text-foreground/90 group-hover:text-primary transition-colors break-all">
                      {contact.email}
                    </div>
                  </motion.a>

                  <motion.a
                    href={`tel:${contact.phoneLink}`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="block p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group"
                  >
                    <div className="text-xs text-muted-foreground mb-2">Phone</div>
                    <div className="text-sm text-foreground/90 group-hover:text-primary transition-colors">
                      {contact.phone}
                    </div>
                  </motion.a>
                </div>
              </HolographicCard>
            ))}
          </div>
        </div>
      </section >

      {/* ==================== PARTNERS ==================== */}
      < section className="relative py-28 border-t border-white/5" >
        <div className="container max-w-[1200px] px-6 mx-auto">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HolographicCard colorTheme="mixed">
              <p className="mb-10 font-mono text-sm tracking-[0.4em] text-primary/80 uppercase text-center">
                Presented Partners
              </p>

              <LogoLoop
                logos={partnerLogos}
                speed={52}
                gap={24}
                pauseOnHover={false}
                fadeOut={false}
                className="mb-10"
              />

              <div className="text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base shadow-[0_10px_30px_rgba(255,49,46,0.3)] hover:shadow-[0_14px_42px_rgba(255,49,46,0.4)]"
                  >
                    <ArrowUp className="w-5 h-5 mr-2" />
                    Back To Top
                  </Button>
                </motion.div>
              </div>
            </HolographicCard>
          </motion.div>
        </div>
      </section >

      {/* ==================== SOCIAL FLOAT ==================== */}
      < motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 right-8 flex flex-col gap-3 z-50"
      >
        {
          [
            { icon: Instagram, href: "https://www.instagram.com/rsetiedc/", label: "Instagram" },
            { icon: Linkedin, href: "https://www.linkedin.com/company/rset-iedc/?originalSubdomain=in", label: "LinkedIn" },
            { icon: Facebook, href: "https://www.facebook.com/iedc.rset/", label: "Facebook" },
            { icon: Twitter, href: "https://x.com/rset_iedc", label: "Twitter/X" },
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-black/40 backdrop-blur-xl border border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all shadow-lg hover:shadow-primary/20"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 text-primary" />
            </motion.a>
          ))
        }
      </motion.div >

      {/* ==================== FOOTER ==================== */}
      < footer className="relative py-16 border-t border-white/5" >
        <div className="container max-w-[1200px] px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-base text-muted-foreground mb-6">
              Organized by Articon × IEDC
            </p>
            <p className="text-sm text-muted-foreground/60">
              © ASTRAX 2026 • Articon × IEDC × IIC
            </p>
          </motion.div>
        </div>
      </footer >
    </div >
  );
};

export default AstraX;