import { motion } from "framer-motion";

interface TrackElapsedTimerProps {
    elapsed: { hours: number; minutes: number; seconds: number };
    fontClass?: string;
    labelClass?: string;
    boxClass?: string;
    numberClass?: string;
    glowColor?: string;
}

const TrackElapsedTimer = ({
    elapsed,
    fontClass = "font-mono",
    labelClass = "font-mono text-xs text-primary/60 tracking-[0.3em] uppercase",
    boxClass = "bg-card border border-border card-beveled",
    numberClass = "font-mono text-4xl md:text-5xl text-primary",
    glowColor = "rgba(255,49,46,0.1)",
    className = "mt-8",
    label = "// EVENT STARTED",
}: TrackElapsedTimerProps & { className?: string; label?: string }) => {
    const units = [
        { value: elapsed.hours, label: "HOURS" },
        { value: elapsed.minutes, label: "MINS" },
        { value: elapsed.seconds, label: "SECS" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`text-center ${className}`}
        >
            {/* Label */}
            <span className={labelClass}>
        {label}
            </span>

            {/* Timer boxes */}
            <div className="flex justify-center gap-3 md:gap-6 mt-4 relative">
                {units.map((unit, i) => (
                    <div key={i} className="text-center">
                        <div className="relative">
                            <div className={`w-16 h-20 md:w-24 md:h-28 flex items-center justify-center ${boxClass}`}>
                                <span className={numberClass}>
                                    {String(unit.value).padStart(2, "0")}
                                </span>
                            </div>
                            {/* Glow */}
                            <div
                                className="absolute inset-0 blur-xl -z-10 rounded-xl"
                                style={{ backgroundColor: glowColor }}
                            />
                        </div>
                        <div className={`text-[10px] mt-2 tracking-widest ${fontClass} text-muted-foreground`}>
                            {unit.label}
                        </div>
                    </div>
                ))}

                {/* Pulsing colons - Centered between boxes */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-[7.5rem] text-primary text-3xl pointer-events-none h-20 md:h-28">
                    <span className="animate-pulse">:</span>
                    <span className="animate-pulse" style={{ animationDelay: "0.5s" }}>:</span>
                </div>
            </div>
        </motion.div>
    );
};

export default TrackElapsedTimer;
