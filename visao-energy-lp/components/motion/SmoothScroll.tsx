"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { Globals } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function SmoothScroll() {
  const reduzido = usePrefersReducedMotion();

  useEffect(() => {
    Globals.assign({ skipAnimation: reduzido });
    if (reduzido) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      anchors: { offset: -72 },
    });
    return () => lenis.destroy();
  }, [reduzido]);

  return null;
}
