import { Calendar, MapPin, Users, Zap } from "lucide-react";

const details = [
  {
    icon: Calendar,
    title: "WHEN",
    value: "March 6-8, 2026",
    description: "March 6th, 7:30 pm to March 8th, 3:00pm",
  },
  {
    icon: MapPin,
    title: "WHERE",
    value: "Rajagiri School Of Engineering & Technology",
    description: "Rajagiri Valley, Kakkanad, Kerala",
  },
  {
    icon: Users,
    title: "WHO",
    value: "Students & Developers",
    description: "Teams of 4-6 hackers welcome",
  },
  {
    icon: Zap,
    title: "WHAT",
    value: "Build & Present",
    description: "Create workflows, win prizes",
  },
];

const DetailsSection = () => {
  return (
    <section id="details" className="relative py-24 md:py-32 bg-charcoal">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      <div className="container px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-mono text-sm text-primary tracking-[0.3em]">// EVENT INFO</span>
          <h2 className="font-display text-5xl md:text-6xl text-foreground mt-4">
            THE <span className="text-primary">DETAILS</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {details.map((detail, i) => (
            <div
              key={i}
              className="group card-beveled bg-background p-6 hover-glow transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/30 mb-6 group-hover:bg-primary/20 transition-colors">
                <detail.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Label */}
              <div className="font-mono text-xs text-muted-foreground tracking-widest mb-2">
                {detail.title}
              </div>

              {/* Value */}
              <h3 className="font-display text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                {detail.value}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {detail.description}
              </p>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
