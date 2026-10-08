"use client";

import { animated, easings, useInView, useSpring } from "@react-spring/web";

interface CountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** atraso em ms — para contar um número depois do outro */
  delay?: number;
  /** barra em gradiente que enche junto com a contagem */
  comBarra?: boolean;
  className?: string;
}

const NUMERO = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

export function CountUp({ to, prefix = "", suffix = "", duration = 2400, delay = 0, comBarra = false, className }: CountUpProps) {
  // Só começa quando o número está bem dentro da tela, para o visitante ver a contagem
  const [ref, inView] = useInView({ once: true, rootMargin: "0px 0px -30% 0px" });
  const { progresso } = useSpring({
    progresso: inView ? 1 : 0,
    delay: inView ? delay : 0,
    config: { duration, easing: easings.easeOutCubic },
  });
  const final = `${prefix}${NUMERO.format(to)}${suffix}`;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        <animated.span>{progresso.to((p) => NUMERO.format(Math.round(p * to)))}</animated.span>
        {suffix}
      </span>
      {comBarra && (
        <span aria-hidden="true" className="mt-4 block h-[3px] w-full overflow-hidden rounded-full bg-white/8">
          <animated.span
            className="bg-sol block h-full origin-left rounded-full"
            style={{ transform: progresso.to((p) => `scaleX(${p})`) }}
          />
        </span>
      )}
    </span>
  );
}
