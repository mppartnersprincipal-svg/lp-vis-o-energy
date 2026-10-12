"use client";

import { useInView } from "@react-spring/web";
import { Reveal } from "@/components/motion/Reveal";
import { IconArrow, IconCheck } from "@/components/ui/Icons";

const MARCAS = Array.from({ length: 90 }, (_, i) => i);
const VANTAGENS = [
  "Linhas de crédito com 90 dias de carência",
  "Parcelamento no cartão com as melhores taxas do mercado",
  "Simulação do financiamento junto com o orçamento",
];

/** Anel com 90 marcações — uma por dia de carência — que acendem em sequência. */
function AnelNoventaDias() {
  const [ref, visivel] = useInView({ once: true, rootMargin: "0px 0px -20% 0px" });

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[460px]">
      <svg viewBox="0 0 220 220" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id="anel-sol" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffe01a" />
            <stop offset="0.5" stopColor="#f7931e" />
            <stop offset="1" stopColor="#e5332a" />
          </linearGradient>
        </defs>
        {MARCAS.map((i) => (
          <g key={i} transform={`rotate(${i * 4} 110 110)`}>
            <line x1="110" y1="6" x2="110" y2={i % 10 === 0 ? 24 : 18} stroke="rgb(255 255 255 / 0.1)" strokeWidth="1.6" strokeLinecap="round" />
            <line
              x1="110"
              y1="6"
              x2="110"
              y2={i % 10 === 0 ? 24 : 18}
              stroke="url(#anel-sol)"
              strokeWidth="1.8"
              strokeLinecap="round"
              style={{
                opacity: visivel ? 1 : 0,
                transition: "opacity 0.35s ease",
                transitionDelay: `${i * 16}ms`,
              }}
            />
          </g>
        ))}
        <circle cx="110" cy="110" r="78" fill="none" stroke="rgb(255 255 255 / 0.06)" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="titulo-display texto-sol text-[clamp(6rem,4rem+8vw,9.5rem)] leading-[0.8]">90</p>
          <p className="eyebrow mt-3 text-texto-suave">dias para a 1ª parcela</p>
        </div>
      </div>
    </div>
  );
}

export function Financing() {
  return (
    <section aria-labelledby="financiamento-titulo" id="financiamento" data-section="financiamento" className="cv-auto secao relative overflow-hidden">
      <div className="container-ve grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <AnelNoventaDias />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow">Financiamento facilitado</p>
            <h2 id="financiamento-titulo" className="titulo-secao mt-4">
              Instale agora. <span className="texto-sol">Pague só daqui a 90 dias.</span>
            </h2>
            <p className="mt-5 max-w-[32rem] text-lg leading-relaxed text-texto-suave">
              A economia começa no primeiro mês de geração. A primeira parcela, só depois de três meses. Você não
              precisa ter o dinheiro todo para parar de pagar caro na conta de luz.
            </p>
          </Reveal>

          <ul className="mt-8 space-y-3">
            {VANTAGENS.map((v, i) => (
              <li key={v}>
                <Reveal delay={i * 80} className="flex items-center gap-4 rounded-2xl border border-linha bg-noite-900/60 p-4">
                  <span className="bg-sol grid size-9 shrink-0 place-items-center rounded-full text-noite-950">
                    <IconCheck width={18} height={18} strokeWidth={2.6} />
                  </span>
                  <span className="font-medium">{v}</span>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={300}>
            <a href="#orcamento" className="btn-sol mt-10" data-track="click_cta" data-track-local="financiamento">
              Simular meu financiamento
              <IconArrow width={20} height={20} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
