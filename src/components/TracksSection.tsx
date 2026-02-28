import { FolderCode, Plug2, CircuitBoard, Hammer, Clapperboard, Music } from "lucide-react";
import { Link } from "react-router-dom";

const tracks = [
  {
    icon: FolderCode,
    title: "AstraX (Software)",
    description: "Integrate AI into software workflows to make them more efficient",
    color: "from-primary to-accent",
    path: "/astraX",
  },
  {
    icon: CircuitBoard,
    title: "CarbonX (Electronics)",
    description: "Build AI-enabled electronic systems that rethink and optimize everyday workflows.",
    color: "from-accent to-neon",
    path: "/carbonx",
  },
  {
    icon: Plug2,
    title: "SyncConX (EEE & Instrumentation)",
    description: "Create data-driven electrical and instrumentation systems for smarter, more efficient workflows.",
    color: "from-primary to-crimson",
    path: "/syncconx",
  },
  {
    icon: Hammer,
    title: "HeliX (Civil)",
    description: "Integrate intelligent tools into civil engineering to build smarter, more efficient workflows.",
    color: "from-accent to-primary",
    path: "/helix",
  },
  {
    icon: Clapperboard,
    title: "ScreenX (Film)",
    description: "Create innovative film solutions that streamline, augment, and elevate production workflows.",
    color: "from-primary to-accent",
    path: "/screenx",
  },
  {
    icon: Music,
    title: "UnmuteX (Music)",
    description: "Create innovative music solutions that streamline, augment, and elevate production workflows.",
    color: "from-primary to-accent",
    path: "/unmutex",
  },
];

const TracksSection = () => {
  return (
    <section id="tracks" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent pointer-events-none" />

      <div className="container px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-mono text-sm text-primary tracking-[0.3em]">// CHOOSE YOUR PATH</span>
          <h2 className="font-display text-5xl md:text-6xl text-foreground mt-4">
            CHALLENGE <span className="text-primary">TRACKS</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Pick your battlefield. Each track offers unique challenges and dedicated prize pools.
          </p>
        </div>

        {/* Tracks grid */}
        <div className="grid grid-cols-1 [@media(min-width:1016px)]:grid-cols-3 lg:grid-cols-3 gap-6">
          {tracks.map((track, i) => (
            <Link
              key={i}
              to={track.path}
              className="group relative bg-card border border-border p-8 hover-glow transition-all duration-500"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with glow */}
                <div className="w-16 h-16 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <track.icon className="w-8 h-8 text-primary relative z-10" />
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl text-foreground mb-4 group-hover:text-primary transition-colors">
                  {track.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {track.description}
                </p>

                {/* Visit page */}
                <p className="text-primary text-sm font-semibold drop-shadow-[0_0_8px_rgba(var(--color-primary),0.6)] group-hover:drop-shadow-[0_0_16px_rgba(var(--color-primary),0.8)] transition-all duration-500">
                  Click for more details <span className="text-primary">→</span>
                </p>

                {/* Bottom accent line */}
                <div className="mt-6 h-0.5 bg-border group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-transparent transition-all duration-500" />
              </div>

              {/* Corner decoration */}
              <div className="absolute top-4 right-4 font-mono text-xs text-muted-foreground opacity-50">
                TRACK_{String(i + 1).padStart(2, "0")}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TracksSection;
