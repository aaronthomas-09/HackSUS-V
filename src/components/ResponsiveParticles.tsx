import { useEffect, useMemo, useState } from "react";

import Particles from "@/components/Particles";

type ResponsiveParticlesProps = React.ComponentProps<typeof Particles> & {
  minWidth?: number;
};

export default function ResponsiveParticles({
  minWidth = 768,
  ...props
}: ResponsiveParticlesProps) {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [minWidth, prefersReducedMotion]);

  if (!enabled) return null;
  return <Particles {...props} />;
}

