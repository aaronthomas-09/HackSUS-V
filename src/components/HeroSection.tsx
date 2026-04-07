import { Button } from "@/components/ui/button";
import { ChevronDown, Info, FileText, Layers, Mail, MapPin, Calendar } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import HackSUSTitle from "@/components/HackSUSTitle";

const HeroSection = () => {
  const dockItems = [
    {
      title: "About",
      icon: <Info className="h-full w-full" />,
      href: "#about",
    },
    {
      title: "Details",
      icon: <FileText className="h-full w-full" />,
      href: "#details",
    },
    {
      title: "Home",
      icon: <img src="/hacksus_logo.svg" alt="HackS'US" className="h-full w-full object-contain scale-[2]" />,
      href: "#",
    },
    {
      title: "Tracks",
      icon: <Layers className="h-full w-full" />,
      href: "#tracks",
    },
    {
      title: "Contact",
      icon: <Mail className="h-full w-full" />,
      href: "#footer",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanlines pt-16 pb-30">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/50 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-6 text-center translate-y-[-2.5em] sm:translate-y-[-5em]">
        {/* Main title */}
        <h1
          className="font-BrittanicBold text-6xl sm:text-7xl md:text-7xl lg:text-[6.5rem] leading-none mb-0 animate-fade-in select-none flex justify-center w-full"
          style={{ animationDelay: "0.5s" }}
        >
          <HackSUSTitle />
        </h1>

        {/* Edition image */}
        <div className="relative mb-4 -mt-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <img
            src="/images/EditionV-Ribbon.webp"
            alt="Edition V"
            className="mx-auto w-84 sm:w-80 md:w-96 lg:w-100"
          />
        </div>

        {/* Tagline */}
        <p
          className="font-mono text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          India's First AI-Workflow Hackathon
        </p>

        {/* Date and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          {/* Date */}
          <div className="flex items-center justify-center md:justify-beginning  gap-2 font-mono text-lg text-primary flex-wrap">
            <Calendar size={20} className="flex-shrink-0" />
            <p>MARCH 6-8, 2026</p>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center md:justify-start gap-4 font-mono text-lg text-primary">
            <MapPin size={20} className="flex-shrink-0" />
            <p className="text-left">Rajagiri School of Engineering & Techonology (Autonomous), Kochi</p>
          </div>
        </div>

        <div className="mt-2 mb-6 flex justify-center animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-5 py-2">
            <span className="font-monoBold text-xm uppercase tracking-[0.35em] text-primary">
              Early Bird Tickets
            </span>
            <span className="font-monoBold text-xm uppercase tracking-[0.2em] text-foreground/80">
              Selling Out Fast!
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: "1s" }}>
          <Button variant="hero" size="xl">
            <a href="https://konfhub.com/hacksus-edition-5" target="_blank" rel="noopener noreferrer" className="relative z-10">Register Now</a>
          </Button>
        </div>

        {/* Prize Pool Highlight */}
        <div className="mt-12 mb-8 animate-fade-in" style={{ animationDelay: "1.1s" }}>
          <div className="inline-block relative">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse-slow" />
            <div className="relative">
              <div className="font-monoBold text-xs sm:text-sm uppercase tracking-[0.5em] text-primary/80 mb-2">
                TOTAL PRIZE POOL
              </div>
              <div
                className="font-display text-7xl sm:text-8xl md:text-9xl text-foreground selection:bg-primary selection:text-white"
                style={{
                  textShadow: "0 0 20px rgba(255, 49, 46, 0.3), 0 0 40px rgba(255, 49, 46, 0.1)",
                  background: "linear-gradient(to bottom, #fff, #ff312e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                ₹2.5 LAKHS+
              </div>
            </div>
          </div>
        </div>

        {/* Other Stats */}
        <div
          className="grid grid-cols-2 gap-16 md:gap-24 max-w-lg mx-auto animate-fade-in"
          style={{ animationDelay: "1.3s" }}
        >
          {[
            { value: "42", label: "HOURS" },
            { value: "500+", label: "HACKERS" }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="font-display text-4xl md:text-5xl text-primary/90 group-hover:text-primary transition-all duration-300 group-hover:scale-110">
                {stat.value}
              </div>
              <div className="font-mono text-xs text-muted-foreground tracking-[0.3em] mt-2 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out dock-container">
        <FloatingDock items={dockItems} />
      </div>

      <style>{`
        body.is-tracks-scrolling .dock-container {
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, 20px);
        }
      `}</style>

      {/* Scroll indicator
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        aria-label="Scroll to content"
      >
        <ChevronDown size={32} />
      </a> */}
    </section>
  );
};

export default HeroSection;
