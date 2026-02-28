import { motion } from "framer-motion";

const partners = [
    {
        name: "Amazon Web Services",
        logo: "/images/AWS_logo.png",
        // AWS logo is dark — no white background needed, use transparent
        lightBg: false,
        link: "https://communityday.awsugkochi.in/"
    },
    {
        name: "GDG Cloud Kochi",
        logo: "/images/GDG_Cloud_Kochi_logo.png",
        lightBg: false,
        cardClassName: "bg-[#F9F9F9]",
        link: "https://gdg.community.dev/gdg-cloud-kochi/",
        scale: 1.2,
        mobileScale: 1.8,
        mobileWidth: "50%"
    },
    {
        name: "Mindscore",
        logo: "/images/jakes-bejoy-logo_edited.PNG",
        lightBg: false
    },
    {
        name: "Water Metro Kochi",
        logo: "/images/waterMetro.webp",
        lightBg: false,
        link: "https://watermetro.co.in/"
    }
];

export default function CommunityPartnersSection() {
    return (
        <section className="relative py-16 md:py-20 overflow-hidden">

            <div className="container max-w-[1200px] px-6 mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex flex-col items-center gap-3 mb-12 text-center"
                >
                    <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                        Community Partners
                    </h2>
                    <div className="flex items-center gap-4 w-full max-w-xs mt-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
                    </div>
                </motion.div>

                {/* Logo Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    // 2-col on mobile, 4-col on md+
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
                >
                    {partners.map((partner, index) => (
                        <LogoCard key={partner.name} partner={partner} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// ─── Individual logo card ───────────────────────────────────────────────────

interface Partner {
    name: string;
    logo: string;
    lightBg?: boolean;
    maxWidth?: string;
    maxHeight?: string;
    scale?: number;
    className?: string;
    cardClassName?: string;
    link?: string;
    mobileScale?: number;
    mobileWidth?: string;
}

function LogoCard({
    partner,
    index,
}: {
    partner: Partner;
    index: number;
}) {
    const content = (
        <>
            <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-white/20" />

            <img
                src={partner.logo}
                alt={partner.name}
                draggable={false}
                className={["select-none object-contain", partner.className || ""].join(" ")}
                style={{
                    width: "var(--logo-width, 75%)",
                    maxWidth: partner.maxWidth || "175px",
                    maxHeight: partner.maxHeight || "100px",
                    transform: "scale(var(--logo-scale, 1))",
                } as React.CSSProperties}
            />
            <style>{`
                .partner-card-${index} {
                    --logo-scale: ${partner.scale || 1};
                    --logo-width: ${partner.mobileWidth || '75%'};
                }
                @media (min-width: 768px) {
                    .partner-card-${index} {
                        --logo-scale: ${partner.scale || 1};
                        --logo-width: auto;
                    }
                }
                @media (max-width: 767px) {
                    .partner-card-${index} {
                        --logo-scale: ${partner.mobileScale || partner.scale || 1};
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
                `partner-card-${index}`,
                partner.cardClassName || ""
            ].join(" ")}
            style={{
                backdropFilter: !partner.cardClassName ? "blur(10px)" : undefined,
                WebkitBackdropFilter: !partner.cardClassName ? "blur(10px)" : undefined,
                background: !partner.cardClassName ? "rgba(255, 255, 255, 0.06)" : undefined,
                borderRadius: "12px",
                minHeight: "140px",
            }}
        >
            {partner.link ? (
                <a
                    href={partner.link}
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
