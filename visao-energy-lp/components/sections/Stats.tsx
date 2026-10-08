import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { EMPRESA } from "@/lib/constants";

const NUMEROS = [
  { valor: EMPRESA.anosDeMercado, prefixo: "", sufixo: "", rotulo: "anos de mercado", detalhe: "em Goiás" },
  { valor: EMPRESA.usinasInstaladas, prefixo: "+", sufixo: "", rotulo: "usinas instaladas", detalhe: "residenciais e comerciais" },
  { valor: EMPRESA.economiaMaxima, prefixo: "", sufixo: "%", rotulo: "de economia", detalhe: "na conta de luz, até" },
  { valor: EMPRESA.carenciaDias, prefixo: "", sufixo: "", rotulo: "dias de carência", detalhe: "para a 1ª parcela" },
];

export function Stats() {
  return (
    <section aria-labelledby="numeros-titulo" data-section="numeros" className="secao">
      <div className="container-ve">
        <Reveal>
          <p className="eyebrow">Por que confiar</p>
          <h2 id="numeros-titulo" className="titulo-secao mt-4 max-w-[18ch]">
            Energia solar não é aposta. <span className="text-texto-fraco">É matemática — e já fizemos essa conta mais de mil vezes.</span>
          </h2>
        </Reveal>

        <dl className="mt-16 grid grid-cols-2 border-t border-linha lg:grid-cols-4">
          {NUMEROS.map((n, i) => (
            <Reveal
              key={n.rotulo}
              delay={i * 80}
              className={`flex flex-col-reverse gap-3 border-b border-linha py-8 pr-4 lg:border-b-0 lg:py-12 ${
                i % 2 === 1 ? "pl-5 border-l lg:pl-8" : "lg:pl-8"
              } ${i > 0 ? "lg:border-l" : "lg:pl-0"}`}
            >
              <dt>
                <span className="block font-semibold">{n.rotulo}</span>
                <span className="text-sm text-texto-fraco">{n.detalhe}</span>
              </dt>
              <dd className="titulo-display texto-sol text-[clamp(3.2rem,2rem+4.5vw,6rem)] leading-none">
                <CountUp to={n.valor} prefix={n.prefixo} suffix={n.sufixo} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
