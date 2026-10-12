"use client";

import { useId, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { Reveal } from "@/components/motion/Reveal";
import { IconPlus, IconWhatsApp } from "@/components/ui/Icons";
import { FAQ as PERGUNTAS } from "@/lib/faq";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/lead";
import { pushEvent } from "@/lib/tracking";

interface ItemProps {
  pergunta: string;
  resposta: string;
  aberto: boolean;
  onAlternar: () => void;
}

function ItemFAQ({ pergunta, resposta, aberto, onAlternar }: ItemProps) {
  const id = useId();
  const { giro } = useSpring({ giro: aberto ? 45 : 0, config: { tension: 300, friction: 22 } });

  return (
    <li className="border-b border-linha">
      <h3>
        <button
          type="button"
          onClick={onAlternar}
          aria-expanded={aberto}
          aria-controls={`${id}-resposta`}
          className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-[clamp(1.1rem,1rem+0.4vw,1.35rem)] font-semibold tracking-tight transition-colors hover:text-sol-300"
        >
          {pergunta}
          <animated.span
            aria-hidden="true"
            className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${aberto ? "bg-sol border-transparent text-noite-950" : "border-linha"}`}
            style={{ rotate: giro.to((g) => `${g}deg`) }}
          >
            <IconPlus width={18} height={18} />
          </animated.span>
        </button>
      </h3>
      <div
        id={`${id}-resposta`}
        role="region"
        aria-hidden={!aberto}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-solar)] ${
          aberto ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[46rem] pb-6 pr-14 leading-relaxed text-texto-suave">{resposta}</p>
        </div>
      </div>
    </li>
  );
}

export function FAQ() {
  const [aberto, setAberto] = useState<number | null>(0);

  return (
    <section id="duvidas" aria-labelledby="faq-titulo" data-section="faq" className="cv-auto secao">
      <div className="container-ve grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2 id="faq-titulo" className="titulo-secao mt-4 max-w-[11ch]">
            Pergunte. A gente responde <span className="texto-sol">sem rodeio</span>.
          </h2>
          <p className="mt-5 max-w-[24rem] text-lg leading-relaxed text-texto-suave">
            Não achou sua dúvida? Um especialista responde agora pelo WhatsApp.
          </p>
          <a
            href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-8"
            data-track-local="faq"
          >
            <IconWhatsApp width={20} height={20} className="text-sol-400" />
            Falar com um especialista
          </a>
        </Reveal>

        <Reveal delay={120}>
          <ul className="border-t border-linha">
            {PERGUNTAS.map((item, i) => (
              <ItemFAQ
                key={item.pergunta}
                pergunta={item.pergunta}
                resposta={item.resposta}
                aberto={aberto === i}
                onAlternar={() => {
                  const abrindo = aberto !== i;
                  setAberto(abrindo ? i : null);
                  if (abrindo) pushEvent("faq_open", { faq_question: item.pergunta.slice(0, 100) });
                }}
              />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
