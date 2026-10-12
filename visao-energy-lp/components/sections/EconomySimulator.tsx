"use client";

import { useState, type ReactNode } from "react";
import { animated, useSpring, type SpringValue } from "@react-spring/web";
import { CONTA_MAX, CONTA_MIN, simulateEconomy } from "@/lib/simulator";
import { formatBRL } from "@/lib/format";
import { pushEvent } from "@/lib/tracking";
import { useLead } from "@/components/LeadContext";
import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal } from "@/components/motion/Reveal";
import { IconArrow } from "@/components/ui/Icons";

const ATALHOS = [300, 600, 1000, 2500];
const VALOR_INICIAL = 600;
const TECLAS_SLIDER = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);
const brl = (v: number) => formatBRL(Math.round(v));
const decimal = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function EconomySimulator() {
  const [conta, setConta] = useState(VALOR_INICIAL);
  const { setContaSimulada } = useLead();
  const r = simulateEconomy(conta);

  const s = useSpring({
    economia: r.economiaMensal,
    anual: r.economiaAnual,
    vida: r.economiaVidaUtil,
    kwp: r.potenciaKwp,
    paineis: r.numeroPaineis,
    pct: r.percentualEconomia,
    config: { tension: 180, friction: 28 },
  });

  const preenchimento = ((conta - CONTA_MIN) / (CONTA_MAX - CONTA_MIN)) * 100;

  function registrar(valor: number) {
    pushEvent("simulator_change", { conta: valor });
  }

  function escolherAtalho(valor: number) {
    setConta(valor);
    registrar(valor);
  }

  return (
    <section id="simulador" aria-labelledby="simulador-titulo" data-section="simulador" className="cv-auto secao relative overflow-hidden bg-noite-900">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgb(247_147_30/0.16),transparent_65%)]" />

      <div className="container-ve relative grid gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">Simulador de economia</p>
            <h2 id="simulador-titulo" className="titulo-secao mt-4 max-w-[12ch]">
              Quanto <span className="texto-sol">você</span> vai economizar?
            </h2>
            <p className="mt-5 max-w-[30rem] text-lg leading-relaxed text-texto-suave">
              Arraste até o valor médio da sua conta de luz e veja, na hora, o tamanho da economia e do sistema ideal
              para o seu telhado.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-10 rounded-[28px] border border-linha bg-noite-950/60 p-6 md:p-8">
            <label htmlFor="conta-range" className="text-sm font-semibold text-texto-suave">
              Valor médio da sua conta de luz
            </label>
            <output htmlFor="conta-range" className="mt-2 block font-display text-[clamp(2.6rem,2rem+2.5vw,3.6rem)] font-extrabold tracking-tight">
              {formatBRL(conta)}
              <span className="ml-1 text-lg font-semibold text-texto-fraco">/mês</span>
            </output>

            <input
              id="conta-range"
              type="range"
              min={CONTA_MIN}
              max={CONTA_MAX}
              step={50}
              value={conta}
              onChange={(e) => setConta(Number(e.target.value))}
              onPointerUp={() => registrar(conta)}
              onKeyUp={(e) => TECLAS_SLIDER.has(e.key) && registrar(conta)}
              aria-valuetext={`${formatBRL(conta)} por mês`}
              className="range-sol mt-6"
              style={{ ["--fill" as string]: `${preenchimento}%` }}
            />
            <div className="mt-2 flex justify-between font-mono text-[11px] text-texto-fraco">
              <span>{formatBRL(CONTA_MIN)}</span>
              <span>{formatBRL(CONTA_MAX)}+</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Valores rápidos">
              {ATALHOS.map((valor) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => escolherAtalho(valor)}
                  aria-pressed={conta === valor}
                  className="min-h-11 rounded-full border border-linha px-4 text-sm font-semibold transition-colors hover:border-sol-500/60 aria-pressed:border-sol-500 aria-pressed:bg-sol-500/10 aria-pressed:text-sol-300"
                >
                  {formatBRL(valor)}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <GlowCard className="p-6 md:p-10">
            <Medidor pct={s.pct} economia={s.economia} />

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-linha bg-linha">
              <Dado rotulo="Economia por ano">
                <animated.span>{s.anual.to(brl)}</animated.span>
              </Dado>
              <Dado rotulo="Em 25 anos de sistema" destaque>
                <animated.span>{s.vida.to(brl)}</animated.span>
              </Dado>
              <Dado rotulo="Potência do sistema">
                <animated.span>{s.kwp.to(decimal)}</animated.span> kWp
              </Dado>
              <Dado rotulo="Placas solares">
                <animated.span>{s.paineis.to((v) => Math.round(v).toString())}</animated.span>
                <span className="text-base font-semibold text-texto-fraco"> · ~{r.areaM2} m²</span>
              </Dado>
            </dl>

            <a
              href="#orcamento"
              onClick={() => setContaSimulada(conta)}
              className="btn-sol mt-8 w-full"
              data-track="click_cta"
              data-track-local="simulador"
            >
              Quero o orçamento com esse valor
              <IconArrow width={20} height={20} />
            </a>
            <p className="mt-4 text-center text-xs leading-relaxed text-texto-fraco">
              Estimativa com base na irradiação média de Goiás e na tarifa média local. O valor exato é definido na
              visita técnica gratuita.
            </p>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}

interface MedidorProps {
  pct: SpringValue<number>;
  economia: SpringValue<number>;
}

/** Medidor em arco — o círculo da marca vira um gauge. */
function Medidor({ pct, economia }: MedidorProps) {
  return (
    <div className="relative mx-auto aspect-[2/1.12] w-full max-w-[420px]">
      <svg viewBox="0 0 200 112" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id="gauge-sol" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ffe01a" />
            <stop offset="0.45" stopColor="#f7931e" />
            <stop offset="1" stopColor="#e5332a" />
          </linearGradient>
        </defs>
        <path d="M14 100a86 86 0 0 1 172 0" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="12" strokeLinecap="round" />
        {/* Brilho: traço largo e translúcido por baixo (sem CSS filter, que cria artefatos de composição) */}
        <animated.path
          d="M14 100a86 86 0 0 1 172 0"
          fill="none"
          stroke="url(#gauge-sol)"
          strokeWidth="26"
          strokeLinecap="round"
          opacity={0.14}
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={pct.to((v) => 100 - v * 100)}
        />
        <animated.path
          d="M14 100a86 86 0 0 1 172 0"
          fill="none"
          stroke="url(#gauge-sol)"
          strokeWidth="12"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={pct.to((v) => 100 - v * 100)}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <p className="eyebrow text-texto-fraco">Você economiza até</p>
        <p className="titulo-display mt-2 text-[clamp(2.6rem,1.8rem+3vw,4rem)]">
          <animated.span className="texto-sol">{economia.to(brl)}</animated.span>
        </p>
        <p className="mt-1 text-sm text-texto-suave">
          por mês · <animated.span>{pct.to((v) => `${Math.round(v * 100)}%`)}</animated.span> da sua conta
        </p>
      </div>
    </div>
  );
}

interface DadoProps {
  rotulo: string;
  destaque?: boolean;
  children: ReactNode;
}

function Dado({ rotulo, destaque = false, children }: DadoProps) {
  return (
    <div className="bg-noite-800 p-4 md:p-5">
      <dt className="text-xs font-semibold text-texto-fraco">{rotulo}</dt>
      <dd className={`mt-1.5 font-display text-[clamp(1.25rem,1rem+1vw,1.7rem)] font-bold tracking-tight ${destaque ? "texto-sol" : ""}`}>
        {children}
      </dd>
    </div>
  );
}
