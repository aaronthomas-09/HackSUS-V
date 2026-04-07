import { Terminal } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />

      <div className="container px-6 relative">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Left content - 3 columns */}
          <div
            className="md:col-span-3 space-y-8 p-8 rounded-2xl"
            style={{
              background: "rgba(0, 0, 0, 0.19)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Terminal-style header */}
            {/* <div className="flex items-center gap-3 text-scanline font-mono text-sm">
              <Terminal size={18} />
              <span className="typing-animation">./about --edition 5</span>
            </div> */}

            <h2 className="font-display text-5xl md:text-7xl text-foreground leading-none">
              42 HOURS.
              <br />
              <span className="text-primary">INFINITE</span>
              <br />
              POSSIBILITIES.
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              HackS'US Edition V is not just another hackathon—it's a 42-hour journey into
              the unknown. Where brilliant minds collide, ideas ignite, and the impossible
              becomes reality. This is where tomorrow's breakthroughs are born.
            </p>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Whether you're a seasoned developer, a creative designer, or a curious beginner,
              Edition V welcomes all who dare to push boundaries and challenge the status quo.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-4">
              {[
                { value: "5th", label: "Edition" },
                { value: "100+", label: "Projects Built" },
                { value: "15+", label: "Workshops" },
              ].map((stat, i) => (
                <div key={i} className="border-l-2 border-primary pl-4">
                  <div className="font-display text-3xl text-primary">{stat.value}</div>
                  <div className="font-mono text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - 2 columns */}
          <div className="md:col-span-2 relative">
            {/* Decorative grid */}
            <div className="absolute inset-0 dither opacity-50" />

            <div className="relative aspect-square bg-gradient-to-br from-charcoal to-smoke border border-border p-8 card-beveled">
              {/* Scanline overlay */}
              <div className="absolute inset-0 scanlines opacity-50" />

              {/* Terminal content */}
              <div className="relative z-10 font-mono text-sm space-y-4">
                <div className="text-scanline">$ system.status</div>
                <div className="text-muted-foreground">
                  <span className="text-primary">&gt;</span> Loading HackS'US v5.0...
                </div>
                <div className="text-muted-foreground">
                  <span className="text-primary">&gt;</span> Initializing chaos engine...
                </div>
                <div className="text-muted-foreground">
                  <span className="text-primary">&gt;</span> Connecting minds...
                </div>
                <div className="text-muted-foreground">
                  <span className="text-primary">&gt;</span> Innovation protocols: <span className="text-scanline">ACTIVE</span>
                </div>
                <div className="text-muted-foreground pt-4">
                  <span className="text-primary">&gt;</span> Ready for deployment.
                </div>
                <div className="text-scanline animate-pulse">█</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
