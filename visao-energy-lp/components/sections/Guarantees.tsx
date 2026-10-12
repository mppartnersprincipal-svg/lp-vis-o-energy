import type { ComponentType, SVGProps } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { IconFerramenta, IconInversor, IconMonitor, IconPainel } from "@/components/ui/Icons";
import { GARANTIAS } from "@/lib/constants";

const ICONES: ComponentType<SVGProps<SVGSVGElement>>[] = [IconPainel, IconInversor, IconFerramenta, IconMonitor];

/** Selo circular girando — o círculo da marca como carimbo de garantia. */
function SeloGarantia() {
  return (
    <div aria-hidden="true" className="relative size-36 shrink-0 md:size-44">
      <svg viewBox="0 0 200 200" className="girar-lento absolute inset-0 size-full">
        <defs>
          <path id="selo-circulo" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
        </defs>
        <text className="fill-texto-suave font-mono text-[15px] tracking-[0.32em]">
          <textPath href="#selo-circulo">GARANTIA • PÓS-VENDA • MONITORAMENTO •</textPath>
        </text>
      </svg>
      <div className="bg-sol absolute inset-[30%] rounded-full shadow-[0_0_60px_-6px_rgb(247_147_30/0.7)]" />
    </div>
  );
}

export function Guarantees() {
  return (
    <section id="garantias" aria-labelledby="garantias-titulo" data-section="garantias" className="cv-auto secao">
      <div className="container-ve">
        <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Garantias</p>
            <h2 id="garantias-titulo" className="titulo-secao mt-4 max-w-[16ch]">
              Garantia em tudo. <span className="texto-sol">Até no que vem depois da obra.</span>
            </h2>
          </div>
          <SeloGarantia />
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GARANTIAS.map((g, i) => {
            const Icone = ICONES[i];
            return (
              <li key={g.titulo}>
                <Reveal delay={i * 80} className="h-full">
                  <GlowCard className="flex h-full flex-col p-7">
                    <span className="grid size-12 place-items-center rounded-2xl border border-linha bg-noite-950 text-sol-400">
                      <Icone width={24} height={24} />
                    </span>
                    <p className="titulo-display texto-sol mt-10 text-[2.6rem] leading-none">{g.prazo}</p>
                    <h3 className="mt-3 font-display text-xl font-bold tracking-tight">{g.titulo}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-texto-suave">{g.detalhe}</p>
                  </GlowCard>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
