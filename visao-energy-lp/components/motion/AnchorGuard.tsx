"use client";

import { useEffect } from "react";
import { getLenis } from "./SmoothScroll";

/**
 * As seções abaixo da dobra usam `content-visibility: auto` (altura estimada até renderizar).
 * Num salto por âncora (#orcamento, links do menu) a posição de destino sairia errada, então,
 * antes do Lenis calcular a rolagem, desliga o recurso de vez (html.cv-off) e força o layout.
 * Roda em captura, antes do listener de âncoras do Lenis.
 */
export function AnchorGuard() {
  useEffect(() => {
    const desligar = () => {
      if (document.documentElement.classList.contains("cv-off")) return;
      document.documentElement.classList.add("cv-off");
      void document.documentElement.offsetHeight; // layout síncrono com as alturas reais
      // A página cresce (seções reais > estimativa): sem isso o Lenis usa o limite antigo e para antes
      getLenis()?.resize();
    };

    if (location.hash.length > 1) {
      desligar();
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    }

    function handleClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (link && link.getAttribute("href") !== "#") desligar();
    }
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
