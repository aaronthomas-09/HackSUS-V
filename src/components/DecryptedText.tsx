import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

type AnimateOn = "view" | "hover" | "both";
type RevealDirection = "start" | "end" | "center";

interface DecryptedTextProps extends HTMLMotionProps<"span"> {
  text: string;
  characters?: string;
  numbersOnly?: boolean;
  speed?: number;
  speedMs?: number;
  durationMs?: number;
  useOriginalCharsOnly?: boolean;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: AnimateOn;

  // Legacy props kept for compatibility (unused in the new animation path).
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: RevealDirection;
}

export default function DecryptedText({
  text,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  numbersOnly = false,
  speed = 50,
  speedMs,
  durationMs,
  useOriginalCharsOnly = false,
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  ...props
}: DecryptedTextProps) {
  const effectiveSpeedMs = speedMs ?? speed;
  const effectiveDurationMs = durationMs ?? Math.max(900, text.length * 55);

  const protectedPunctuation = useMemo(
    () => new Set([".", ",", ":", ";", "+", "-", "–", "—", "/", "₹"]),
    [],
  );
  const containerRef = useRef<HTMLSpanElement>(null);

  const [displayText, setDisplayText] = useState(text);
  const [lockedIndex, setLockedIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const isProtected = useMemo(() => {
    return (char: string) => char === " " || protectedPunctuation.has(char);
  }, [protectedPunctuation]);

  const availableChars = useMemo(() => {
    if (numbersOnly) return "0123456789".split("");
    if (!useOriginalCharsOnly) return characters.split("");
    return Array.from(
      new Set(
        text
          .split("")
          .filter((c) => c !== " " && !protectedPunctuation.has(c)),
      ),
    );
  }, [characters, numbersOnly, protectedPunctuation, text, useOriginalCharsOnly]);

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      setLockedIndex(-1);
      setIsRunning(false);
      return;
    }

    let rafId = 0;
    let start = 0;
    let lastTick = 0;

    setIsRunning(true);

    const tick = (now: number) => {
      if (!start) {
        start = now;
        lastTick = now;
      }

      const elapsed = now - start;
      const t = Math.min(1, Math.max(0, elapsed / effectiveDurationMs));
      const k = Math.floor(t * text.length);

      if (now - lastTick >= effectiveSpeedMs) {
        lastTick = now;
        setLockedIndex((prev) => (k > prev ? k : prev));
        setDisplayText(() => {
          const locked = k;
          return text
            .split("")
            .map((originalChar, i) => {
              if (isProtected(originalChar)) return originalChar;
              if (i <= locked) return originalChar;
              if (availableChars.length === 0) return originalChar;
              return availableChars[Math.floor(Math.random() * availableChars.length)];
            })
            .join("");
        });
      }

      if (t >= 1) {
        setDisplayText(text);
        setLockedIndex(text.length);
        setIsRunning(false);
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [availableChars, effectiveDurationMs, effectiveSpeedMs, isActive, isProtected, text]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "both") return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !hasAnimated) {
          setIsActive(true);
          setHasAnimated(true);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn, hasAnimated]);

  const hoverProps =
    animateOn === "hover" || animateOn === "both"
      ? {
          onMouseEnter: () => setIsActive(true),
          onMouseLeave: () => setIsActive(false),
        }
      : {};

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...hoverProps}
      {...props}
    >
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const originalChar = text[index] ?? char;
          const locked = isProtected(originalChar) || !isRunning || index <= lockedIndex;
          return (
            <span key={index} className={locked ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
