"use client";

import { useEffect, useState } from "react";
import { IconWhatsApp } from "@/components/ui/Icons";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/lead";

const WHATSAPP_URL = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

/**
 * Mobile: barra fixa com CTA + WhatsApp depois do hero.
 * Desktop: botão flutuante de WhatsApp.
 * Some quando o formulário de orçamento está na tela.
 */
export function FloatingActions() {
  const [passouHero, setPassouHero] = useState(false);
  const [formVisivel, setFormVisivel] = useState(false);

  useEffect(() => {
    // Aparece só quando o hero (seção alta com scroll) termina
    const hero = document.querySelector<HTMLElement>('[data-section="hero"]');
    const atualizar = () => {
      const fimHero = hero ? hero.offsetHeight - window.innerHeight : window.innerHeight;
      setPassouHero(window.scrollY > fimHero);
    };
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });

    const form = document.getElementById("orcamento");
    const observer = new IntersectionObserver(([e]) => setFormVisivel(Boolean(e?.isIntersecting)), { threshold: 0.2 });
    if (form) observer.observe(form);

    return () => {
      window.removeEventListener("scroll", atualizar);
      observer.disconnect();
    };
  }, []);

  const visivel = passouHero && !formVisivel;

  return (
    <>
      {/* Mobile */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-noite-950/90 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-500 ease-[var(--ease-solar)] lg:hidden ${
          visivel ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!visivel}
      >
        <div className="flex gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            tabIndex={visivel ? 0 : -1}
            className="grid size-14 shrink-0 place-items-center rounded-full border border-linha text-sol-400"
            data-track-local="barra-mobile"
          >
            <IconWhatsApp width={26} height={26} />
          </a>
          <a href="#orcamento" tabIndex={visivel ? 0 : -1} className="btn-sol flex-1" data-track="click_cta" data-track-local="barra-mobile">
            Orçamento Gratuito
          </a>
        </div>
      </div>

      {/* Desktop */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Visão Solar no WhatsApp"
        aria-hidden={!visivel}
        tabIndex={visivel ? 0 : -1}
        className={`group fixed bottom-8 right-8 z-40 hidden size-16 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_18px_50px_-12px_rgb(37_211_102/0.7)] transition-all duration-500 ease-[var(--ease-solar)] hover:scale-110 lg:grid ${
          visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
        data-track-local="flutuante"
      >
        <span className="pulso absolute inset-0 rounded-full bg-[#25d366]/40" aria-hidden="true" />
        <IconWhatsApp width={30} height={30} className="relative" />
      </a>
    </>
  );
}
