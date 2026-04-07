import { motion } from "framer-motion";

const collaborators = [
    {
        name: "Articon",
        logo: "/images/articon_logo.png",
        link: "/astraX"
    },
    {
        name: "Apptronics",
        logo: "/images/apptronics.webp",
        link: "/syncconx",
        scale: 1.4,
        cardClassName: "bg-[#F9F9F9]"
    },
    {
        name: "eNauts",
        logo: "/images/enauts.svg",
        maxWidth: "175px",
        maxHeight: "100px",
        scale: 1.8,
        mobileScale: 1.2,
        link: "/carbonx"
    },
    {
        name: "Eluxtra",
        logo: "/images/eluxtra.webp",
        link: "/syncconx",
        scale: 1.4
    },
    {
        name: "ICI",
        logo: "/images/ici.webp",
        link: "/helix",
        scale: 1.2,
        cardClassName: "bg-[#F9F9F9]"
    }
];

export default function ClubCollaboratorsSection() {
    return (
        <section className="relative py-16 md:py-20 overflow-hidden">

            <div className="container max-w-[1200px] px-6 mx-auto">
                {/* Heading - Style matches Community Partners */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex flex-col items-center gap-3 mb-12 text-center"
                >
                    <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent uppercase">
                        Club Collaborators
                    </h2>
                    <div className="flex items-center gap-4 w-full max-w-xs mt-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
                    </div>
                </motion.div>

                {/* Logo Grid - Flexible wrap for 3/2 desktop and 2/2/1 mobile */}
                <div className="flex justify-center w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-[960px]"
                    >
                        {collaborators.map((collaborator, index) => (
                            <div key={collaborator.name} className="w-[calc(50%-8px)] md:w-[280px]">
                                <CollaboratorCard collaborator={collaborator} index={index} />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

interface Collaborator {
    name: string;
    logo: string;
    link?: string;
    maxWidth?: string;
    maxHeight?: string;
    scale?: number;
    className?: string;
    cardClassName?: string;
    mobileScale?: number;
    mobileWidth?: string;
}

function CollaboratorCard({
    collaborator,
    index,
}: {
    collaborator: Collaborator;
    index: number;
}) {
    const content = (
        <>
            <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-white/20" />

            <img
                src={collaborator.logo}
                alt={collaborator.name}
                draggable={false}
                className={["select-none object-contain", collaborator.className || ""].join(" ")}
                style={{
                    width: "var(--logo-width, 75%)",
                    maxWidth: collaborator.maxWidth || "175px",
                    maxHeight: collaborator.maxHeight || "100px",
                    transform: "scale(var(--logo-scale, 1))",
                } as React.CSSProperties}
            />
            <style>{`
                .collaborator-card-${index} {
                    --logo-scale: ${collaborator.scale || 1};
                    --logo-width: ${collaborator.mobileWidth || '75%'};
                }
                @media (min-width: 768px) {
                    .collaborator-card-${index} {
                        --logo-scale: ${collaborator.scale || 1};
                        --logo-width: auto;
                    }
                }
                @media (max-width: 767px) {
                    .collaborator-card-${index} {
                        --logo-scale: ${collaborator.mobileScale || collaborator.scale || 1};
                    }
                }
            `}</style>
        </>
    );

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
            whileHover={{ scale: 1.04 }}
            className={[
                "group relative flex items-center justify-center cursor-default overflow-hidden",
                `collaborator-card-${index}`,
                collaborator.cardClassName || ""
            ].join(" ")}
            style={{
                background: !collaborator.cardClassName ? "rgba(255, 255, 255, 0.06)" : undefined,
                borderRadius: "12px",
                minHeight: "140px",
            }}
        >
            {collaborator.link ? (
                <a
                    href={collaborator.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-full p-[18px]"
                >
                    {content}
                </a>
            ) : (
                <div className="flex items-center justify-center w-full h-full p-[18px]">
                    {content}
                </div>
            )}
        </motion.div>
    );
}
