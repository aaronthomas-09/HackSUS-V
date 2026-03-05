import { motion } from "framer-motion";

const sponsors = [
  {
    name: "Udbhava",
    logo: "/images/udbhava.PNG",
    cardClassName: "bg-[#adb5bd]",
    link: "https://udbhava.co/",
    scale: 1.2
  },
  {
    name: "Evolve",
    logo: "/images/evolve.PNG",
    link: "https://www.evolveroboticsindia.com/",
    scale: 1.2
  },
  {
    name: "CDAC",
    logo: "/images/cdac.svg",
    link: "https://www.cdac.in/"
  },
  {
    name: "Cachet KruizeX",
    logo: "/images/cachet_kruizeX.webp",
    link: ""
  },
  {
    name: "Hytz",
    logo: "/images/hytz.webp",
    link: "https://hytz.co.in/"
  },
  {
    name: "YlogX",
    logo: "/images/ylogxLogo.png",
    link: "https://ylogx.io/"
  },
  {
    name: "Zendt",
    logo: "/images/zendt.PNG",
    link: "https://www.zendtpayments.com/",
    scale: 1.3
  },
  {
    name: "Geotech",
    logo: "/images/geotech.webp",
    link: "",
    scale: 1.2,
    cardClassName: "bg-[#F9F9F9]"
  },
  {
    name: "Zach AI",
    logo: "/images/zachAI.webp",
    link: "",
    scale: 1.8,
    cardClassName: "bg-[#F1EFE7]"
  },
  {
    name: "CDISC",
    logo: "/images/cdisc.webp",
    link: ""
  }
];

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="relative py-16 md:py-20 overflow-hidden">

      <div className="container max-w-[1200px] px-6 mx-auto">
        {/* Heading - Font size matches "THE DETAILS" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-3 mb-12 text-center"
        >
          <h2 className="font-display text-5xl md:text-6xl text-foreground tracking-wide uppercase">
            OUR <span className="text-primary">SPONSORS</span>
          </h2>
          <div className="flex items-center gap-4 w-full max-w-xs mt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
          </div>
        </motion.div>

        {/* Logo Rows - Using flex for 4/4/2 split */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col gap-4 md:gap-6"
        >
          {/* First Row: 4 Logos */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {sponsors.slice(0, 4).map((sponsor, index) => (
              <div key={sponsor.name} className="w-[calc(50%-8px)] md:w-[260px]">
                <SponsorCard sponsor={sponsor} index={index} />
              </div>
            ))}
          </div>
          {/* Second Row: 4 Logos */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {sponsors.slice(4, 8).map((sponsor, index) => (
              <div key={sponsor.name} className="w-[calc(50%-8px)] md:w-[260px]">
                <SponsorCard sponsor={sponsor} index={index + 4} />
              </div>
            ))}
          </div>
          {/* Third Row: 2 Logos */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {sponsors.slice(8).map((sponsor, index) => (
              <div key={sponsor.name} className="w-[calc(50%-8px)] md:w-[260px]">
                <SponsorCard sponsor={sponsor} index={index + 8} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface Sponsor {
  name: string;
  logo: string;
  maxWidth?: string;
  maxHeight?: string;
  scale?: number;
  className?: string;
  cardClassName?: string;
  link?: string;
  mobileScale?: number;
  mobileWidth?: string;
}

function SponsorCard({
  sponsor,
  index,
}: {
  sponsor: Sponsor;
  index: number;
}) {
  const content = (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-white/20" />

      <img
        src={sponsor.logo}
        alt={sponsor.name}
        draggable={false}
        className={["select-none object-contain", sponsor.className || ""].join(" ")}
        style={{
          width: "var(--logo-width, 75%)",
          maxWidth: sponsor.maxWidth || "175px",
          maxHeight: sponsor.maxHeight || "100px",
          transform: "scale(var(--logo-scale, 1))",
        } as React.CSSProperties}
      />
      <style>{`
        .sponsor-card-${index} {
          --logo-scale: ${sponsor.scale || 1};
          --logo-width: ${sponsor.mobileWidth || '75%'};
        }
        @media (min-width: 768px) {
          .sponsor-card-${index} {
            --logo-scale: ${sponsor.scale || 1};
            --logo-width: auto;
          }
        }
        @media (max-width: 767px) {
          .sponsor-card-${index} {
            --logo-scale: ${sponsor.mobileScale || sponsor.scale || 1};
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
        `sponsor-card-${index}`,
        sponsor.cardClassName || ""
      ].join(" ")}
      style={{
        background: !sponsor.cardClassName ? "rgba(255, 255, 255, 0.06)" : undefined,
        borderRadius: "12px",
        minHeight: "140px",
      }}
    >
      {sponsor.link ? (
        <a
          href={sponsor.link}
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
