import { Reveal } from "@/components/motion/Reveal";
import { IconCheck } from "@/components/ui/Icons";
import { LeadForm } from "./LeadForm";

const PROMESSAS = ["Visita técnica sem custo", "Resposta rápida pelo WhatsApp", "Simulação de financiamento inclusa", "Sem compromisso"];

/** CTA final — o sol nascendo no horizonte, atrás do formulário. */
export function LeadSection() {
  return (
    <section id="orcamento" aria-labelledby="orcamento-titulo" data-section="orcamento" className="secao relative overflow-hidden grao">
      {/* Nascer do sol */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[62%] -translate-x-1/2">
        <div className="respirar size-[150vw] rounded-full bg-[radial-gradient(circle,rgb(247_147_30/0.35)_0%,rgb(229_51_42/0.12)_35%,transparent_62%)] md:size-[110vw]" />
        <div className="bg-sol absolute left-1/2 top-1/2 size-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[2px] md:size-[64vw]" />
      </div>

      <div className="container-ve relative grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-20">
        <Reveal>
          <p className="eyebrow">Orçamento gratuito</p>
          <h2 id="orcamento-titulo" className="titulo-secao mt-4 max-w-[13ch] !text-[clamp(2.5rem,1.3rem+5vw,5.4rem)]">
            Sua próxima conta de luz pode ser a <span className="texto-sol">última cara</span>.
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PROMESSAS.map((p) => (
              <li key={p} className="flex items-center gap-3 font-medium">
                <IconCheck width={20} height={20} className="shrink-0 text-sol-400" strokeWidth={2.4} />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <div className="rounded-[32px] border border-white/10 bg-noite-900/80 p-6 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)] backdrop-blur-xl md:p-9">
            <p className="font-display text-2xl font-bold tracking-tight">Receba seu orçamento</p>
            <p className="mb-7 mt-1 text-sm text-texto-suave">Leva menos de 1 minuto.</p>
            <LeadForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
