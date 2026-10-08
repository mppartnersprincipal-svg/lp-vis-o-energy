const ITENS = [
  "Goiânia",
  "Financiamento com 90 dias de carência",
  "Aparecida de Goiânia",
  "Garantia de 12 anos nos painéis",
  "Anápolis",
  "+1.000 usinas instaladas",
  "Caldas Novas",
  "Monitoramento e pós-venda",
];

function Faixa({ invertida = false }: { invertida?: boolean }) {
  const lista = [...ITENS, ...ITENS];
  return (
    <div className="flex w-max marquee-track" style={invertida ? { animationDirection: "reverse" } : undefined}>
      {lista.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-6 pr-6 whitespace-nowrap">
          {item}
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="6" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Duas faixas cruzadas, em sentidos opostos — ritmo entre hero e conteúdo. */
export function Marquee() {
  return (
    <div aria-hidden="true" className="relative z-10 -my-6 overflow-hidden py-10">
      <div className="-rotate-[1.6deg] scale-x-105 border-y border-linha bg-noite-900 py-4 font-display text-xl font-bold tracking-tight text-texto-fraco md:text-2xl">
        <Faixa invertida />
      </div>
      <div className="bg-sol absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[1.4deg] scale-x-105 py-4 font-display text-xl font-extrabold tracking-tight text-noite-950 shadow-[0_20px_60px_-20px_rgb(247_147_30/0.6)] md:text-2xl">
        <Faixa />
      </div>
    </div>
  );
}
