import { motion, useScroll, useTransform } from "motion/react";

interface FilmReelBackgroundProps {
    /** Array of image, video, or YouTube embed URLs to display in the reel frames */
    images?: string[];
}

/** A single sprocket-hole row (horizontal dots) */
const SprocketRow = () => (
    <div className="film-reel-sprockets h-3 w-full flex-shrink-0" />
);

/** Extract YouTube video ID and return its thumbnail URL */
const getYouTubeThumbnail = (url: string): string | null => {
    const match = url.match(/youtube\.com\/embed\/([^?&/]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

/** A single frame that renders an image or video thumbnail */
const Frame = ({ src }: { src?: string }) => {
    const isVideo = src && /\.(mp4|webm|ogg)$/i.test(src);
    const ytThumb = src ? getYouTubeThumbnail(src) : null;

    return (
        <div className="film-reel-frame w-[120px] h-[160px] md:w-[210px] md:h-[268px] flex-shrink-0 mx-auto">
            {src ? (
                ytThumb ? (
                    <img
                        src={ytThumb}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : isVideo ? (
                    <video
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                )
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-black to-primary/10" />
            )}
        </div>
    );
};

/** A full vertical film strip with sprocket holes + frames */
const FilmStrip = ({
    images,
    frameCount = 12,
    duration = 50,
    reverse = false,
}: {
    images: string[];
    frameCount?: number;
    duration?: number;
    reverse?: boolean;
}) => {
    const frames = Array.from({ length: frameCount }, (_, i) =>
        images.length > 0 ? images[i % images.length] : undefined
    );

    const allFrames = [...frames, ...frames];
    const singleSetHeight = frameCount * (12 + 160 + 12 + 4);

    return (
        <div className="film-reel-strip w-[140px] md:w-[240px] overflow-hidden">
            <motion.div
                className="flex flex-col"
                animate={{ y: reverse ? [-singleSetHeight, 0] : [0, -singleSetHeight] }}
                transition={{ duration, repeat: Infinity, ease: "linear" }}
            >
                {allFrames.map((src, i) => (
                    <div key={i} className="flex flex-col items-center gap-0">
                        <SprocketRow />
                        <Frame src={src} />
                        <SprocketRow />
                        <div className="h-1" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const FilmReelBackground = ({ images = [
    "/images/inception.jfif",
    "/images/aadu2.webp",
    "/images/trumanShow.webp",
    "/images/bangaloreDays.webp"

] }: FilmReelBackgroundProps) => {
    const { scrollY } = useScroll();

    // Each reel moves at a different rate for depth
    const parallaxLeft = useTransform(scrollY, [0, 3000], [0, 450]);
    const parallaxCenter = useTransform(scrollY, [0, 3000], [0, -600]);
    const parallaxRight = useTransform(scrollY, [0, 3000], [0, 500]);

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 0, opacity: 0.3 }}
        >
            <div
                className="absolute inset-0"
                style={{
                    transform: "rotate(-18deg)",
                    transformOrigin: "center center",
                }}
            >
                {/* Left reel */}
                <motion.div className="absolute left-[-10%] md:left-[1%]" style={{ top: "-20%", height: "140%", y: parallaxLeft, willChange: "transform" }}>
                    <FilmStrip images={images} frameCount={14} duration={300} />
                </motion.div>

                {/* Center reel */}
                <motion.div className="absolute left-[33%] md:left-[42%]" style={{ top: "-20%", height: "140%", y: parallaxCenter, willChange: "transform" }}>
                    <FilmStrip images={images} frameCount={14} duration={280} reverse />
                </motion.div>

                {/* Right reel */}
                <motion.div className="absolute left-[75%] md:left-[81%]" style={{ top: "-20%", height: "140%", y: parallaxRight, willChange: "transform" }}>
                    <FilmStrip images={images} frameCount={14} duration={300} />
                </motion.div>
            </div>
        </div>
    );
};

export default FilmReelBackground;
