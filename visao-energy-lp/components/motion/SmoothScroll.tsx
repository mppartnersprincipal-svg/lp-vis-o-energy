"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { Globals } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

let instancia: Lenis | null = null;

/** Instância ativa do Lenis (null antes do ocioso ou com movimento reduzido) */
export const getLenis = (): Lenis | null => instancia;

export function SmoothScroll() {
  const reduzido = usePrefersReducedMotion();

  useEffect(() => {
    Globals.assign({ skipAnimation: reduzido });
    if (reduzido) return;
    // Inicia no ocioso: não disputa a thread principal com a hidratação (melhora TBT/LCP)
    let lenis: Lenis | null = null;
    const iniciar = () => {
      lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: true }); // o recuo da navbar vem do scroll-margin-top (globals.css)
      instancia = lenis;
    };
    const ocioso = typeof window.requestIdleCallback === "function";
    const id = ocioso ? window.requestIdleCallback(iniciar, { timeout: 2500 }) : window.setTimeout(iniciar, 1200);
    return () => {
      if (ocioso) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      lenis?.destroy();
      instancia = null;
    };
  }, [reduzido]);

  return null;
}
