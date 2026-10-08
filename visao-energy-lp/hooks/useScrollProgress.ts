"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Progresso de scroll (0 → 1) de um elemento, num único loop rAF compartilhado.
 * - "pin": seção alta com filho sticky — 0 quando o topo encosta no topo da tela,
 *          1 quando o fim da seção encosta no fim da tela.
 * - "pass": 0 quando o elemento entra por baixo, 1 quando sai por cima.
 * Mede todos os elementos antes de aplicar (evita layout thrashing) e só roda
 * quando o scroll ou o tamanho da janela mudam.
 */
type Mode = "pin" | "pass";

interface Subscriber {
  measure: () => number;
  apply: (p: number) => void;
  last: number;
}

const subscribers = new Set<Subscriber>();
let rafId = 0;
let lastY = Number.NaN;
let lastH = Number.NaN;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function frame() {
  const y = window.scrollY;
  const h = window.innerHeight;
  if (y !== lastY || h !== lastH) {
    lastY = y;
    lastH = h;
    const medidas = Array.from(subscribers, (s) => [s, s.measure()] as const);
    for (const [s, p] of medidas) {
      if (Math.abs(p - s.last) > 0.0002) {
        s.last = p;
        s.apply(p);
      }
    }
  }
  rafId = requestAnimationFrame(frame);
}

function forceNextFrame() {
  lastY = Number.NaN;
}

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  mode: Mode = "pin",
  enabled = true,
) {
  const callback = useRef(onProgress);
  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    if (!enabled) return;
    const sub: Subscriber = {
      last: -1,
      measure: () => {
        const el = ref.current;
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (mode === "pin") {
          const distancia = r.height - vh;
          return distancia <= 0 ? (r.top < 0 ? 1 : 0) : clamp01(-r.top / distancia);
        }
        return clamp01((vh - r.top) / (vh + r.height));
      },
      apply: (p) => callback.current(p),
    };
    subscribers.add(sub);
    forceNextFrame();
    if (subscribers.size === 1) rafId = requestAnimationFrame(frame);
    return () => {
      subscribers.delete(sub);
      if (subscribers.size === 0) cancelAnimationFrame(rafId);
    };
  }, [ref, mode, enabled]);
}

/** Interpolação suave entre dois limites de progresso */
export function smoothstep(inicio: number, fim: number, p: number): number {
  const t = clamp01((p - inicio) / (fim - inicio));
  return t * t * (3 - 2 * t);
}
