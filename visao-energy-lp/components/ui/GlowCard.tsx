"use client";

import type { PointerEvent, ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

/** Card com borda em gradiente que acompanha o cursor (desktop). */
export function GlowCard({ children, className = "" }: GlowCardProps) {
  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div onPointerMove={handlePointerMove} className={`glow-card ${className}`}>
      {children}
    </div>
  );
}
