"use client";

import { animated, easings, useInView, useSpring } from "@react-spring/web";

interface CountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

const NUMERO = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

export function CountUp({ to, prefix = "", suffix = "", duration = 2000, className }: CountUpProps) {
  const [ref, inView] = useInView({ once: true, rootMargin: "0px 0px -15% 0px" });
  const { valor } = useSpring({
    valor: inView ? to : 0,
    config: { duration, easing: easings.easeOutExpo },
  });
  const final = `${prefix}${NUMERO.format(to)}${suffix}`;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true">
        {prefix}
        <animated.span>{valor.to((v) => NUMERO.format(Math.round(v)))}</animated.span>
        {suffix}
      </span>
    </span>
  );
}
