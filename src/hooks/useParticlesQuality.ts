import { useEffect, useMemo, useState } from "react";

export type ParticlesQualityTier = "high" | "balanced" | "low";

type QualitySignals = {
  prefersReducedMotion: boolean;
  prefersReducedData: boolean;
  updateIsSlow: boolean;
  saveData: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  devicePixelRatio?: number;
};

function readSignals(): QualitySignals {
  if (typeof window === "undefined") {
    return {
      prefersReducedMotion: true,
      prefersReducedData: false,
      updateIsSlow: false,
      saveData: false,
      hardwareConcurrency: undefined,
      deviceMemory: undefined,
      devicePixelRatio: 1,
    };
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersReducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
  const updateIsSlow = window.matchMedia("(update: slow)").matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const saveData = Boolean(nav.connection?.saveData);

  return {
    prefersReducedMotion,
    prefersReducedData,
    updateIsSlow,
    saveData,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    devicePixelRatio: window.devicePixelRatio ?? 1,
  };
}

export function useParticlesQualityTier(): ParticlesQualityTier {
  const [tier, setTier] = useState<ParticlesQualityTier>("balanced");

  useEffect(() => {
    const signals = readSignals();

    if (signals.prefersReducedMotion || signals.prefersReducedData || signals.updateIsSlow || signals.saveData) {
      setTier("low");
      return;
    }

    const cores = signals.hardwareConcurrency ?? 8;
    const mem = signals.deviceMemory ?? 8;

    if (cores <= 4 || mem <= 4) {
      setTier("balanced");
      return;
    }

    setTier("high");
  }, []);

  return tier;
}

export type ParticleTuning = {
  maxFps: number;
  particleCount: number;
  particleBaseSize: number;
  speed: number;
  particleHoverFactor: number;
  pixelRatio: number;
  particleSpread: number;
  sizeRandomness: number;
};

export function useParticleTuning(): ParticleTuning {
  const tier = useParticlesQualityTier();

  return useMemo(() => {
    // The goal is "same vibe" with lower cost:
    // - Fewer particles, slightly larger points
    // - Lower FPS cap (still smooth because it's ambient)
    // - Cap DPR (fill-rate is the real killer for gl points)
    if (tier === "high") {
      return {
        maxFps: 50,
        particleCount: 185,
        particleBaseSize: 180,
        speed: 0.14,
        particleHoverFactor: 1.8,
        pixelRatio: 1.15,
        particleSpread: 12,
        sizeRandomness: 0.62,
      };
    }

    if (tier === "balanced") {
      return {
        maxFps: 45,
        particleCount: 130,
        particleBaseSize: 195,
        speed: 0.12,
        particleHoverFactor: 1.55,
        pixelRatio: 1,
        particleSpread: 12,
        sizeRandomness: 0.58,
      };
    }

    return {
      maxFps: 30,
      particleCount: 90,
      particleBaseSize: 210,
      speed: 0.1,
      particleHoverFactor: 1.25,
      pixelRatio: 1,
      particleSpread: 11,
      sizeRandomness: 0.5,
    };
  }, [tier]);
}
