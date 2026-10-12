"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** atraso em ms — use múltiplos de 80 para stagger */
  delay?: number;
  y?: number;
}

/**
 * Entrada padrão do design system: fade + slide-up ao entrar na tela.
 * Versão leve (CSS + um único IntersectionObserver compartilhado): a anterior criava um spring do
 * react-spring por instância e pesava na hidratação (TBT). Estilos em .revelar (globals.css).
 */
let observador: IntersectionObserver | null = null;

function observar(el: HTMLElement): () => void {
  if (!("IntersectionObserver" in window)) {
    el.dataset.visivel = "";
    return () => {};
  }
  observador ??= new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        (entrada.target as HTMLElement).dataset.visivel = "";
        observador?.unobserve(entrada.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  observador.observe(el);
  return () => observador?.unobserve(el);
}

export function Reveal({ children, className = "", delay = 0, y = 28 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    return el ? observar(el) : undefined;
  }, []);

  const estilo = { "--revelar-delay": `${delay}ms`, "--revelar-y": `${y}px` } as CSSProperties;
  return (
    <div ref={ref} className={`revelar ${className}`} style={estilo}>
      {children}
    </div>
  );
}
