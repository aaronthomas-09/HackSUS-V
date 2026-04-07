import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
  itemClassName?: string;
  children?: React.ReactNode;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = "True Focus",
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className,
  itemClassName,
  children,
}) => {
  const childItems = useMemo(() => React.Children.toArray(children).filter(Boolean), [children]);
  const isGroupMode = childItems.length > 0;
  const words = useMemo(() => (isGroupMode ? [] : sentence.split(separator)), [isGroupMode, sentence, separator]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(isGroupMode ? null : 0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (isGroupMode) return;
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex(prev => (Number(prev) + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [isGroupMode, manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = isGroupMode
      ? itemRefs.current[currentIndex]?.getBoundingClientRect()
      : wordRefs.current[currentIndex]?.getBoundingClientRect();
    if (!activeRect) return;

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, isGroupMode, words.length, childItems.length]);

  const handleMouseEnter = (index: number) => {
    if (isGroupMode || manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (isGroupMode) {
      setCurrentIndex(null);
      return;
    }
    if (manualMode) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div
      className={className ?? "relative flex gap-4 justify-center items-center flex-wrap"}
      ref={containerRef}
      onMouseLeave={isGroupMode ? handleMouseLeave : undefined}
      style={{ outline: "none", userSelect: "none" }}
    >
      {isGroupMode
        ? childItems.map((node, index) => {
            const isActive = index === currentIndex;
            const isDimmed = currentIndex !== null && !isActive;

            return (
              <div
                key={index}
                ref={el => {
                  itemRefs.current[index] = el;
                }}
                className={[
                  itemClassName,
                  isDimmed ? "truefocus-dimmed" : "",
                  isActive ? "truefocus-active" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={
                  {
                    "--tf-blur": `${blurAmount}px`,
                    outline: "none",
                    userSelect: "none"
                  } as React.CSSProperties
                }
                onMouseEnter={() => handleMouseEnter(index)}
              >
                {node}
              </div>
            );
          })
        : words.map((word, index) => {
            const isActive = index === currentIndex;
            return (
              <span
                key={index}
                ref={el => {
                  wordRefs.current[index] = el;
                }}
                className="relative text-[3rem] font-black cursor-pointer"
                style={
                  {
                    filter: manualMode
                      ? isActive
                        ? `blur(0px)`
                        : `blur(${blurAmount}px)`
                      : isActive
                        ? `blur(0px)`
                        : `blur(${blurAmount}px)`,
                    transition: `filter ${animationDuration}s ease`,
                    outline: "none",
                    userSelect: "none"
                  } as React.CSSProperties
                }
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {word}
              </span>
            );
          })}

      <motion.div
        className="absolute top-0 left-0 pointer-events-none box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: isGroupMode ? (currentIndex !== null ? 1 : 0) : currentIndex !== null && currentIndex >= 0 ? 1 : 0
        }}
        transition={{
          ...(isGroupMode
            ? { type: "spring", stiffness: 520, damping: 44, mass: 0.26 }
            : { duration: animationDuration })
        }}
        style={
          {
            "--border-color": borderColor,
            "--glow-color": glowColor
          } as React.CSSProperties
        }
      >
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] left-[-10px] border-r-0 border-b-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))"
          }}
        />
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] right-[-10px] border-l-0 border-b-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))"
          }}
        />
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] left-[-10px] border-r-0 border-t-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))"
          }}
        />
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] right-[-10px] border-l-0 border-t-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))"
          }}
        />
      </motion.div>
    </div>
  );
};

export default TrueFocus;
