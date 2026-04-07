
import { Calendar, Monitor, Users, Lightbulb, Ship, Zap } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * PreEventsTimeline component displaying the road to the hackathon
 */
const PreEventsTimeline = () => {
    const events = [
        {
            id: 1,
            date: "Feb 6, 2026",
            title: "Registration Opens",
            description: "Applications open for all tracks. Start forming your teams!",
            icon: <Users className="w-5 h-5 text-primary" />,
            align: "left"
        },
        {
            id: 2,
            date: "Feb 9, 2026",
            title: "Ship With AI",
            description: "An intensive 4-day sprint to master building and deploying web apps using AI coding agents.",
            icon: <Monitor className="w-5 h-5 text-primary" />,
            align: "right"
        },
        {
            id: 3,
            date: "Feb 19, 2026",
            title: "KRUIZE X",
            description: "An onboard Ideathon in Kochi Water Metro",
            icon: <Ship className="w-5 h-5 text-primary" />,
            align: "left",
            highlight: true,
            link: ""
        },
        {
            id: 6,
            date: "Mar 6, 2026",
            title: "HackSUS Edition V Begins",
            description: "The 42-hour marathon starts here.",
            icon: <Calendar className="w-5 h-5 text-primary" />,
            align: "center", // Special case for the final event
        }
    ];

    return (
        <section id="pre-events" className="py-24 relative overflow-hidden">
            <div className="container px-6 mx-auto">
                <div className="text-center mb-16">
                    <span className="font-mono text-sm text-primary tracking-[0.3em] uppercase">
                        // Road to HackSUS
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 mb-6">
                        <span className="text-primary">Pre-Events</span>  Timeline
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Get ready with our series of workshops and sessions leading up to the main event.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">

                    <div className="space-y-12">
                        {events.filter(e => e.id !== 6).map((event, index, filteredEvents) => (
                            <div
                                key={event.id}
                                className={`relative flex flex-col gap-8 ${event.align === "center"
                                    ? "justify-center items-center text-center py-6"
                                    : "md:flex-row"
                                    } ${event.align === "right" ? "md:flex-row-reverse" : ""}`}
                            >
                                {/* Line connecting to next event */}
                                {index !== filteredEvents.length - 1 && (
                                    <div className="absolute left-4 md:left-1/2 top-2 h-[calc(100%+3rem)] w-px bg-border md:-translate-x-1/2" />
                                )}

                                {/* Center marker for desktop, left marker for mobile */}
                                {event.id !== 6 && (
                                    <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-2 transform -translate-x-1/2 mt-1.5 z-10 bg-background
                    ${event.highlight
                                            ? "border-primary bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.5)] scale-125"
                                            : "border-primary"
                                        }
                    ${event.align === "center" ? "md:relative md:left-0 md:translate-x-0 md:mb-4" : ""}
                `} />
                                )}

                                {/* Content */}
                                <div className={`${event.align === 'center' ? 'ml-0' : 'ml-12'} md:ml-0 ${event.align === 'center' ? 'md:w-full' : 'md:w-1/2'} ${event.align === "left" ? "md:pr-12 md:text-right" :
                                    event.align === "right" ? "md:pl-12" :
                                        "md:max-w-md p-6 border border-primary/50 rounded-xl bg-primary/5 mx-auto"
                                    }`}>
                                    <div className={`inline-flex items-center gap-2 mb-2 text-sm text-primary font-mono
                    ${event.align === "left" ? "md:justify-end" : ""}
                    ${event.align === "center" ? "justify-center" : ""}
                  `}>
                                        {event.icon}
                                        <span>{event.date}</span>
                                    </div>

                                    <h3 className={`font-display text-2xl text-foreground mb-2 
                     ${event.highlight ? "text-3xl" : ""}
                  `}>
                                        {event.link ? (
                                            <Link to={event.link} className="hover:text-primary transition-colors inline-flex items-center gap-2">
                                                {event.title}
                                                <Zap className="w-5 h-5 text-primary animate-pulse" />
                                            </Link>
                                        ) : (
                                            event.title
                                        )}
                                    </h3>

                                    <p className="text-muted-foreground">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Empty space for the other side of the grid */}
                                {event.align !== "center" && <div className="hidden md:block md:w-1/2" />}
                            </div>
                        ))}
                    </div>

                    {/* HackSUS V Begins - Rendered Separately */}
                    {events.find(e => e.id === 6) && (
                        <div className="mt-12 flex justify-center items-center text-center">
                            {(() => {
                                const event = events.find(e => e.id === 6);
                                return (
                                    <div className="w-full md:max-w-md p-6 border border-primary/50 rounded-xl bg-primary/5">
                                        <div className="inline-flex items-center gap-2 mb-2 text-sm text-primary font-mono justify-center">
                                            {event.icon}
                                            <span>{event.date}</span>
                                        </div>
                                        <h3 className="font-display text-2xl text-foreground mb-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {event.description}
                                        </p>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PreEventsTimeline;
