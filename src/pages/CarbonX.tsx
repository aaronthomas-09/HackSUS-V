import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, CircuitBoard, Cpu, Menu } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import ResponsiveParticles from "@/components/ResponsiveParticles";
import DecryptedText from "@/components/DecryptedText";
import ShinyText from "@/components/ShinyText";
import SpotlightCard from "@/components/SpotlightCard";
import TrueFocus from "@/components/TrueFocus";
import LogoLoop from "@/components/LogoLoop";
import { useParticleTuning } from "@/hooks/useParticlesQuality";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const carbonX = {
  eventName: "CARBONX",
  year: "2026",
  tagline: "INNOVATION BEYOND BOUNDARIES",
  prizeAmount: "₹1,00,000",
  description:
    "A 42 hour national hackathon where developers, innovators, and students from across India team up to build practical, high-impact solutions. The event brings together industry experts, mentors, and tech enthusiasts in a round-the-clock marathon of problem-solving, prototyping, and pure chaos-powered innovation.",
  date: "6–8 MARCH, 2026",
  city: "KOCHI",
  organizer:
    "Organized by Department of Electronics and Communication Engineering, Rajagiri School of Engineering & Technology (Autonomous)",
  registerUrls: {
    vegathon: "https://konfhub.com/carbonx",
    electrothon: "https://konfhub.com/carbonx",
  },
  stats: [
    { label: "DURATION", value: "42 hours" },
    { label: "PARTICIPANTS", value: "250+ expected" },
    { label: "VISITORS", value: "1000+ expected" },
  ],
  aboutLong:
    "CARBONX is the flagship hackathon initiative curated by the Department of Electronics and Communication Engineering, currently conducted as a dedicated track under Hacks’us, an innovation event organized by IEDC and IICRSET. CARBONX focuses on hardware-centric innovation, embedded systems, and electronics-driven problem solving, providing participants with a platform to design, prototype, and validate real-world engineering solutions. While hosted under Hacks’us for the present edition, CARBONX retains complete technical ownership by the department and is envisioned as an annual, independently conducted hackathon in the coming years. The initiative continues its collaboration with the Centre for Development of Advanced Computing (CDAC), reinforcing its emphasis on indigenous technology and deep-tech development.",
} as const;

const contactList = [
  {
    name: "Ashish John Binu",
    email: "binu.john.ashish@gmail.com",
    phone: "+91 81290 93676",
    phoneLink: "+918129093676",
    role: "Primary Coordinator",
  },
  {
    name: "Pooja S Nair",
    email: "poojanair6795@gmail.com",
    phone: "+91 70120 49388",
    phoneLink: "+917012049388",
    role: "General Support",
  },
  {
    name: "Kashinath P Menon",
    email: "kashinathpm10@gmail.com",
    phone: "+91 85901 94852",
    phoneLink: "+918590194852",
    role: "General Support",
  },
] as const;

const trackLaneUi = {
  vegathon: {
    icon: Cpu,
    lane: "SYSTEMS",
    patternClass:
      "bg-[radial-gradient(circle_at_1px_1px,rgba(255,49,46,0.14)_1px,transparent_1.6px)] [background-size:20px_20px]",
    washClass: "bg-gradient-to-br from-primary/10 via-transparent to-transparent",
    metaPillClass: "border-primary/25 bg-background/5 text-primary/90",
    metaIconClass: "text-primary/80",
    detailsVariant: "outline" as const,
    detailsClass:
      "border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/45",
    glassOverlayClass: "bg-gradient-to-br from-primary/10 via-transparent to-transparent",
  },
  electrothon: {
    icon: CircuitBoard,
    lane: "WORKFLOWS",
    patternClass:
      "bg-[radial-gradient(circle_at_1px_1px,rgba(255,49,46,0.16)_1px,transparent_1.35px)] [background-size:18px_18px]",
    washClass: "bg-gradient-to-br from-primary/10 via-transparent to-transparent",
    metaPillClass: "border-primary/25 bg-background/5 text-primary/90",
    metaIconClass: "text-primary/80",
    detailsVariant: "outline" as const,
    detailsClass:
      "border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/45",
    glassOverlayClass: "bg-gradient-to-br from-primary/10 via-transparent to-transparent",
  },
} as const;

type TrackKey = keyof typeof trackLaneUi;

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const items = sectionIds
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((x): x is { id: string; el: HTMLElement } => Boolean(x.el));
    if (items.length === 0) return;

    let rafId = 0;
    const getNavOffset = () => {
      const header = document.querySelector(".landing-header") as HTMLElement | null;
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      return headerHeight + 12; // a bit of breathing room under the fixed header
    };

    const compute = () => {
      // Pick the section whose midpoint is closest to a "focus line" inside the viewport.
      // This makes the active underline feel immediate when scrolling up/down (no need to
      // wait for a section to hit the exact top).
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

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mb-10 md:mb-14"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <span className="font-mono text-xs text-primary tracking-[0.34em] uppercase">
            // {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground tracking-wide">
            {title}
          </h2>
        </div>
        {description ? (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed md:max-w-md">
            {description}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

function GlassCard({
  className,
  children,
  overlayClassName = "bg-gradient-to-br from-primary/10 via-transparent to-transparent",
  ...props
}: React.ComponentProps<typeof Card> & {
  overlayClassName?: string;
}) {
  return (
    <Card
      {...props}
      className={cn(
        "relative overflow-hidden rounded-none card-beveled border-border/70 bg-card/80 backdrop-blur-sm shadow-[0_14px_50px_rgba(0,0,0,0.38)]",
        className,
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0", overlayClassName)} />
      <div className="relative h-full">{children}</div>
    </Card>
  );
}

function CarbonXNavbar({
  activeId,
  items,
  onNavigate,
}: {
  activeId: string;
  items: { id: string; label: string }[];
  onNavigate: (id: string) => void;
}) {
  const linksWrapRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

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
    (id: string) => {
      setMobileOpen(false);
      // Let Radix close animation + scroll locking settle before measuring scroll offset.
      window.setTimeout(() => onNavigate(id), 180);
    },
    [onNavigate],
  );

  return (
    <header className="landing-header w-full">
      <div className="landing-header-inner">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("top");
          }}
          className="flex items-center gap-3 text-foreground/90 hover:text-foreground transition-colors"
          aria-label="Go to top"
        >
          <img
            src="/images/Group%20(1).webp"
            alt="CarbonX logo"
            className="h-10 w-10 md:h-11 md:w-11 object-contain -translate-y-1"
          />
          <span className="font-mokoto tracking-[0.32em] text-[15px]">
            CARBONX
          </span>
        </a>

        <div
          ref={linksWrapRef}
          className="relative hidden md:flex items-center gap-6"
        >
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-2 h-0.5 w-px origin-left bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.35)] will-change-[transform]"
            animate={{
              x: indicator.left,
              scaleX: indicator.width,
              opacity: indicator.opacity,
            }}
            transition={{ type: "spring", stiffness: 520, damping: 42, mass: 0.25 }}
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
                "relative text-xs tracking-[0.28em] uppercase transition-colors",
                activeId === it.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {it.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate("tracks")}
            className="landing-nav-cta hidden md:inline-flex rounded-xl px-6 h-9 shadow-[0_10px_30px_hsl(var(--primary)/0.18)]"
          >
            CHOOSE TRACK <ArrowRight className="ml-1" />
          </Button>

          <Button
            onClick={() => onNavigate("tracks")}
            className="landing-nav-cta md:hidden inline-flex rounded-xl px-4 h-9 shadow-[0_10px_30px_hsl(var(--primary)/0.18)]"
          >
            TRACKS <ArrowRight className="ml-1" />
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden h-9 w-9 rounded-xl border-border/60 bg-background/10 text-foreground/90 hover:bg-background/15 hover:text-foreground"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/95 border-border/60 backdrop-blur-md px-6"
            >
              <div className="mt-10 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="font-mokoto tracking-[0.32em] text-[15px] text-foreground/90">
                    CARBONX
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {items.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => {
                        navigateFromSheet(it.id);
                      }}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-3 text-left transition-colors",
                        activeId === it.id
                          ? "bg-primary/10 text-foreground"
                          : "bg-background/0 text-muted-foreground hover:bg-background/10 hover:text-foreground",
                      )}
                    >
                      <span className="font-mono text-xs tracking-[0.34em] uppercase">
                        {it.label}
                      </span>
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full transition-opacity",
                          activeId === it.id ? "bg-primary opacity-100" : "bg-primary/70 opacity-0 group-hover:opacity-70",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </nav>

                <div className="pt-2">
                  <Button
                    onClick={() => {
                      navigateFromSheet("tracks");
                    }}
                    className="landing-nav-cta w-full rounded-xl h-11 shadow-[0_16px_46px_hsl(var(--primary)/0.18)]"
                  >
                    CHOOSE TRACK <ArrowRight className="ml-1" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const CarbonX = () => {
  const location = useLocation();
  const sectionIds = useMemo(
    () => ["about", "history", "tracks", "contacts"],
    [],
  );
  const activeId = useActiveSection(sectionIds);
  const particleColors = useMemo(() => ["#FFFFFF"], []);
  const particleTuning = useParticleTuning();
  const [magnetDisabled, setMagnetDisabled] = useState(true);
  const [isMobileTracks, setIsMobileTracks] = useState(false);
  const [openTrackDetails, setOpenTrackDetails] = useState<TrackKey | null>(null);
  const trackDetailsOpenTimerRef = useRef<number | null>(null);
  const partnerLogos = useMemo(
    () => [
      {
        node: (
          <span className="inline-flex items-center justify-center pl-2 pr-3 py-1 md:pr-4">
            <img
              src="/images/cdac.svg"
              alt="CDAC"
              className="h-[3.6rem] w-auto object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.36)] md:h-[4.2rem]"
            />
          </span>
        ),
        ariaLabel: "CDAC logo",
      },
      {
        node: (
          <span className="inline-flex items-center justify-center px-3 py-1 md:px-4">
            <img
              src="/images/enauts.svg"
              alt="ENAUTS"
              className="h-[4.8rem] w-auto object-contain opacity-95 scale-[1.25] drop-shadow-[0_10px_24px_rgba(0,0,0,0.36)] md:h-[7.4rem] md:scale-[1.55]"
            />
          </span>
        ),
        ariaLabel: "ENAUTS logo",
      },
      {
        node: (
          <span className="inline-flex items-center justify-center px-2 py-1">
            <img
              src="/images/rset_jubilee.webp"
              alt="RSET Silver Jubilee"
              className="h-[5.2rem] w-auto object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.36)] md:h-[6.8rem]"
            />
          </span>
        ),
        ariaLabel: "RSET Silver Jubilee logo",
      },
      {
        node: (
          <span className="inline-flex items-center justify-center px-2 py-1">
            <img
              src="/images/iic_logo.png"
              alt="RSET IIC"
              className="h-[5.4rem] w-auto object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.36)] md:h-[6.9rem]"
            />
          </span>
        ),
        ariaLabel: "RSET IIC logo",
      },
      {
        node: (
          <span className="inline-flex items-center justify-center px-2 py-1">
            <img
              src="/images/rset_iedc.PNG"
              alt="RSET IEDC"
              className="h-[3.4rem] w-auto object-contain opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.36)] md:h-[4.7rem]"
            />
          </span>
        ),
        ariaLabel: "RSET IEDC logo",
      },
    ],
    [],
  );
  const getNavOffset = useCallback(() => {
    const header = document.querySelector(".landing-header") as HTMLElement | null;
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    return Math.max(0, Math.round(headerHeight + 8));
  }, []);
  const scrollToSection = useCallback((id: string) => {
    window.requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const computed = window.getComputedStyle(el);
      const paddingTop = Number.parseFloat(computed.paddingTop || "0") || 0;
      const top =
        el.getBoundingClientRect().top +
        window.scrollY -
        getNavOffset() +
        paddingTop;
      // Keep the landing view stable on reload by not persisting section hashes.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }, [getNavOffset]);
  const openRegistration = useCallback(
    (track: keyof typeof carbonX.registerUrls) => {
      const url = carbonX.registerUrls[track];
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      scrollToSection(track === "vegathon" ? "track-vegathon" : "track-electrothon");
    },
    [scrollToSection],
  );
  const openTrackDetailsFromHome = useCallback(
    (track: TrackKey) => {
      scrollToSection("tracks");
      if (trackDetailsOpenTimerRef.current !== null) {
        window.clearTimeout(trackDetailsOpenTimerRef.current);
      }
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      trackDetailsOpenTimerRef.current = window.setTimeout(
        () => {
          setOpenTrackDetails(track);
          trackDetailsOpenTimerRef.current = null;
        },
        prefersReducedMotion ? 60 : 520,
      );
    },
    [scrollToSection],
  );

  useEffect(() => {
    // Prevent browser scroll restoration from skipping the hero on reload.
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMagnetDisabled(prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      scrollToSection(id);
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.hash, scrollToSection]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileTracks(event.matches);
    };
    setIsMobileTracks(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => () => {
    if (trackDetailsOpenTimerRef.current !== null) {
      window.clearTimeout(trackDetailsOpenTimerRef.current);
    }
  }, []);

  return (
    <main id="top" className="landing-surface relative text-foreground overflow-x-hidden">
      {/* Background: grid + stars/particles */}
      <div className="landing-bg pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
        <div
          className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.12]"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <ResponsiveParticles
          minWidth={768}
          className="landing-bg-particles absolute inset-0"
          particleColors={particleColors}
          particleCount={particleTuning.particleCount}
          particleSpread={particleTuning.particleSpread}
          speed={particleTuning.speed}
          particleBaseSize={particleTuning.particleBaseSize}
          sizeRandomness={particleTuning.sizeRandomness}
          moveParticlesOnHover={true}
          moveParticlesOnDeviceOrientation={false}
          deviceOrientationFactor={2.4}
          particleHoverFactor={particleTuning.particleHoverFactor}
          hoverMode="window"
          pauseOnScroll={true}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={particleTuning.pixelRatio}
          maxFps={particleTuning.maxFps}
        />
        <div className="absolute inset-0 bg-gradient-radial from-white/[0.05] via-transparent to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.8) 100%)",
          }}
        />
      </div>

      <div className="landing-content">
        <CarbonXNavbar
          activeId={activeId}
          items={[
            { id: "about", label: "ABOUT" },
            { id: "history", label: "HISTORY" },
            { id: "tracks", label: "TRACKS" },
            { id: "contacts", label: "CONTACTS" },
          ]}
          onNavigate={scrollToSection}
        />

        {/* Hero */}
        <section className="relative pt-12 md:pt-14 pb-4 md:pb-6">
          <div className="container max-w-[1100px] px-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="landing-hero"
            >
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.03 }}
                className="mb-1 mt-6 flex w-full max-w-full items-center justify-center gap-2 text-center sm:mb-1 sm:gap-3"
              >
                <span className="hidden h-px w-6 bg-border/60 sm:block" aria-hidden="true" />
                <span className="w-full max-w-[46ch] px-1 text-balance font-mono text-[9px] uppercase leading-[1.2] tracking-[0.12em] text-muted-foreground sm:max-w-none sm:px-0 sm:text-[10px] sm:leading-normal sm:tracking-[0.22em]">
                  <span className="text-muted-foreground/90">Presented by </span>
                  <span className="text-foreground/80">
                    Department of Electronics & Communication Engineering, RSET
                  </span>
                </span>
                <span className="hidden h-px w-6 bg-border/60 sm:block" aria-hidden="true" />
              </motion.p>

              <h1 className="landing-title">
                <ShinyText
                  text={carbonX.eventName}
                  disabled={magnetDisabled}
                  className="landing-brand"
                  speed={2.6}
                  delay={1.1}
                  spread={118}
                  color="hsl(var(--foreground) / 0.92)"
                  shineColor="hsl(var(--primary))"
                  yoyo={true}
                />{" "}
                <DecryptedText
                  text={carbonX.year}
                  animateOn="view"
                  speed={55}
                  durationMs={1400}
                  maxIterations={18}
                  numbersOnly={true}
                  parentClassName="landing-year"
                  encryptedClassName="text-muted-foreground"
                  aria-label={carbonX.year}
                />
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.07 }}
                className="mt-1 md:mt-2 mb-4 md:mb-5 flex flex-col items-center justify-center relative z-10 w-full"
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-white/20 block" aria-hidden="true" />
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.6em] text-muted-foreground/80 font-semibold flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary/60 blur-[0.5px]"></span>
                    Total Prize Pool
                    <span className="w-1 h-1 rounded-full bg-primary/60 blur-[0.5px]"></span>
                  </span>
                  <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-white/20 block" aria-hidden="true" />
                </div>
                <div className="relative inline-flex items-center justify-center mt-1">
                  <div className="absolute inset-0 bg-white/[0.03] blur-[40px] rounded-[100%] scale-[2]" />
                  <DecryptedText
                    text={carbonX.prizeAmount}
                    animateOn="view"
                    speed={55}
                    durationMs={1400}
                    maxIterations={18}
                    numbersOnly={true}
                    parentClassName="relative z-10 font-display text-[3.2rem] sm:text-[4rem] md:text-[5rem] leading-none tabular-nums tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_8px_32px_rgba(255,255,255,0.06)]"
                    className="mix-blend-screen"
                    encryptedClassName="opacity-30"
                    aria-label={`Total prize pool ${carbonX.prizeAmount}`}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
                className="landing-tracks-preview w-full max-w-[50rem]"
              >
                <div className="mx-auto rounded-none card-beveled border border-border/70 bg-card/40 backdrop-blur-sm px-4 py-2 md:px-5 md:py-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.34em] text-primary shadow-[0_0_0_1px_rgba(255,49,46,0.06),0_14px_40px_rgba(255,49,46,0.08)]">
                        2 TRACKS
                      </span>
                      <div className="font-mono text-[10px] tracking-[0.5em] text-muted-foreground">
                        PICK YOUR LANE
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => scrollToSection("tracks")}
                      className="hidden md:inline-flex items-center justify-center rounded-xl border border-border/70 bg-background/5 px-3.5 py-1.5 font-display text-[11px] tracking-[0.2em] text-foreground/90 transition hover:bg-background/10 hover:border-border/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label="Jump to the tracks section"
                    >
                      VIEW TRACKS <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {[
                      {
                        badge: "01",
                        title: "VEGATHON",
                        meta: "VEGA Processor",
                        blurb: "System-level builds inspired by indigenous processor lineage.",
                        registerKey: "vegathon",
                      },
                      {
                        badge: "02",
                        title: "ELECTROTHON",
                        meta: "EDA Based",
                        blurb: "Design, simulate, validate — ship clean electronic workflows.",
                        registerKey: "electrothon",
                      },
                    ].map((t) => {
                      const ui = trackLaneUi[t.registerKey as TrackKey];
                      const TrackIcon = ui.icon;

                      return (
                        <div
                          key={t.title}
                          className={cn(
                            "group relative flex flex-col justify-between h-full p-4 overflow-hidden border bg-background/5 transition-all duration-300 hover:bg-background/10 hover:border-primary/30",
                            t.badge === "01" ? "rounded-tl-2xl rounded-br-2xl border-border/40" : "rounded-tr-2xl rounded-bl-2xl border-border/40"
                          )}
                        >
                          {/* Grainy overlay */}
                          <div
                            className={cn(
                              "pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay",
                              ui.patternClass,
                            )}
                            aria-hidden="true"
                          />

                          {/* Top Meta info */}
                          <div className="relative z-10 flex items-start justify-between gap-4 mb-8">
                            <div>
                              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-muted-foreground/70 mb-1">
                                [ Track {t.badge} ]
                              </div>
                              <div className="font-display text-3xl leading-none text-foreground drop-shadow-sm group-hover:text-primary transition-colors duration-300">
                                {t.title}
                              </div>
                            </div>
                            <div className="flex flex-col items-end text-right">
                              <span className="inline-flex whitespace-nowrap h-6 sm:h-auto min-w-[125px] sm:min-w-0 items-center justify-center gap-1.5 px-2 py-0.5 font-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/80 border border-primary/20 rounded-sm bg-primary/5">
                                <TrackIcon className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                                {t.meta}
                              </span>
                              <div className="mt-1.5 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 uppercase">
                                {ui.lane}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="relative z-10 grow">
                            <p className="font-mono text-xs text-muted-foreground/80 leading-relaxed max-w-[85%] border-l border-primary/20 pl-3">
                              {t.blurb}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => openTrackDetailsFromHome(t.registerKey as TrackKey)}
                              className="h-8 px-0 hover:bg-transparent font-mono text-[10px] tracking-[0.3em] text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all"
                              aria-label={`View ${t.title} track details`}
                            >
                              [ DETAILS ]
                            </Button>

                            <Button
                              type="button"
                              onClick={() =>
                                openRegistration(
                                  t.registerKey as keyof typeof carbonX.registerUrls,
                                )
                              }
                              className="group/btn relative h-9 overflow-hidden rounded-none bg-transparent hover:bg-transparent border border-primary/30 px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-all duration-300 hover:border-primary hover:text-white"
                              aria-label={`Register for ${t.title} on KonfHub`}
                            >
                              <span className="absolute inset-0 bg-primary translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                              <span className="relative z-10 flex items-center gap-2">
                                REGISTER <ArrowRight className="h-3 w-3 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                              </span>
                            </Button>
                          </div>

                          {/* Huge background number */}
                          <div className="pointer-events-none absolute -bottom-12 -right-6 font-display text-[12rem] leading-none text-transparent opacity-5 [-webkit-text-stroke:1px_hsl(var(--foreground)_/_1)] font-bold group-hover:scale-110 transition-transform duration-700 ease-out">
                            {t.badge}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
                className="w-full"
              >
                <SpotlightCard
                  className="landing-stats mx-auto rounded-none card-beveled border border-border/70 bg-card/60 px-5 pb-5 md:px-6 p-0"
                  spotlightColor={"rgba(255, 49, 46, 0.14)"}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0">
                    {carbonX.stats.map((s, idx) => (
                      <div
                        key={s.label}
                        className={cn(
                          "px-4",
                          idx !== 0 && "sm:border-l sm:border-border/60",
                        )}
                      >
                        <div className="font-mono text-[10px] tracking-[0.44em] text-muted-foreground">
                          {s.label}
                        </div>
                        <div className="mt-2">
                          <DecryptedText
                            text={s.value}
                            animateOn="view"
                            speed={55}
                            maxIterations={16}
                            numbersOnly={true}
                            parentClassName="font-display text-xl tracking-wide"
                            className="text-foreground"
                            encryptedClassName="text-foreground"
                            aria-label={s.value}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="relative py-20 md:py-28 scroll-mt-24">
          <div className="container max-w-[1100px] px-6">
            <SectionHeading
              eyebrow="ABOUT"
              title={
                <>
                  What is <span className="font-mokoto">CARBONX</span>?
                </>
              }
              description="Hardware-first, department-led, and built for real-world engineering prototypes."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="lg:col-span-7"
              >
                <GlassCard className="p-7 md:p-8 h-full">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed md:text-justify hyphens-auto">
                    {carbonX.aboutLong}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Badge
                      className="rounded-full bg-primary/15 text-primary border border-primary/25"
                      variant="outline"
                    >
                      Hardware-centric
                    </Badge>
                    <Badge
                      className="rounded-full bg-background/10 text-muted-foreground border border-border/60"
                      variant="outline"
                    >
                      Embedded systems
                    </Badge>
                    <Badge
                      className="rounded-full bg-background/10 text-muted-foreground border border-border/60"
                      variant="outline"
                    >
                      Deep-tech development
                    </Badge>
                  </div>
                </GlassCard>
              </motion.div>

              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="h-full"
                >
                  <GlassCard className="p-7 md:p-8 h-full">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[10px] tracking-[0.52em] text-muted-foreground">
                          COLLABORATION
                        </div>
                        <div className="mt-2 font-display text-xl md:text-2xl tracking-wide">
                          Built with <span className="text-primary">CDAC</span>.
                        </div>
                      </div>
                      <img
                        src="/images/cdac.svg"
                        alt="CDAC logo"
                        className="h-11 w-auto shrink-0 object-contain opacity-90 sm:h-12 md:h-14"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                      Continuing collaboration with CDAC to reinforce indigenous technology and a
                      deep-tech engineering focus.
                    </p>

                    <div className="mt-6 h-px w-full bg-border/60" />
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {[
                        { label: "FOCUS", value: "Indigenous tech" },
                        { label: "MODE", value: "Hardware-first" },
                        { label: "OUTPUT", value: "Working prototypes" },
                        { label: "LEARNING", value: "Deep systems" },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="rounded-none card-beveled border border-border/70 bg-background/5 px-4 py-3"
                        >
                          <div className="font-mono text-[10px] tracking-[0.44em] text-muted-foreground">
                            {m.label}
                          </div>
                          <div className="mt-2 font-display text-sm tracking-wide text-foreground/90">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* History */}
        <section id="history" className="relative py-20 md:py-28 scroll-mt-24">
          <div className="container max-w-[1100px] px-6">
            <SectionHeading
              eyebrow="HISTORY"
              title={
                <>
                  From <span className="text-primary">VEGATHON</span> to{" "}
                  <span className="font-mokoto">CARBONX</span>
                </>
              }
              description="A hardware hackathon lineage focused on indigenous tech and deep systems learning."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-stretch">
              {[
                {
                  year: "2022",
                  title: "VEGATHON",
                  body:
                    "National-level hardware hackathon centered around the VEGA Processor, built with CDAC.",
                },
                {
                  year: "After",
                  title: "VEGATHON → CARBONX",
                  body:
                    "Evolved from VEGATHON into CARBONX to continue the hardware-first legacy under a stronger long-term identity.",
                },
              ].map((t, idx) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: idx * 0.04 }}
                  className="h-full"
                >
                  <GlassCard className="p-7 md:p-8 h-full">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="font-mono text-xs tracking-[0.38em] text-muted-foreground">
                        {t.year}
                      </div>
                      <div className="h-px flex-1 bg-border/60" />
                    </div>
                    <div className="mt-3 font-display text-xl tracking-wide">
                      {t.title}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t.body}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tracks */}
        <section id="tracks" className="relative py-20 md:py-28 scroll-mt-24">
          <div className="container max-w-[1100px] px-6">
            <SectionHeading
              eyebrow="TRACKS"
              title={
                <>
                  Two tracks. One <span className="text-primary">hardware-first</span> mindset.
                </>
              }
              description="Pick the lane that matches your build — embedded systems, processors, or electronic design workflows."
            />

            <TrueFocus
              className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8"
              itemClassName={cn("h-full cursor-pointer", isMobileTracks && "truefocus-mobile-item")}
              blurAmount={isMobileTracks ? 0 : 2.2}
              borderColor={isMobileTracks ? "transparent" : "hsl(var(--primary))"}
              glowColor={isMobileTracks ? "transparent" : "hsl(var(--primary) / 0.45)"}
              animationDuration={isMobileTracks ? 0 : 0.38}
            >
              {[
                {
                  id: "track-vegathon",
                  title: "VEGATHON (VEGA Processor)",
                  description:
                    "Build real-world hardware prototypes on RISC-V based Vega development boards.",
                  badge: "01",
                  registerKey: "vegathon",
                  ctaLabel: "VEGATHON",
                  writeupTitle: "VEGATHON 2026",
                  longDescription:
                    "VEGATHON 2026 is the RISC-V Vega Processor hardware track that challenges teams to turn bold ideas into working hardware prototypes using RISC-V based Vega development boards. If you're excited about building real-world tech on next-gen processor platforms, this is your arena.",
                  problemStatements: [
                    "Safety, Disaster & Emergency Response",
                    "Healthcare & Assistive Technology",
                    "Smart Agriculture & Food Security",
                    "Smart Cities & Infrastructure",
                    "Fiction in Real Life - Enhanced Gadgets",
                  ],
                  detailsListTitle: "Problem statements",
                },
                {
                  id: "track-electrothon",
                  title: "Electrothon (EDA Based)",
                  description:
                    "EDA-driven electronic design workflows — build, simulate, validate, and ship clean, practical implementations.",
                  badge: "02",
                  registerKey: "electrothon",
                  ctaLabel: "ELECTROTHON",
                  writeupTitle: "ELECTROTHON 2026",
                  longDescription:
                    "Step into the world of high-performance digital logic with Electrothon, a premier Electronic Design Automation (EDA) track designed for hardware enthusiasts and VLSI aspirants. Leveraging the power of the Xilinx Vivado Design Suite, participants will navigate the end-to-end hardware development lifecycle, from writing efficient Verilog HDL to generating synthesisable bitstreams. This track is designed to push the boundaries of FPGA-based design by challenging you to solve complex architectural problems while balancing timing, area, and power constraints. Whether you're developing custom RISC processors or advanced signal processing units, Electrothon provides the platform to showcase your technical depth and innovation in the VLSI domain. The problem statement will be announced at the beginning of the event.",
                  problemStatements: [
                    "Xilinx Vivado Design Suite workflows (synthesis → implementation → bitstream).",
                    "Efficient Verilog HDL and synthesizable RTL design.",
                    "Timing, area, and power-aware architectural tradeoffs.",
                    "Advanced FPGA builds: custom RISC processors, DSP units, and more.",
                    "Problem statement announced at event kickoff.",
                  ],
                  detailsListTitle: "Track highlights",
                },
              ].map((t) => {
                const registerKey = t.registerKey as TrackKey;
                const ui = trackLaneUi[registerKey];
                const TrackIcon = ui.icon;
                const detailsListTitle = (t.detailsListTitle ?? "Problem statements").trim();
                const detailsListLabel = detailsListTitle.toLowerCase();
                const hasDetails = Boolean(t.writeupTitle && t.longDescription && t.problemStatements);
                const isDetailsOpen = openTrackDetails === registerKey;

                return (
                  <motion.div
                    key={t.title}
                    id={t.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="h-full"
                  >
                    <Dialog
                      open={isDetailsOpen}
                      onOpenChange={(next) =>
                        setOpenTrackDetails(next ? registerKey : null)
                      }
                    >
                      <GlassCard
                        role={hasDetails ? "button" : undefined}
                        tabIndex={hasDetails ? 0 : -1}
                        aria-haspopup={hasDetails ? "dialog" : undefined}
                        onClick={() => {
                          if (!hasDetails) return;
                          setOpenTrackDetails(registerKey);
                        }}
                        onKeyDown={(e) => {
                          if (!hasDetails) return;
                          if (e.target !== e.currentTarget) return;
                          if (e.key !== "Enter" && e.key !== " ") return;
                          e.preventDefault();
                          setOpenTrackDetails(registerKey);
                        }}
                        className="p-6 sm:p-7 md:p-8 h-full"
                        overlayClassName="bg-[radial-gradient(140%_120%_at_24%_18%,rgba(255,255,255,0.035)_0%,transparent_58%),linear-gradient(to_bottom,rgba(0,0,0,0.02),rgba(0,0,0,0.18))]"
                      >
                        <div
                          className={cn(
                            "pointer-events-none absolute inset-0 opacity-[0.06]",
                            ui.patternClass,
                          )}
                          aria-hidden="true"
                        />
                        <div className="truefocus-content flex h-full flex-col">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <div className="order-2 min-w-0 sm:order-none">
                              <div className="font-display text-lg sm:text-xl md:text-2xl tracking-wide">
                                {t.title}
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                {t.description}
                              </p>
                              {t.writeupTitle && t.longDescription && t.problemStatements ? (
                                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                                  <Badge
                                    variant="outline"
                                    className="border-primary/30 bg-primary/5 text-primary/90 font-mono text-[10px] tracking-[0.24em] uppercase"
                                  >
                                    {t.problemStatements.length} {detailsListLabel}
                                  </Badge>
                                  <DialogTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex items-center rounded-full border border-border/70 bg-background/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/90 transition hover:border-primary/45 hover:bg-primary/10 hover:text-foreground"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      View details
                                      <ArrowRight className="ml-1.5 h-3 w-3" />
                                    </button>
                                  </DialogTrigger>
                                </div>
                              ) : null}
                            </div>

                            <div className="order-1 flex w-full shrink-0 flex-wrap items-center justify-between gap-2 sm:order-none sm:w-auto sm:flex-col sm:items-end sm:justify-start">
                              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.34em] text-primary shadow-[0_0_0_1px_rgba(255,49,46,0.06),0_14px_40px_rgba(255,49,46,0.08)]">
                                TRACK <span className="text-foreground/90">{t.badge}</span>
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.34em]",
                                  ui.metaPillClass,
                                )}
                              >
                                <TrackIcon
                                  className={cn("h-3.5 w-3.5", ui.metaIconClass)}
                                  aria-hidden="true"
                                />
                                {ui.lane} LANE
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto pt-6">
                            <div className="h-px w-full bg-border/70" />
                            <div className="mt-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                Registration is per-track. Choose your lane, then lock your spot.
                              </p>
                              <Button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openRegistration(
                                    t.registerKey as keyof typeof carbonX.registerUrls,
                                  );
                                }}
                                className="h-11 w-full rounded-xl px-7 font-display tracking-widest shadow-[0_14px_42px_hsl(var(--primary)/0.18)] sm:w-auto"
                              >
                                REGISTER {t.ctaLabel}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div
                          className="truefocus-veil pointer-events-none absolute inset-0"
                          aria-hidden="true"
                        />
                      </GlassCard>
                      {t.writeupTitle && t.longDescription && t.problemStatements ? (
                        <DialogContent
                          className="border-border/70 bg-[#07090d]/95 text-foreground backdrop-blur-md sm:max-w-[680px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DialogHeader>
                            <DialogTitle className="font-display text-2xl tracking-wide">
                              {t.writeupTitle}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                              {t.longDescription}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/90">
                              {detailsListTitle}
                            </p>
                            <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-sm text-foreground/90 leading-relaxed">
                              {t.problemStatements.map((statement) => (
                                <li key={statement}>{statement}</li>
                              ))}
                            </ol>
                          </div>
                        </DialogContent>
                      ) : null}
                    </Dialog>
                  </motion.div>
                );
              })}
            </TrueFocus>
          </div>
        </section>

        {/* Contacts */}
        <section id="contacts" className="relative py-20 md:py-28 scroll-mt-24">
          <div className="container max-w-[1100px] px-6">
            <SectionHeading
              eyebrow="CONTACTS"
              title={
                <>
                  Need help?{" "}
                  <span className="text-primary">Reach the core team.</span>
                </>
              }
              description="For registrations, logistics, and track-specific questions, connect with the leads below."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {contactList.map((contact, index) => (
                <motion.div
                  key={contact.email}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
                >
                  <GlassCard className="relative h-full p-6 md:p-7">
                    <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                      {contact.role}
                    </div>
                    <div className="mt-3 font-display text-xl md:text-2xl tracking-wide">
                      {contact.name}
                    </div>
                    <div className="mt-5 space-y-3 text-sm">
                      <a
                        href={`mailto:${contact.email}`}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 transition hover:border-primary/50 hover:bg-primary/5"
                      >
                        <span className="text-muted-foreground">Email</span>
                        <span className="text-foreground/90 group-hover:text-foreground">
                          {contact.email}
                        </span>
                      </a>
                      <a
                        href={`tel:${contact.phoneLink}`}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 transition hover:border-primary/50 hover:bg-primary/5"
                      >
                        <span className="text-muted-foreground">Phone</span>
                        <span className="text-foreground/90 group-hover:text-foreground">
                          {contact.phone}
                        </span>
                      </a>
                    </div>
                    <div
                      className="truefocus-veil pointer-events-none absolute inset-0"
                      aria-hidden="true"
                    />
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px 0px -10% 0px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
              className="mt-8 w-full"
            >
              <div className="w-full rounded-none card-beveled border border-border/70 bg-card/35 backdrop-blur-sm px-4 py-3 md:px-5">
                <div className="mb-2 flex items-center gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-muted-foreground sm:text-[10px]">
                    Presented Partners
                  </span>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                <LogoLoop
                  logos={partnerLogos}
                  speed={52}
                  gap={6}
                  logoHeight={72}
                  pauseOnHover={true}
                  fadeOut={false}
                  ariaLabel="CDAC and ENAUTS partner logos"
                  className="w-full py-1"
                  style={
                    {
                      "--logoloop-gap": "clamp(6px, 2vw, 14px)",
                      "--logoloop-logoHeight": "clamp(44px, 12vw, 72px)"
                    } as React.CSSProperties
                  }
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px 0px -20% 0px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mt-10 flex justify-center"
            >
              <Button
                onClick={() => scrollToSection("top")}
                className="rounded-xl px-7 h-11 font-display tracking-wider shadow-[0_10px_30px_hsl(var(--primary)/0.18)]"
              >
                BACK TO TOP <ArrowRight className="ml-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative isolate py-10 md:py-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border/70" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(640px_320px_at_50%_105%,hsl(var(--primary)/0.12),transparent_70%)]" />

          <div className="container max-w-[1100px] px-6">
            <div className="border border-border/70 bg-card/35 p-5 md:p-6">
              <div className="grid gap-5 md:grid-cols-12 md:items-start">
                <div className="md:col-span-7">
                  <div className="flex items-center gap-3">
                    <span className="font-mokoto tracking-[0.28em] text-[14px] text-foreground/90">
                      {carbonX.eventName}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {carbonX.year}
                    </span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>

                  <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-muted-foreground">
                    {carbonX.organizer}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                    <span className="text-primary">{carbonX.date}</span>
                    <span className="text-border">/</span>
                    <span>{carbonX.city}</span>
                    <span className="text-border">/</span>
                    <span>{carbonX.tagline}</span>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                    Quick links
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    {[
                      { id: "about", label: "ABOUT" },
                      { id: "history", label: "HISTORY" },
                      { id: "tracks", label: "TRACKS" },
                      { id: "contacts", label: "CONTACTS" },
                    ].map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => scrollToSection(it.id)}
                        className="inline-flex h-9 items-center justify-center border border-border/60 bg-background/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/85 transition hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {it.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => scrollToSection("top")}
                      className="col-span-2 inline-flex h-8 items-center justify-center border border-border/60 bg-background/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/85 transition hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      CARBONX
                    </button>
                  </div>

                  <div className="mt-3.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openRegistration("vegathon")}
                      className="h-9 w-full border-primary/30 bg-background/5 px-3.5 font-display text-[10px] tracking-[0.17em] text-primary hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                      aria-label="Register for Vegathon on KonfHub"
                    >
                      REGISTER VEGATHON <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openRegistration("electrothon")}
                      className="h-9 w-full border-primary/30 bg-background/5 px-3.5 font-display text-[10px] tracking-[0.17em] text-primary hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
                      aria-label="Register for Electrothon on KonfHub"
                    >
                      REGISTER ELECTROTHON <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-5 h-px w-full bg-border/60" />
              <div className="mt-3 flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <div>
                  © <span className="font-mokoto">{carbonX.eventName}</span> {carbonX.year}
                </div>
                <div>{carbonX.tagline}</div>
              </div>

              <div className="mt-3 border-t border-border/50 pt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/70 sm:text-[10px] sm:tracking-[0.24em]">
                <div className="mx-auto flex flex-col items-center justify-center gap-y-1 sm:flex-row sm:gap-x-2 sm:gap-y-0">
                  <span className="text-muted-foreground/80">Made by</span>

                  <span className="inline-flex flex-col items-center sm:flex-row sm:items-center">
                    <a
                      href="https://www.linkedin.com/in/shn101/"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="whitespace-nowrap text-primary/85 transition hover:text-primary hover:underline underline-offset-4"
                    >
                      Sree Harinandan
                    </a>

                    <span className="hidden sm:inline mx-2 text-primary/45">/</span>

                    <a
                      href="https://www.linkedin.com/in/arjun-satheesh-382377390?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="whitespace-nowrap text-primary/85 transition hover:text-primary hover:underline underline-offset-4"
                    >
                      Arjun Satheesh
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default CarbonX;
