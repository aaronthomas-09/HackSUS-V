import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Types ──────────────────────────────────────── */
interface Workshop {
    type: string;
    title: string;
    date: string;
    time: string;
    location: string;
    instructors: string[];
    status: "open" | "closed";
    registrationLink?: string;
}

interface TrackColumn {
    track: string;
    workshops: Workshop[];
}

/* ─── Data ───────────────────────────────────────── */
const columns: TrackColumn[] = [
    {
        track: "AstraX",
        workshops: [
            {
                type: "Workshop",
                title: "Observability for AI Agents: From Black Box to Glass Box",
                date: "7 - Feb - 2026",
                time: "9 AM - 10 AM",
                location: "Sycamore Lab 1, 3rd Floor, KE Block",
                instructors: ["Ansil H - AI Operations Lead at Cisco"],
                status: "open",
                registrationLink: "https://konfhub.com/hacksus-workshops",
            },
            {
                type: "Workshop",
                title: "Intro to RAG + Building better system and human prompts",
                date: "7 - Feb - 2026",
                time: "11:15 AM - 12:15 PM",
                location: "Sycamore Lab 2, 3rd Floor, KE Block",
                instructors: [" Abhiram NJ - Software Engineer, T4GC"],
                status: "open",
                registrationLink: "https://konfhub.com/hacksus-workshops"
            },
            {
                type: "Talk Session",
                title: "Beyond Prompts",
                date: "7 - Feb - 2026",
                time: "2 PM - 3 PM",
                location: "Multimedia Hall, Main Block",
                instructors: ["Arun SR - KAAI"],
                status: "open",
                registrationLink: "https://konfhub.com/hacksus-workshops",
            },
            {
                type: "Talk Session",
                title: "The One-Year Window: Ship Before Everyone Figures It Out and Win",
                date: "7 - Feb - 2026",
                time: "3 PM - 4 PM",
                location: "Multimedia Hall, Main Block",
                instructors: ["Jonathan - Zach AI"],
                status: "open",
                registrationLink: "https://konfhub.com/hacksus-workshops",
            }
        ],
    },
    {
        track: "ScreenX",
        workshops: [
            {
                type: "Workshop",
                title: "Startups",
                date: "07 - Feb - 2026",
                time: "11 AM - 12 PM",
                location: "Multimedia Hall, Ground Floor, Main Block",
                instructors: ["Anthony Roy, CEO, Hytz"],
                status: "open",
                registrationLink: "https://konfhub.com/hacksus-workshops",
            },
            {
                type: "Workshop",
                title: "AD Film Production Process",
                date: "07 - Feb - 2026",
                time: "11 AM - 12 PM",
                location: "Quantum Lab, 1st Floor, Main Block",
                instructors: ["Rose Paul"],
                status: "open",
                registrationLink: "https://konfhub.com/hacksus-workshops",
            },
        ],
    },
    {
        track: "SyncConX",
        workshops: [
            {
                type: "Workshop",
                title: "Drivetrain for EV",
                date: "7 - Feb - 2026",
                time: "2 PM - 3 PM",
                location: "Sycamore Lab 2, 3rd Floor, KE Block",
                instructors: ["Mohamed Aslam, CEO, inQbe Innovations Pvt. Ltd., Kochi"],
                status: "open",
                registrationLink: "https://konfhub.com/hacksus-workshops",
            },
            {
                type: "Workshop",
                title: "Embedded systems",
                date: "07 - Feb - 2026",
                time: "11 AM - 12:30 PM",
                location: "Sycamore Lab 1, 3rd Floor, KE Block",
                instructors: ["Sajeesh K"],
                status: "open",
                registrationLink: "https://konfhub.com/hacksus-workshops",
            },
        ],
    },
];

/* ─── Component ──────────────────────────────────── */
export default function WorkshopsSection() {
    return (
        <section id="workshops" className="relative py-16 md:py-24 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

            <div className="container px-6 mx-auto">
                {/* ── Section Heading ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="font-mono text-sm text-primary tracking-[0.3em] uppercase">
            // Learn &amp; Build
                    </span>
                    <h2 className="font-display text-5xl md:text-6xl text-foreground mt-4 tracking-wide uppercase">
                        EVENT <span className="text-primary">WORKSHOPS</span>
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                        Hands-on sessions to gear you up for the hackathon. Each track has dedicated workshops.
                    </p>
                </motion.div>

                {/* ── Desktop: 3-column grid ── */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-8">
                    {columns.map((col, ci) => (
                        <motion.div
                            key={col.track}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{
                                duration: 0.6,
                                delay: ci * 0.12,
                                ease: [0.25, 0.1, 0.25, 1],
                            }}
                            className="flex flex-col gap-5"
                        >
                            {/* Column title */}
                            <h3 className="font-display text-3xl xl:text-4xl tracking-wider uppercase text-center bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
                                {col.track}
                            </h3>

                            {col.workshops.map((ws, wi) => (
                                <WorkshopCard key={wi} workshop={ws} index={ci * 3 + wi} />
                            ))}
                        </motion.div>
                    ))}
                </div>
                {/* ── Mobile: vertical stack ── */}
                <div className="lg:hidden flex flex-col gap-6">
                    {columns.flatMap((col) =>
                        col.workshops.map((ws, wi) => (
                            <div
                                key={`${col.track}-${wi}`}
                                className="w-full"
                            >
                                <WorkshopCard
                                    workshop={ws}
                                    index={wi}
                                    mobileTrack={col.track}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

/* ─── Card ───────────────────────────────────────── */
function WorkshopCard({
    workshop,
    index,
    mobileTrack,
}: {
    workshop: Workshop;
    index: number;
    mobileTrack?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.5,
                delay: 0.05 * index,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className="rounded-[1.5rem] lg:rounded-[1.875rem] border border-white/10 py-7 px-5 md:px-8 flex flex-col gap-4"
            style={{
                background: "rgba(36, 36, 36, 0.5)",
                backdropFilter: "blur(200px)",
                WebkitBackdropFilter: "blur(200px)",
            }}
        >
            {/* Mobile-only track title */}
            {mobileTrack && (
                <p className="font-display text-2xl tracking-wider uppercase bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent leading-tight">
                    {mobileTrack}
                </p>
            )}

            {/* Type badge */}
            <p className="text-sm md:text-base uppercase font-extrabold tracking-[.09rem] leading-tight bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">
                {workshop.type}
            </p>

            {/* Title */}
            <h4 className="font-bold text-xl md:text-2xl lg:text-[1.75rem] leading-tight text-white">
                {workshop.title}
            </h4>

            {/* Meta row: date · time · location */}
            <div className="flex flex-wrap items-center gap-y-3 text-white/90 text-sm md:text-base">
                {/* Date */}
                <span className="flex items-center gap-2 pr-3">
                    <Calendar className="w-4 h-4 shrink-0 text-white/70" />
                    <span className="font-medium tracking-wide">{workshop.date}</span>
                </span>
                <span className="h-4 w-px bg-white/20 mr-3" />

                {/* Time */}
                <span className="flex items-center gap-2 pr-3">
                    <Clock className="w-4 h-4 shrink-0 text-white/70" />
                    <span className="font-medium tracking-wide">{workshop.time}</span>
                </span>
                <span className="h-4 w-px bg-white/20 mr-3" />

                {/* Location */}
                <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-white/70" />
                    <span className="font-medium tracking-wide">{workshop.location}</span>
                </span>
            </div>

            {/* Instructors */}
            <div>
                <p className="text-base md:text-lg font-bold uppercase tracking-wide text-white mb-2">
                    Instructors
                </p>
                <ul className="flex flex-col lg:flex-row flex-wrap gap-y-1 gap-x-6">
                    {workshop.instructors.map((name, i) => (
                        <li
                            key={i}
                            className="relative text-white/80 tracking-wide pl-0 first:pl-0 lg:pl-0 text-sm md:text-base"
                        >
                            {name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Status */}
            <div className="mt-2">
                {workshop.status === "closed" ? (
                    <span className="text-sm md:text-base font-semibold text-red-400">
                        Registration for this session is now closed.
                    </span>
                ) : (
                    <Button variant="hero" size="default" className="font-BebasNeue font-weight-800  w-full text-sm">
                        <a
                            href={workshop.registrationLink || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10"
                        >
                            Register Now
                        </a>
                    </Button>
                )}
            </div>
        </motion.div>
    );
}


