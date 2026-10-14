"use client";

import type { MouseEvent, ReactNode } from "react";
import { buildCtaMessage, buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/lead";
import { readStoredUtms } from "@/lib/utm";

const URL_PADRAO = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

interface WhatsAppCtaProps {
  /** data-track-local: vira o cta_id `cta_whatsapp_<local>` no GA4 e no painel */
  local: string;
  children: ReactNode;
  className?: string;
  /** Valor do simulador, levado na mensagem */
  conta?: number;
  tabIndex?: number;
}

/**
 * Botão de CTA que abre o WhatsApp do consultor direto.
 * As UTMs ficam no sessionStorage, então a mensagem final só é montada no clique;
 * o href inicial (sem UTM) serve para o SSR e para o rastreio de clique (wa.me → click_whatsapp).
 */
export function WhatsAppCta({ local, children, className, conta, tabIndex }: WhatsAppCtaProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.href = buildWhatsAppUrl(buildCtaMessage(readStoredUtms(), conta));
  }

  return (
    <a
      href={URL_PADRAO}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
      tabIndex={tabIndex}
      data-track-local={local}
    >
      {children}
    </a>
  );
}
