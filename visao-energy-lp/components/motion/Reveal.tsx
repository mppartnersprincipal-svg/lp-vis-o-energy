"use client";

import type { ReactNode } from "react";
import { animated, config, useInView } from "@react-spring/web";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** atraso em ms — use múltiplos de 80 para stagger */
  delay?: number;
  y?: number;
}

/** Entrada padrão do design system: fade + slide-up ao entrar na tela. */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const [ref, springs] = useInView(
    () => ({
      from: { opacity: 0, y },
      to: { opacity: 1, y: 0 },
      delay,
      config: config.gentle,
    }),
    { rootMargin: "0px 0px -10% 0px", once: true },
  );

  return (
    <animated.div
      ref={ref}
      className={className}
      style={{
        opacity: springs.opacity,
        transform: springs.y.to((v) => `translate3d(0, ${v}px, 0)`),
      }}
    >
      {children}
    </animated.div>
  );
}
