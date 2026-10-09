"use client";

import { useEffect } from "react";
import { ctaIdFor, pushEvent } from "@/lib/tracking";
import { readStoredUtms } from "@/lib/utm";

const MARCOS_SCROLL = [25, 50, 75, 100] as const;

/**
 * Cliques: qualquer link wa.me → click_whatsapp, tel: → click_phone,
 * e elementos com data-track="click_cta". data-track-local identifica a posição.
 */
export function useClickTracking() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const alvo = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-track]");
      if (!alvo) return;
      const href = alvo.getAttribute("href") ?? "";
      const local = alvo.dataset.trackLocal ?? "desconhecido";
      const params = { local, texto: alvo.textContent?.trim().slice(0, 60), ...readStoredUtms() };
      if (href.includes("wa.me")) pushEvent("click_whatsapp", { ...params, cta_id: ctaIdFor("click_whatsapp", local) });
      else if (href.startsWith("tel:")) pushEvent("click_phone", params);
      else if (alvo.dataset.track === "click_cta") pushEvent("click_cta", { ...params, cta_id: ctaIdFor("click_cta", local) });
    }
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);
}

export function useScrollDepthTracking() {
  useEffect(() => {
    const disparados = new Set<number>();
    let agendado = false;
    function medir() {
      agendado = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
      for (const marco of MARCOS_SCROLL) {
        if (pct >= marco - 1 && !disparados.has(marco)) {
          disparados.add(marco);
          pushEvent(`scroll_${marco}`);
        }
      }
    }
    function handleScroll() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(medir);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

/** section_view uma vez por seção marcada com data-section="nome" */
export function useSectionViewTracking() {
  useEffect(() => {
    const vistas = new Set<string>();
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const nome = (entrada.target as HTMLElement).dataset.section;
          if (entrada.isIntersecting && nome && !vistas.has(nome)) {
            vistas.add(nome);
            pushEvent("section_view", { secao: nome });
          }
        }
      },
      // Faixa central da tela: funciona também para seções altas com sticky (ex.: 440svh)
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );
    document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
