import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FolderCode, Plug2, CircuitBoard, Hammer, Clapperboard, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

interface Track {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  bgColor: string;
  path: string;
}

const tracks: Track[] = [
  {
    icon: FolderCode,
    title: "AstraX (Software)",
    subtitle: "Software",
    description:
      "Integrate AI into software workflows to make them more efficient",
    gradient: "linear-gradient(135deg, #ff312e, #ff6b6b)",
    bgColor: "linear-gradient(135deg, #ff312e, #ff6b6b)",
    path: "/astraX",
  },
  {
    icon: CircuitBoard,
    title: "CarbonX (Electronics)",
    subtitle: "Electronics",
    description:
      "Build AI-enabled electronic systems that rethink and optimize everyday workflows.",
    gradient: "linear-gradient(135deg, #ff312e, #ff6b6b)",
    bgColor: "linear-gradient(135deg, #ff312e, #ff6b6b)",
    path: "/carbonx",
  },
  {
    icon: Plug2,
    title: "SyncConX (EEE & Instrumentation)",
    subtitle: "EEE & Instrumentation",
    description:
      "Create data-driven electrical and instrumentation systems for smarter, more efficient workflows.",
    gradient: "linear-gradient(135deg, #ff312e, #8b0000)",
    bgColor: "linear-gradient(135deg, #ff312e, #8b0000)",
    path: "/syncconx",
  },
  {
    icon: Hammer,
    title: "HeliX (Civil)",
    subtitle: "Civil Engineering",
    description:
      "Integrate intelligent tools into civil engineering to build smarter, more efficient workflows.",
    gradient: "linear-gradient(135deg, #ff312e, #ff6b6b)",
    bgColor: "linear-gradient(135deg, #ff312e, #ff6b6b)",
    path: "/helix",
  },
  {
    icon: Clapperboard,
    title: "ScreenX (Film)",
    subtitle: "Film Production",
    description:
      "Create innovative film solutions that streamline, augment, and elevate production workflows.",
    gradient: "linear-gradient(135deg, #ff312e, #8b0000)",
    bgColor: "linear-gradient(135deg, #ff312e, #8b0000)",
    path: "/screenx",
  },
  {
    icon: Music,
    title: "UnmuteX (Music)",
    subtitle: "Music Production",
    description:
      "Create innovative music solutions that streamline, augment, and elevate production workflows.",
    gradient: "linear-gradient(135deg, #ff312e, #ff6b6b)",
    bgColor: "linear-gradient(135deg, #ff312e, #ff6b6b)",
    path: "/unmutex",
  },
];

const TracksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tracksRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const el = tracksRef.current;
        if (!el) return;

        const getScrollDistance = () =>
          el.scrollWidth - window.innerWidth + window.innerWidth * 0.05;

        gsap.to(el, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            invalidateOnRefresh: true,
            onEnter: () => document.body.classList.add("is-tracks-scrolling"),
            onLeave: () => document.body.classList.remove("is-tracks-scrolling"),
            onEnterBack: () => document.body.classList.add("is-tracks-scrolling"),
            onLeaveBack: () => document.body.classList.remove("is-tracks-scrolling"),
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="tracks" className="relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent pointer-events-none" />

      {/* Container — becomes pinned viewport on desktop */}
      <div className="min-h-screen flex flex-col justify-center py-16 md:py-0 overflow-hidden">
        {/* Section header */}
        <div className="text-center px-6 mb-10 md:mb-12 shrink-0">
          <span className="font-mono text-sm text-primary tracking-[0.3em]">
            // CHOOSE YOUR PATH
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-foreground mt-4">
            CHALLENGE <span className="text-primary">TRACKS</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Pick your battlefield. Each track offers unique challenges and
            dedicated prize pools.
          </p>
        </div>

        {/* ═══ Mobile: vertical stack ═══ */}
        <div className="md:hidden px-6 flex flex-col gap-6">
          {tracks.map((track, i) => (
            <TrackCard key={i} track={track} index={i} />
          ))}
        </div>

        {/* ═══ Desktop: GSAP-driven horizontal scroll ═══ */}
        <div className="hidden md:block overflow-hidden">
          <div
            ref={tracksRef}
            className="flex gap-8 pl-[5vw] pr-[10vw] will-change-transform"
          >
            {tracks.map((track, i) => (
              <TrackCard key={i} track={track} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────
   Track Card — horizontal layout, glassmorphism
   ──────────────────────────────────────────────── */
function TrackCard({ track, index }: { track: Track; index: number }) {
  return (
    <Link
      to={track.path}
      className="group block shrink-0 w-full md:w-[75vw] lg:w-[70vw] md:max-w-[1000px]
                 rounded-2xl overflow-hidden
                 transition-all duration-500
                 hover:shadow-[0_20px_60px_rgba(255,49,46,0.12)]
                 active:scale-[0.98]"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Left: Icon / Decorative area */}
        <div
          className="relative w-full md:w-[38%] min-h-[160px] md:min-h-[320px]
                     flex items-center justify-center p-8 md:p-12
                     overflow-hidden"
        >
          {/* Gradient tint */}
          <div
            className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500"
            style={{ background: track.bgColor }}
          />
          {/* Radial highlight */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              background:
                "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.12), transparent 60%)",
            }}
          />
          {/* Icon */}
          <track.icon
            className="w-16 h-16 md:w-24 md:h-24 text-white/70 relative z-10
                       drop-shadow-[0_0_30px_rgba(255,49,46,0.3)]
                       group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
          <span className="font-mono text-xs text-primary/50 tracking-[0.3em] mb-3">
            TRACK_{String(index + 1).padStart(2, "0")}
          </span>

          <h3
            className="font-display text-2xl md:text-4xl lg:text-5xl font-bold mb-2
                       bg-clip-text text-transparent uppercase leading-tight"
            style={{ backgroundImage: track.gradient }}
          >
            {track.title}
          </h3>

          <span className="text-xs md:text-sm font-semibold text-foreground/60 uppercase tracking-[0.2em] mb-4">
            {track.subtitle}
          </span>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 max-w-lg">
            {track.description}
          </p>

          <div className="mt-4">
            <Button
              variant="hero"
              size="sm"
              className="w-fit px-6 text-xs md:text-sm"
            >
              Explore Track{" "}
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TracksSection;
