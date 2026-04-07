import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const targetDate = new Date("2026-03-06T06:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: "DAYS" },
    { value: timeLeft.hours, label: "HOURS" },
    { value: timeLeft.minutes, label: "MINS" },
    { value: timeLeft.seconds, label: "SECS" },
  ];

  return (
    <section id="register" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent" />

      <div className="container px-6 relative text-center">
        {/* Header */}
        <span className="font-mono text-sm text-primary tracking-[0.3em]">// TIME IS RUNNING OUT</span>
        <h2 className="font-display text-5xl md:text-6xl text-foreground mt-4 mb-12">
          HackS'US <span className="text-primary">STARTS IN</span>
        </h2>

        {/* Countdown */}
        <div className="flex justify-center gap-4 md:gap-8 mb-12">
          {timeUnits.map((unit, i) => (
            <div key={i} className="text-center">
              <div className="relative">
                <div className="w-20 h-24 md:w-28 md:h-32 bg-card border border-border flex items-center justify-center card-beveled">
                  <span className="font-mono text-4xl md:text-5xl text-primary animate-count-up">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/10 blur-xl -z-10" />
              </div>
              <div className="font-mono text-xs text-muted-foreground mt-3 tracking-widest">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        {/* Separator colons */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-8 gap-[7rem] text-primary text-4xl font-mono">
          <span className="animate-pulse">:</span>
          <span className="animate-pulse" style={{ animationDelay: "0.5s" }}>:</span>
          <span className="animate-pulse" style={{ animationDelay: "1s" }}>:</span>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <a
            href="https://konfhub.com/hacksus-edition-5"
            target="_blank" rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-primary to-accent text-primary-foreground font-display text-xl tracking-widest uppercase px-12 py-5 hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_hsl(var(--electric-red)/0.5)] hover:shadow-[0_0_50px_hsl(var(--electric-red)/0.7)] rounded-2xl"
          >
            REGISTER NOW
          </a>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Limited spots available • Not Free to attend!
          </p>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
