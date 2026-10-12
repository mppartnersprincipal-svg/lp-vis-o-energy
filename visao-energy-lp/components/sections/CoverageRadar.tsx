import { Reveal } from "@/components/motion/Reveal";

// Posições aproximadas (escala ~0,26%/km), com Goiânia no centro do radar
const CIDADES = [
  { nome: "Goiânia", x: 50, y: 50, sede: true, rotuloEsquerda: false },
  { nome: "Aparecida de Goiânia", x: 47, y: 57, sede: false, rotuloEsquerda: true },
  { nome: "Anápolis", x: 62, y: 37, sede: false, rotuloEsquerda: false },
  { nome: "Caldas Novas", x: 76, y: 74, sede: false, rotuloEsquerda: true },
];

function Radar() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-full border border-white/15 bg-[radial-gradient(circle,rgb(247_147_30/0.1),rgb(14_14_19)_70%)] shadow-[0_0_120px_-40px_rgb(247_147_30/0.5)]">
      {[0.25, 0.5, 0.75].map((r) => (
        <span key={r} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/12" style={{ width: `${r * 100}%`, height: `${r * 100}%` }} />
      ))}
      <span className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
      <span className="absolute inset-x-0 top-1/2 h-px bg-white/10" />

      {/* Varredura */}
      <span
        className="girar-radar absolute inset-0 rounded-full"
        style={{ background: "conic-gradient(from 0deg, rgb(255 193 7 / 0.32), transparent 22%, transparent)" }}
      />

      {CIDADES.map((c) => (
        <span key={c.nome} className="absolute" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
          <span className="pulso absolute -left-3 -top-3 size-6 rounded-full bg-sol-500/50" style={{ animationDelay: `${c.x * 30}ms` }} />
          <span className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${c.sede ? "bg-sol size-4 shadow-[0_0_24px_rgb(247_147_30)]" : "size-2.5 bg-sol-300"}`} />
          <span
            className={`absolute top-1 whitespace-nowrap font-mono text-[10.5px] tracking-[0.1em] text-texto/90 max-sm:text-[9px] ${
              c.rotuloEsquerda ? "right-3" : "left-3"
            }`}
          >
            {c.nome.toUpperCase()}
          </span>
        </span>
      ))}
    </div>
  );
}

export function CoverageRadar() {
  return (
    <section aria-labelledby="atendimento-titulo" id="atendimento" data-section="atendimento" className="cv-auto secao bg-noite-900">
      <div className="container-ve grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="eyebrow">Onde atendemos</p>
          <h2 id="atendimento-titulo" className="titulo-secao mt-4 max-w-[14ch]">
            Goiânia e região, com equipe <span className="texto-sol">perto de você</span>.
          </h2>
          <p className="mt-5 max-w-[30rem] text-lg leading-relaxed text-texto-suave">
            Atendimento local significa visita técnica rápida, instalação sem enrolação e pós-venda que aparece quando
            você precisa.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {CIDADES.map((c) => (
              <li key={c.nome} className="rounded-full border border-linha bg-noite-950/60 px-4 py-2.5 text-sm font-semibold">
                {c.nome}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <Radar />
        </Reveal>
      </div>
    </section>
  );
}
