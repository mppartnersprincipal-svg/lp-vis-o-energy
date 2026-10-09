"use client";

import { useRef } from "react";
import { useScrollProgress, smoothstep } from "@/hooks/useScrollProgress";
import { formatBRL } from "@/lib/format";

const CONTA_ANTES = 1200;
const CONTA_DEPOIS = 60; // 95% de economia
const KWH_GERADOS = 1140;
const BARRAS = [0.78, 0.84, 0.8, 0.9, 0.86, 0.93, 0.88, 0.95, 0.91, 0.97, 0.94, 1];
const KWH = new Intl.NumberFormat("pt-BR");

/** Seção clara: a conta de luz "derrete" conforme o visitante rola. */
export function BillMeltdown() {
  const secaoRef = useRef<HTMLElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const geradoRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useScrollProgress(secaoRef, (p) => {
    const e = smoothstep(0.1, 0.78, p);
    secaoRef.current?.style.setProperty("--e", e.toFixed(4));
    if (totalRef.current) totalRef.current.textContent = formatBRL(CONTA_ANTES - (CONTA_ANTES - CONTA_DEPOIS) * e, true);
    if (geradoRef.current) geradoRef.current.textContent = `${KWH.format(Math.round(KWH_GERADOS * e))} kWh`;
    if (pctRef.current) pctRef.current.textContent = `−${Math.round(95 * e)}%`;
  });

  return (
    <section
      ref={secaoRef}
      aria-labelledby="conta-titulo"
      id="conta-de-luz" data-section="conta"
      className="relative h-[240svh] bg-creme text-noite-950 motion-reduce:h-auto"
      style={{ ["--e" as string]: 0 }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden motion-reduce:relative motion-reduce:py-24">
        <div className="container-ve grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-20">
          <div>
            <p className="eyebrow !text-sol-700">O problema</p>
            <h2 id="conta-titulo" className="titulo-secao mt-4 max-w-[13ch]">
              Todo mês a mesma conta. Só que mais cara.
            </h2>
            <p className="mt-5 hidden max-w-[32rem] text-lg leading-relaxed text-noite-700/80 sm:block">
              Reajuste da distribuidora, bandeira vermelha, imposto. Você paga aluguel por uma energia que nunca vai ser
              sua. Com energia solar, o seu telhado vira uma usina e a conta despenca.
            </p>
            <p className="mt-6 flex items-baseline gap-3 lg:mt-10">
              <span ref={pctRef} className="titulo-display text-[clamp(3rem,2rem+5vw,6.5rem)] text-sol-700" aria-hidden="true">
                −0%
              </span>
              <span className="max-w-[12ch] text-sm font-semibold leading-tight text-noite-700/70">na conta de luz, todo mês</span>
            </p>
          </div>

          {/* A conta */}
          <figure
            aria-label="Exemplo ilustrativo: conta de R$ 1.200,00 que cai para R$ 60,00 com energia solar"
            className="relative mx-auto w-full max-w-[400px] -rotate-2 rounded-t-[18px] bg-white px-6 pb-10 pt-6 font-mono text-[12.5px] text-noite-800 shadow-[0_50px_90px_-40px_rgb(7_7_10/0.45)] lg:-rotate-3"
            style={{
              mask: "radial-gradient(circle 7px at 50% 100%, #0000 98%, #000) 0 0 / 18px 100% repeat-x",
              WebkitMask: "radial-gradient(circle 7px at 50% 100%, #0000 98%, #000) 0 0 / 18px 100% repeat-x",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold tracking-[0.12em]">CONTA DE ENERGIA</p>
                <p className="mt-0.5 text-[10.5px] text-noite-700/60">Exemplo ilustrativo · residencial</p>
              </div>
              <span className="rounded-full border border-noite-950/15 px-2 py-0.5 text-[10px]">MÊS ATUAL</span>
            </div>

            <div className="my-4 border-t border-dashed border-noite-950/25" />

            <dl className="space-y-2.5">
              <div className="flex justify-between">
                <dt>Consumo do mês</dt>
                <dd>1.200 kWh</dd>
              </div>
              <div className="flex justify-between">
                <dt>Gerado pelo seu sistema</dt>
                <dd className="font-bold text-sol-600">
                  <span ref={geradoRef}>0 kWh</span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Bandeira tarifária</dt>
                <dd className="relative h-6 w-[112px]">
                  <span
                    className="absolute inset-0 grid place-items-center rounded-full bg-sol-700 text-[10px] font-bold text-white"
                    style={{ opacity: "clamp(0, calc((0.55 - var(--e)) * 10), 1)" }}
                  >
                    VERMELHA
                  </span>
                  <span
                    className="bg-sol absolute inset-0 grid place-items-center rounded-full text-[10px] font-bold text-noite-950"
                    style={{ opacity: "clamp(0, calc((var(--e) - 0.45) * 10), 1)" }}
                  >
                    NÃO PESA MAIS
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-5">
              <p className="text-[10.5px] text-noite-700/60">Histórico dos últimos 12 meses</p>
              <div aria-hidden="true" className="mt-2 flex h-20 items-end gap-1.5">
                {BARRAS.map((altura, i) => (
                  <span
                    key={i}
                    className="flex-1 origin-bottom rounded-t-[3px]"
                    style={{
                      height: `${altura * 100}%`,
                      background: i === BARRAS.length - 1 ? "var(--gradiente-sol)" : "rgb(229 51 42 / 0.75)",
                      scale: `1 calc(1 - var(--e) * ${(0.9 * ((i + 4) / (BARRAS.length + 3))).toFixed(3)})`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="my-4 border-t border-dashed border-noite-950/25" />

            <div className="flex items-end justify-between">
              <span className="font-bold tracking-[0.12em]">TOTAL A PAGAR</span>
              <span ref={totalRef} className="font-display text-[2rem] font-extrabold leading-none tracking-tight text-noite-950">
                {formatBRL(CONTA_ANTES, true)}
              </span>
            </div>

            {/* Carimbo */}
            <span
              aria-hidden="true"
              className="absolute bottom-16 right-5 grid size-28 rotate-[-14deg] place-items-center rounded-full border-[3px] border-sol-600 text-center font-display text-[13px] font-extrabold leading-tight tracking-wide text-sol-600"
              style={{
                opacity: "clamp(0, calc((var(--e) - 0.86) * 9), 1)",
                scale: "calc(1.7 - clamp(0, calc((var(--e) - 0.86) * 9), 1) * 0.7)",
              }}
            >
              PAGO
              <br />
              PELO SOL
            </span>
          </figure>
        </div>
      </div>
    </section>
  );
}
